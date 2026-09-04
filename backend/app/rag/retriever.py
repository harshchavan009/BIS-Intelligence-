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
        """
        if not self.products:
            return []

        q_lower = query.lower().strip()
        matched = []

        # Hindi keyword mapping for cross-lingual structured matching
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
            "पंप": "pump"
        }
        for h_word, en_word in hindi_map.items():
            if h_word in q_lower:
                q_lower += f" {en_word}"

        # 1. Look for IS number patterns like 'IS 12330', 'IS12330', '12330'
        is_num_match = re.search(r'\b(?:IS\s*[\/\:]*\s*[A-Z]*\s*)?(\d{3,5}(?:\s*\(Part\s*\d+\))?)\b', query, re.IGNORECASE)
        extracted_num = is_num_match.group(1) if is_num_match else None

        for item in self.products:
            score = 0.0
            match_type = "fuzzy"
            p_name = item["product_name"].lower()
            p_is = item["is_number"].lower()
            p_cat = item["category"].lower()

            # Exact IS number match
            if extracted_num and extracted_num.lower() in p_is:
                score = 1.0
                match_type = "exact"
            # Exact product match
            elif q_lower in p_name or p_name in q_lower:
                score = 0.95
                match_type = "exact"
            else:
                # Token overlap / keyword match
                q_words = [w for w in re.split(r'\W+', q_lower) if len(w) > 2]
                overlap = sum(1 for w in q_words if w in p_name or w in p_cat or w in p_is)
                if overlap > 0:
                    score = 0.5 + (overlap * 0.15)
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
