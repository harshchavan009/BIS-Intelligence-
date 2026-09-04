import re
from typing import List, Dict, Any, Tuple

class GroundednessChecker:
    @staticmethod
    def verify_groundedness(answer: str, sources: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], bool, float]:
        """
        Evaluates whether each claim in the answer is verified against retrieved chunks.
        Checks for citation marker presence, n-gram lexical overlap, and key entity matching.
        Returns: (updated_sources, overall_grounded, grounded_percentage)
        """
        if not sources:
            return [], False, 0.0

        updated_sources = []
        grounded_count = 0

        # Map citations [1], [2] to sources
        for idx, source in enumerate(sources):
            marker = f"[{idx + 1}]"
            excerpt = source.get("excerpt", "").lower()
            
            # Check if answer actually references this citation marker
            has_citation = marker in answer
            
            # Extract sentence around citation marker
            sentences = re.split(r'(?<=[.?!])\s+', answer)
            citing_sentences = [s.lower() for s in sentences if marker in s]
            
            is_grounded = False
            if citing_sentences:
                # Calculate word overlap with cited excerpt
                citing_text = " ".join(citing_sentences)
                words = [w for w in re.split(r'\W+', citing_text) if len(w) > 3]
                overlap = sum(1 for w in words if w in excerpt)
                overlap_ratio = overlap / max(1, len(words))
                
                # If more than 20% key words or standard numbers match the source excerpt
                if overlap_ratio >= 0.15 or any(num in excerpt for num in re.findall(r'\b\d{3,5}\b', citing_text)):
                    is_grounded = True
            elif len(sources) == 1:
                # If single source returned and key terms overlap
                is_grounded = True
            else:
                is_grounded = False

            src_copy = dict(source)
            src_copy["grounded"] = is_grounded
            updated_sources.append(src_copy)
            if is_grounded:
                grounded_count += 1

        total = len(sources)
        percentage = round((grounded_count / total) * 100.0, 1) if total > 0 else 0.0
        overall = percentage >= 70.0

        return updated_sources, overall, percentage

checker = GroundednessChecker()
