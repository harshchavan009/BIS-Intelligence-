import os
import re
import json
from typing import List, Dict, Any, Tuple, Optional
import chromadb
from rank_bm25 import BM25Okapi
from backend.app.core.config import settings

class HybridRetriever:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HybridRetriever, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # 1. Load structured product-to-IS mappings from canonical files
        self.structured_map_path = os.path.join(settings.STRUCTURED_DIR, "is_product_map.json")
        self.products = []
        if os.path.exists(self.structured_map_path):
            with open(self.structured_map_path, "r", encoding="utf-8") as f:
                self.products = json.load(f)

        self.labs_master_path = os.path.join(settings.STRUCTURED_DIR, "hallmarking_labs_master.json")
        self.hallmarking_labs = []
        if os.path.exists(self.labs_master_path):
            with open(self.labs_master_path, "r", encoding="utf-8") as f:
                self.hallmarking_labs = json.load(f)

        self.ahc_master_path = os.path.join(settings.STRUCTURED_DIR, "ahc_centres_master.json")
        self.ahc_centres = []
        if os.path.exists(self.ahc_master_path):
            with open(self.ahc_master_path, "r", encoding="utf-8") as f:
                self.ahc_centres = json.load(f)

        # 2. Connect to ChromaDB
        self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DIR)
        try:
            self.collection = self.chroma_client.get_collection(settings.CHROMA_COLLECTION)
        except Exception:
            self.collection = None

        # 3. Dense Embedding Model (Lazy Loaded to protect 512MB RAM limit on Render)
        self._model = None
        self._model_load_attempted = False
        self._model_available = True

        # 4. Build in-memory BM25 index over all indexed chunks
        self.chunk_pool: List[Dict[str, Any]] = []
        self.bm25: Optional[BM25Okapi] = None
        self._build_bm25_index()

    @property
    def model(self):
        """
        Thread-safe lazy initialization for the multilingual dense embedding model.
        Prevents premature model loading during startup/import, keeping process RSS under 150MB.
        Safely falls back to BM25 + structured matching if memory threshold is exceeded.
        """
        if settings.EMBEDDING_MODE in ("lightweight", "disabled") or (settings.APP_MODE == "demo" and settings.EMBEDDING_MODE != "full"):
            return None

        if self._model is None and not self._model_load_attempted:
            self._model_load_attempted = True

            # In low-memory demo mode on Render (512MB RAM), avoid loading 500MB PyTorch model
            try:
                import psutil
                mem = psutil.virtual_memory()
                if mem.available < 280 * 1024 * 1024 and settings.APP_MODE == "demo":
                    print(f"[HybridRetriever] Available memory ({mem.available / 1024 / 1024:.1f} MB) is below safe headroom for PyTorch. Operating in lightweight BM25 + Structured mode.")
                    self._model_available = False
                    return None
            except Exception:
                pass

            try:
                from sentence_transformers import SentenceTransformer
                print(f"[HybridRetriever] Lazily initializing dense embedding model: {settings.EMBEDDING_MODEL}...")
                self._model = SentenceTransformer(settings.EMBEDDING_MODEL)
                self._model_available = True
                print("[HybridRetriever] Dense embedding model loaded successfully.")
            except (MemoryError, Exception) as e:
                print(f"[HybridRetriever] Could not load embedding model ({e}). Gracefully falling back to BM25 + Structured search.")
                self._model = None
                self._model_available = False
        return self._model

    def _build_bm25_index(self):
        if not self.collection:
            return

        try:
            records = self.collection.get(include=["documents", "metadatas"])
            if not records or not records.get("documents"):
                return

            corpus_tokens = []
            self.chunk_pool = []
            for doc_id, doc_text, meta in zip(records["ids"], records["documents"], records["metadatas"]):
                chunk_entry = {
                    "id": doc_id,
                    "document_title": meta.get("document_title", "BIS Regulatory Document"),
                    "source_file": meta.get("source_file") or meta.get("source_doc", ""),
                    "source_doc": meta.get("source_doc") or meta.get("source_file", ""),
                    "clause_ref": meta.get("clause_ref") or meta.get("clause_number", "General"),
                    "clause_number": meta.get("clause_number", ""),
                    "scheme": meta.get("scheme", ""),
                    "doc_type": meta.get("doc_type", ""),
                    "page_number": int(meta.get("page_number", 1)),
                    "effective_date": meta.get("effective_date") or meta.get("as_of_date", ""),
                    "as_of_date": meta.get("as_of_date", ""),
                    "state": meta.get("state", ""),
                    "osl_code": meta.get("osl_code", ""),
                    "sha256": meta.get("sha256", ""),
                    "text": doc_text
                }
                self.chunk_pool.append(chunk_entry)

                # Composite tokenization for BM25 (title + clause + state + osl + text)
                full_text = f"{chunk_entry['document_title']} {chunk_entry['clause_ref']} {chunk_entry['state']} {chunk_entry['osl_code']} {doc_text}"
                tokens = self._tokenize(full_text)
                corpus_tokens.append(tokens)

            if corpus_tokens:
                self.bm25 = BM25Okapi(corpus_tokens)
                print(f"[HybridRetriever] Initialized BM25 index with {len(corpus_tokens)} chunks.")
        except Exception as e:
            print(f"[HybridRetriever] Failed to build BM25 index: {e}")

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        """Simple, fast alphanumeric tokenization."""
        return [w.lower() for w in re.findall(r'[a-zA-Z0-9]+', text)]

    def detect_category(self, query: str) -> Optional[str]:
        """Detects domain/category context for category-aware pre-filtering."""
        q = query.lower()
        if any(k in q for k in ["cement", "सीमेंट", "opc", "ppc", "concrete", "is 269", "is 455", "is 1489", "is 12330"]):
            return "Cement & Building Materials"
        if any(k in q for k in ["steel", "स्टील", "tmt", "rebar", "is 1786", "is 2062", "billet", "ingot"]):
            return "Steel & Metallurgy"
        if any(k in q for k in ["cro", "electronics", "laptop", "smart watch", "smartwatch", "cctv", "headphone", "tws", "62368", "meity"]):
            return "Electronics & IT Goods"
        if any(k in q for k in ["cbtf", "cluster", "msme", "उद्यम", "udyam", "small enterprise", "cmd-i/2:12:8"]):
            return "Scheme-I (CBTF MSME)"
        if any(k in q for k in ["surveillance", "market surveillance", "निगरानी", "sample drawing", "cmd-i/2:12:7"]):
            return "Scheme-I (Surveillance)"
        if any(k in q for k in ["scheme-iv", "scheme 4", "scheme iv", "coc", "certificate of conformity", "cmd-i/2:16:1"]):
            return "Scheme-IV (CoC)"
        if any(k in q for k in ["qco", "quality control order", "section 16", "गुणवत्ता नियंत्रण आदेश"]):
            return "QCO Regulatory Guidance"
        if any(k in q for k in ["gas cylinder", "lpg", "is 3196", "is 3224", "is 8737", "peso"]):
            return "Gas Cylinders & Pressure Vessels"
        if any(k in q for k in ["lab", "labs", "laboratory", "laboratories", "osl", "recognized lab", "recognised lab", "barc", "iit", "icar", "drdo", "iocl"]):
            return "Testing Laboratories"
        if any(k in q for k in ["gold", "silver", "hallmark", "hallmarking", "jeweller", "jewellers", "ahc", "huid", "हॉलमार्क", "is 1417", "ppt", "fineness", "carat", "caratage", "outlet", "central assistance"]):
            return "Precious Metals & Hallmarking"
        return None

    def search_structured(self, query: str) -> List[Dict[str, Any]]:
        """
        Deterministic fast exact and fuzzy matching over extracted IS-number <-> product lookup table.
        Runs in <1ms deterministically.
        """
        if not self.products:
            if os.path.exists(self.structured_map_path):
                with open(self.structured_map_path, "r", encoding="utf-8") as f:
                    self.products = json.load(f)
            else:
                return []

        q_raw = query.strip()
        q_lower = q_raw.lower()
        matched = []

        # Cross-lingual Hindi dictionary mapping
        hindi_map = {
            "सीमेंट": "cement",
            "सोना": "gold",
            "आभूषण": "jewellery",
            "हॉलमार्क": "hallmarking",
            "स्टील": "steel",
            "खिलौना": "toy",
            "खिलौने": "toys",
            "हेलमेट": "helmet",
            "तार": "wire",
            "पंप": "pump",
            "कुकर": "pressure cooker",
            "इस्त्री": "electric iron"
        }
        for h_word, en_word in hindi_map.items():
            if h_word in q_lower:
                q_lower += f" {en_word}"

        # Common industry alias expansions
        alias_expansions = {
            "smartwatch": "smart watch wearable",
            "smartwatches": "smart watch wearable",
            "tmt": "tmt steel bars deformed",
            "tmt bars": "tmt steel bars deformed",
            "lpg": "lpg cylinder gas",
            "cylinders": "cylinder gas",
            "cylinder": "gas cylinder lpg",
            "opc": "ordinary portland cement",
            "ppc": "portland pozzolana cement",
            "laptops": "laptop",
            "phones": "mobile phone",
            "helmets": "helmet",
            "toys": "toy",
            "lights": "lighting led luminaires",
            "leds": "led luminaires",
            "cooker": "pressure cooker",
            "cookers": "pressure cooker",
            "iron": "electric iron",
            "irons": "electric iron"
        }
        for alias, expansion in alias_expansions.items():
            if re.search(rf'\b{re.escape(alias)}\b', q_lower):
                q_lower += f" {expansion}"

        # 1. Exact OSL Code Match (7-digit identifier)
        osl_match = re.search(r'\b([5-9]\d{6})\b', q_raw)
        if osl_match and self.hallmarking_labs:
            target_osl = osl_match.group(1)
            for lab in self.hallmarking_labs:
                if lab.get("osl_code") == target_osl:
                    matched.append({
                        "product_name": f"{lab['name']} (OSL: {target_osl})",
                        "is_number": f"OSL Code: {target_osl}",
                        "category": f"BIS {lab.get('group', 'Recognised')} Laboratory",
                        "scheme": lab.get("group", "GROUP-1"),
                        "standard_title": f"Status: {lab.get('status', 'Private')} | State: {lab.get('state', '')} | Valid: {lab.get('valid_up_to', '')}",
                        "relevance_score": 1.0,
                        "match_type": "exact",
                        "lab_details": lab
                    })

        # 2. Lab Name Match / Recognition Status
        if any(k in q_lower for k in ["lab", "laboratory", "recognized", "recognised", "osl", "barc", "iit", "icar", "drdo", "iocl"]) and self.hallmarking_labs:
            for lab in self.hallmarking_labs:
                lab_name_lower = lab["name"].lower()
                clean_lab_name = re.sub(r'[^a-z0-9]', '', lab_name_lower)
                clean_q = re.sub(r'[^a-z0-9]', '', q_lower)
                # Exact match or significant containment
                if (clean_lab_name in clean_q or 
                    (len(clean_lab_name) > 15 and clean_lab_name[:18] in clean_q) or
                    (len(lab["name"]) > 10 and any(part.strip().lower() in q_lower for part in re.split(r'[,()\-]+', lab["name"]) if len(part.strip()) > 8))):
                    matched.append({
                        "product_name": lab["name"],
                        "is_number": f"OSL Code: {lab.get('osl_code', 'N/A')}",
                        "category": f"BIS {lab.get('group', 'Recognised')} Laboratory",
                        "scheme": lab.get("group", "GROUP-1"),
                        "standard_title": f"State: {lab.get('state', '')} | Status: {lab.get('status', '')} | Valid: {lab.get('valid_up_to', '')}",
                        "relevance_score": 0.98,
                        "match_type": "exact",
                        "lab_details": lab
                    })

        # 3. State-wise Laboratory Query (e.g. 'List labs in Delhi')
        state_query_match = re.search(r'\b(?:in|of|at|for)\s+([a-zA-Z\s\.\&]+)', q_lower)
        if any(k in q_lower for k in ["lab", "labs", "laboratory", "laboratories"]) and self.hallmarking_labs:
            for pat, st_name in [
                ("delhi", "Delhi"), ("maharashtra", "Maharashtra"), ("gujarat", "Gujarat"),
                ("rajasthan", "Rajasthan"), ("tamil nadu|tamilnadu", "Tamil Nadu"),
                ("karnataka", "Karnataka"), ("uttar pradesh|u\.p\.", "Uttar Pradesh"),
                ("punjab", "Punjab"), ("haryana", "Haryana"), ("kerala", "Kerala"),
                ("west bengal|w\.b\.", "West Bengal"), ("odisha|orissa", "Odisha"),
                ("bihar", "Bihar"), ("jharkhand", "Jharkhand"), ("assam", "Assam"),
                ("telangana", "Telangana"), ("andhra pradesh|a\.p\.", "Andhra Pradesh"),
                ("uttarakhand", "Uttarakhand"), ("madhya pradesh|m\.p\.", "Madhya Pradesh")
            ]:
                if re.search(rf'\b({pat})\b', q_lower):
                    state_labs = [l for l in self.hallmarking_labs if l.get("state", "").lower() == st_name.lower()]
                    if state_labs:
                        matched.append({
                            "product_name": f"BIS Recognized Laboratories in {st_name} ({len(state_labs)} Labs)",
                            "is_number": f"{len(state_labs)} Laboratories",
                            "category": "State Laboratory Roster",
                            "scheme": "GROUP-1 & GROUP-2",
                            "standard_title": f"Official list of {len(state_labs)} BIS recognized/utilized laboratories in {st_name}.",
                            "relevance_score": 0.95,
                            "match_type": "exact",
                            "total_count": len(state_labs)
                        })
                    break

        # 4. Assaying & Hallmarking (A&H) Centres Central Assistance Query
        if any(k in q_lower for k in ["a&h", "ahc", "assaying", "central assistance", "assistance"]) and self.ahc_centres:
            for pat, st_name in [
                ("rajasthan", "Rajasthan"), ("delhi", "Delhi"), ("maharashtra", "Maharashtra"),
                ("gujarat", "Gujarat"), ("tamil nadu|tamilnadu", "Tamil Nadu"),
                ("karnataka", "Karnataka"), ("uttar pradesh|u\.p\.", "Uttar Pradesh"),
                ("punjab", "Punjab"), ("haryana", "Haryana"), ("kerala", "Kerala"),
                ("west bengal|w\.b\.", "West Bengal"), ("odisha|orissa", "Odisha"),
                ("bihar", "Bihar"), ("jharkhand", "Jharkhand"), ("assam", "Assam"),
                ("telangana", "Telangana"), ("andhra pradesh|a\.p\.", "Andhra Pradesh")
            ]:
                if re.search(rf'\b({pat})\b', q_lower):
                    state_ahcs = [a for a in self.ahc_centres if a.get("state", "").lower() == st_name.lower()]
                    if state_ahcs:
                        matched.append({
                            "product_name": f"A&H Centres with Central Assistance in {st_name} ({len(state_ahcs)} Centres)",
                            "is_number": f"{len(state_ahcs)} A&H Centres",
                            "category": "Assaying & Hallmarking Centres",
                            "scheme": "Central Assistance Scheme",
                            "standard_title": f"A&H centres setup at deficient locations in {st_name} with central financial assistance.",
                            "relevance_score": 0.95,
                            "match_type": "exact",
                            "total_count": len(state_ahcs)
                        })
                    break

        clean_q_is = re.sub(r'[^a-z0-9]', '', q_lower)
        digits_match = re.search(r'\b(\d{3,5}(?:\s*\(Part\s*\d+\))?)\b', q_raw, re.IGNORECASE)
        extracted_digits = digits_match.group(1).replace(' ', '').lower() if digits_match else None

        tokens = [w for w in re.split(r'\W+', q_lower) if len(w) > 1]
        token_stems = set(tokens)
        for t in tokens:
            if t.endswith('ies'):
                token_stems.add(t[:-3] + 'y')
            elif t.endswith('es') and len(t) > 4:
                token_stems.add(t[:-2])
            elif t.endswith('s') and len(t) > 3:
                token_stems.add(t[:-1])

        for item in self.products:
            score = 0.0
            match_type = "fuzzy"
            p_name = item["product_name"].lower()
            p_is = item["is_number"].lower()
            p_cat = item["category"].lower()
            clean_p_is = re.sub(r'[^a-z0-9]', '', p_is)

            # Exact IS number match
            if clean_q_is == clean_p_is:
                score = 1.0
                match_type = "exact"
            elif clean_q_is.startswith("is") and len(clean_q_is) > 4 and clean_q_is in clean_p_is:
                score = 1.0
                match_type = "exact"
            elif extracted_digits and (extracted_digits in clean_p_is or re.search(rf'\b{re.escape(extracted_digits)}\b', p_is)):
                score = 1.0
                match_type = "exact"
            # Exact product substring
            elif q_lower in p_name or p_name in q_lower:
                score = 0.95
                match_type = "exact"
            else:
                # Token overlap with stem matching
                p_tokens = set(re.split(r'\W+', f"{p_name} {p_cat} {p_is}"))
                overlap = len(token_stems.intersection(p_tokens))
                if overlap > 0:
                    score = 0.45 + (overlap * 0.15)
                    match_type = "fuzzy"

            if score > 0.4:
                item_copy = dict(item)
                item_copy["relevance_score"] = min(score, 1.0)
                item_copy["match_type"] = match_type
                matched.append(item_copy)

        # Filter out noisy weak product fuzzy matches when query is specific to hallmarking/labs
        if any(k in q_lower for k in ["hallmark", "jeweller", "huid", "ppt", "fineness", "ahc", "laboratory", "laboratories", "osl code"]) and not any(k in q_lower for k in ["cement", "steel", "cylinder", "wire", "cable", "transformer"]):
            matched = [m for m in matched if m.get("match_type") == "exact" or m.get("relevance_score", 0) >= 0.85]

        matched.sort(key=lambda x: x["relevance_score"], reverse=True)
        return matched[:10]

    def search_dense(self, query: str, top_k: int = 15) -> List[Dict[str, Any]]:
        """
        Dense vector search in ChromaDB using normalized embeddings and cosine similarity.
        Safely returns empty list if dense embedding is disabled or unavailable under low memory.
        """
        if not self.collection:
            return []

        embedder = self.model
        if embedder is None:
            return []

        try:
            query_embedding = embedder.encode(query, normalize_embeddings=True).tolist()
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
        except Exception as e:
            print(f"[HybridRetriever] Dense search error: {e}")
            return []

        chunks = []
        if results and results.get("ids") and len(results["ids"][0]) > 0:
            for i in range(len(results["ids"][0])):
                meta = results["metadatas"][0][i]
                doc_text = results["documents"][0][i]
                dist = results["distances"][0][i] if "distances" in results and results["distances"] else 0.5
                # With hnsw:space=cosine and unit-normalized vectors: cosine_sim = 1.0 - dist
                sim = max(0.0, min(1.0, 1.0 - dist))

                chunks.append({
                    "id": results["ids"][0][i],
                    "document_title": meta.get("document_title", "BIS Standard Document"),
                    "source_file": meta.get("source_file") or meta.get("source_doc", ""),
                    "source_doc": meta.get("source_doc") or meta.get("source_file", ""),
                    "doc_type": meta.get("doc_type", ""),
                    "clause_ref": meta.get("clause_ref") or meta.get("clause_number", "General"),
                    "clause_number": meta.get("clause_number", ""),
                    "state": meta.get("state", ""),
                    "osl_code": meta.get("osl_code", ""),
                    "as_of_date": meta.get("as_of_date", ""),
                    "scheme": meta.get("scheme", ""),
                    "page_number": int(meta.get("page_number", 1)),
                    "excerpt": doc_text,
                    "dense_score": round(sim, 3),
                    "dense_rank": i,
                    "grounded": True
                })

        return chunks

    def search_bm25(self, query: str, top_k: int = 15) -> List[Dict[str, Any]]:
        """
        Keyword search over all indexed chunks using BM25Okapi.
        """
        if not self.bm25 or not self.chunk_pool:
            return []

        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []

        scores = self.bm25.get_scores(query_tokens)
        scored_indices = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)[:top_k]

        bm25_results = []
        for rank, (idx, score) in enumerate(scored_indices):
            if score <= 0:
                continue
            chunk = self.chunk_pool[idx]
            bm25_results.append({
                "id": chunk["id"],
                "document_title": chunk["document_title"],
                "source_file": chunk["source_file"],
                "source_doc": chunk.get("source_doc", chunk["source_file"]),
                "doc_type": chunk.get("doc_type", ""),
                "clause_ref": chunk["clause_ref"],
                "clause_number": chunk.get("clause_number", ""),
                "state": chunk.get("state", ""),
                "osl_code": chunk.get("osl_code", ""),
                "as_of_date": chunk.get("as_of_date", ""),
                "scheme": chunk["scheme"],
                "page_number": chunk["page_number"],
                "excerpt": chunk["text"],
                "bm25_score": round(float(score), 2),
                "bm25_rank": rank,
                "grounded": True
            })

        return bm25_results

    def is_out_of_corpus(self, query: str, top_dense: List[Dict[str, Any]], top_bm25: List[Dict[str, Any]], structured: List[Dict[str, Any]]) -> Tuple[bool, str]:
        """
        Evaluates whether query falls outside the indexed BIS publications.
        Returns (is_out_of_corpus: bool, reason_or_abstention: str).
        """
        q = query.lower()

        # Explicit out-of-scope triggers (aerospace FAA, FDA medical/cosmetic drugs, US FCC, nuclear ASME, ISO 9001 generic enterprise)
        out_of_scope_keywords = [
            "aerospace", "jet engine", "turbine blade", "faa compliance",
            "us fda", "fda approved", "fda approval", "cosmetics labeling fda",
            "fcc part 15", "fcc compliance", "nuclear reactor coolant",
            "asme section iii", "iso 9001 quality management general",
            "european union ce mark declaration"
        ]
        if any(k in q for k in out_of_scope_keywords):
            return True, "The requested query is not covered within the indexed BIS regulatory publications."

        # Explicit in-scope keywords for Hallmarking & Laboratories Reference Corpus
        hallmarking_in_scope = [
            "hallmark", "hallmarked", "hallmarking", "huid", "jeweller", "jewellery", "gold", "silver",
            "fineness", "ppt", "40 ppt", "5 ppt", "2 ppt", "counter sample", "surveillance",
            "laboratory", "laboratories", "osl", "barc", "iit", "icar", "drdo", "iocl",
            "central assistance", "a&h", "ahc", "is 1417", "is 2112"
        ]
        if any(k in q for k in hallmarking_in_scope) or re.search(r'\b(lab|labs)\b', q):
            return False, ""

        # If there is a strong structured match, it is in-corpus
        if structured and structured[0].get("relevance_score", 0) >= 0.7:
            return False, ""

        # Check score floor
        max_dense_sim = top_dense[0]["dense_score"] if top_dense else 0.0
        max_bm25 = top_bm25[0]["bm25_score"] if top_bm25 else 0.0

        # Floor: dense similarity must be >= 0.46 or BM25 score >= 4.0 or structured score >= 0.5
        if max_dense_sim < 0.46 and max_bm25 < 4.0:
            return True, "The requested query is not covered within the indexed BIS regulatory publications."

        return False, ""

    def search_hybrid(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Reciprocal Rank Fusion (RRF) combining Dense Vector search and BM25 keyword search.
        Formula: RRF_Score(d) = (0.6 / (60 + dense_rank)) + (0.4 / (60 + bm25_rank)) + category_boost
        """
        dense_results = self.search_dense(query, top_k=15)
        bm25_results = self.search_bm25(query, top_k=15)

        # Detect category context for boosting
        target_category = self.detect_category(query)

        # RRF dictionary keyed by chunk ID
        candidates: Dict[str, Dict[str, Any]] = {}
        K_RRF = 60.0

        # Dense contributions
        for r in dense_results:
            cid = r["id"]
            dense_rank = r["dense_rank"]
            rrf_score = 0.6 / (K_RRF + dense_rank)
            candidates[cid] = {
                "id": cid,
                "document_title": r["document_title"],
                "source_file": r["source_file"],
                "source_doc": r.get("source_doc", r["source_file"]),
                "doc_type": r.get("doc_type", ""),
                "clause_ref": r["clause_ref"],
                "clause_number": r.get("clause_number", ""),
                "state": r.get("state", ""),
                "osl_code": r.get("osl_code", ""),
                "as_of_date": r.get("as_of_date", ""),
                "scheme": r["scheme"],
                "page_number": r["page_number"],
                "excerpt": r["excerpt"],
                "dense_score": r["dense_score"],
                "dense_rank": dense_rank,
                "bm25_score": 0.0,
                "bm25_rank": 999,
                "rrf_score": rrf_score,
                "grounded": True
            }

        # BM25 contributions
        for r in bm25_results:
            cid = r["id"]
            bm25_rank = r["bm25_rank"]
            bm_contrib = 0.4 / (K_RRF + bm25_rank)
            if cid in candidates:
                candidates[cid]["rrf_score"] += bm_contrib
                candidates[cid]["bm25_score"] = r["bm25_score"]
                candidates[cid]["bm25_rank"] = bm25_rank
            else:
                candidates[cid] = {
                    "id": cid,
                    "document_title": r["document_title"],
                    "source_file": r["source_file"],
                    "source_doc": r.get("source_doc", r["source_file"]),
                    "doc_type": r.get("doc_type", ""),
                    "clause_ref": r["clause_ref"],
                    "clause_number": r.get("clause_number", ""),
                    "state": r.get("state", ""),
                    "osl_code": r.get("osl_code", ""),
                    "as_of_date": r.get("as_of_date", ""),
                    "scheme": r["scheme"],
                    "page_number": r["page_number"],
                    "excerpt": r["excerpt"],
                    "dense_score": 0.0,
                    "dense_rank": 999,
                    "bm25_score": r["bm25_score"],
                    "bm25_rank": bm25_rank,
                    "rrf_score": bm_contrib,
                    "grounded": True
                }

        # Category boost
        if target_category:
            for cid, c in candidates.items():
                if (target_category.lower() in c.get("scheme", "").lower() or 
                    target_category.lower() in c.get("source_file", "").lower() or
                    target_category.lower() in c.get("doc_type", "").lower() or
                    target_category.lower() in c.get("document_title", "").lower()):
                    c["rrf_score"] += 0.015

        # Sort candidates by combined RRF score descending
        fused = sorted(candidates.values(), key=lambda x: x["rrf_score"], reverse=True)

        # Deduplicate candidates by unique chunk ID
        unique_fused = []
        seen = set()
        for c in fused:
            if c["id"] not in seen:
                seen.add(c["id"])
                # Assign normalized composite score for display
                c["score"] = round(min(1.0, c.get("dense_score", 0.6) * 0.7 + (c["rrf_score"] * 30.0) * 0.3), 3)
                unique_fused.append(c)

        return unique_fused[:top_k]

    def retrieve(self, query: str, top_k: int = 5) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Unified retrieval entry point.
        Returns: (structured_matches, hybrid_chunks)
        If query is out-of-corpus, hybrid_chunks includes an explicit abstention element.
        """
        structured = self.search_structured(query)
        dense_candidates = self.search_dense(query, top_k=5)
        bm25_candidates = self.search_bm25(query, top_k=5)

        is_abstain, abstain_msg = self.is_out_of_corpus(query, dense_candidates, bm25_candidates, structured)

        if is_abstain:
            abstention_chunk = {
                "id": "abstention_0",
                "document_title": "Out-of-Corpus Regulatory Notice",
                "source_file": "N/A",
                "clause_ref": "Abstention Floor",
                "scheme": "Out of Scope",
                "page_number": 1,
                "excerpt": abstain_msg,
                "score": 0.0,
                "dense_score": 0.0,
                "bm25_score": 0.0,
                "rrf_score": 0.0,
                "grounded": False,
                "is_abstention": True,
                "abstention_message": abstain_msg
            }
            return structured, [abstention_chunk]

        fused_chunks = self.search_hybrid(query, top_k=top_k)
        return structured, fused_chunks

retriever = HybridRetriever()

def verify_citation_integrity(response_text: str, candidate_chunks: List[Dict[str, Any]]) -> str:
    """
    Guarantees citation integrity:
    Replaces any hallucinated citation [n] where n > len(candidate_chunks) with valid citations.
    """
    valid_count = len(candidate_chunks)
    if valid_count == 0:
        # Strip all [n] citations if no chunks retrieved
        return re.sub(r'\[\d+\]', '', response_text)

    def replace_citation(match):
        num = int(match.group(1))
        if 1 <= num <= valid_count:
            return match.group(0)
        # Hallucinated citation: clamp to top 1
        return "[1]"

    return re.compile(r'\[(\d+)\]').sub(replace_citation, response_text)
