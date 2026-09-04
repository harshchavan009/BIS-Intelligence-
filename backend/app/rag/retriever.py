import os
import re
import json
from typing import List, Dict, Any, Tuple
import chromadb
from sentence_transformers import SentenceTransformer
from backend.app.core.config import settings

class HybridRetriever:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HybridRetriever, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # 1. Load structured product-to-IS mappings
        self.structured_map_path = os.path.join(settings.STRUCTURED_DIR, "is_product_map.json")
        self.products = []
        if os.path.exists(self.structured_map_path):
            with open(self.structured_map_path, "r", encoding="utf-8") as f:
                self.products = json.load(f)

        # 2. Connect to ChromaDB
        self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DIR)
        try:
            self.collection = self.chroma_client.get_collection(settings.CHROMA_COLLECTION)
        except Exception:
            self.collection = None

        # 3. Load Multilingual Embedding Model
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)

    def search_structured(self, query: str) -> List[Dict[str, Any]]:
        """
        Fast exact and fuzzy matching over extracted IS-number <-> product lookup table.
        Runs in <1ms deterministically.
        Supports product descriptions, keywords, aliases, Hindi cross-lingual terms, and raw IS numbers.
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

        # 1. Hindi keyword mapping for cross-lingual structured matching
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

        # 2. Decompounding and common industry alias expansion
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
            "irons": "electric iron",
            "fire extinguisher": "portable fire extinguishers",
            "extinguishers": "fire extinguishers"
        }
        for alias, expansion in alias_expansions.items():
            if re.search(rf'\b{re.escape(alias)}\b', q_lower):
                q_lower += f" {expansion}"

        # 3. Clean alphanumeric strings for exact IS number matching
        clean_q_is = re.sub(r'[^a-z0-9]', '', q_lower)
        # Extract digits sequence (e.g. 269, 12330, 1786, 62368, 1489, 455, 302, 2347, 15683)
        digits_match = re.search(r'\b(\d{3,5}(?:\s*\(Part\s*\d+\))?)\b', q_raw, re.IGNORECASE)
        extracted_digits = digits_match.group(1).replace(' ', '').lower() if digits_match else None

        # Build search tokens with basic singularization
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

            # Check 1: Exact IS number match (normalized e.g. "is269" == "is269" or "is12330" in clean_p_is)
            if clean_q_is == clean_p_is:
                score = 1.0
                match_type = "exact"
            elif clean_q_is.startswith("is") and len(clean_q_is) > 4 and clean_q_is in clean_p_is:
                score = 1.0
                match_type = "exact"
            elif extracted_digits and (extracted_digits in clean_p_is or re.search(rf'\b{re.escape(extracted_digits)}\b', p_is)):
                score = 1.0
                match_type = "exact"
            # Check 2: Exact or substring product match
            elif q_lower in p_name or p_name in q_lower:
                score = 0.95
                match_type = "exact"
            else:
                # Check 3: Token overlap with stem matching
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

        # Sort by relevance score descending
        matched.sort(key=lambda x: x["relevance_score"], reverse=True)
        return matched[:10]

    def search_dense(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Dense vector search in ChromaDB using multilingual embeddings.
        Supports cross-lingual Hindi & English queries seamlessly.
        """
        if not self.collection:
            return []

        # Generate query vector
        query_embedding = self.model.encode(query).tolist()

        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
        except Exception as e:
            print(f"Dense search error: {e}")
            return []

        chunks = []
        if results and results.get("ids") and len(results["ids"][0]) > 0:
            for i in range(len(results["ids"][0])):
                meta = results["metadatas"][0][i]
                doc_text = results["documents"][0][i]
                dist = results["distances"][0][i] if "distances" in results and results["distances"] else 0.5
                sim = max(0.0, 1.0 - (dist / 2.0))

                chunks.append({
                    "document_title": meta.get("document_title", "BIS Standard Document"),
                    "source_file": meta.get("source_file", ""),
                    "clause_ref": meta.get("clause_ref", "General"),
                    "page_number": int(meta.get("page_number", 1)),
                    "excerpt": doc_text,
                    "score": round(sim, 3),
                    "grounded": True
                })

        return chunks

    def retrieve(self, query: str, top_k: int = 5) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Hybrid retrieval combining structured lookups with dense semantic search.
        Returns (structured_products, dense_chunks).
        """
        structured_matches = self.search_structured(query)
        dense_chunks = self.search_dense(query, top_k=top_k)

        # Deduplicate dense chunks by (source_file, clause_ref)
        unique_chunks = []
        seen = set()
        for ch in dense_chunks:
            key = (ch["source_file"], ch["clause_ref"], ch["page_number"])
            if key not in seen:
                seen.add(key)
                unique_chunks.append(ch)

        return structured_matches, unique_chunks[:top_k]

retriever = HybridRetriever()
