import re
import json
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from backend.app.rag.retriever import retriever
from backend.app.rag.groundedness import checker
from backend.app.rag.prompts import get_system_prompt
from backend.app.core.llm_provider import get_llm_provider

class GraphState(TypedDict):
    query: str
    language: str
    capability: str
    structured_matches: List[Dict[str, Any]]
    retrieved_chunks: List[Dict[str, Any]]
    answer: str
    sources: List[Dict[str, Any]]
    grounded_overall: bool
    grounded_percentage: float

def route_intent(state: GraphState) -> str:
    """Classifies user intent to route to specialized graph node."""
    q = state["query"].lower()
    
    # 1. Hallmarking check
    if any(k in q for k in ["hallmark", "huid", "gold jewellery", "हॉलमार्क", "सोने"]):
        return "hallmarking_node"
        
    # 2. Consumer queries / genuine ISI check
    if any(k in q for k in ["genuine", "fake", "bis care", "complaint", "feedback letter", "report", "असली", "नकली", "शिकायत"]):
        return "consumer_node"
        
    # 3. Lab / CBTF queries
    if any(k in q for k in ["cbtf", "test facility", "laboratory", "labs", "testing cluster", "प्रयोगशाला", "परीक्षण"]):
        return "lab_node"
        
    # 4. Certification Scheme & timeline process
    if any(k in q for k in ["scheme-i", "scheme-ii", "scheme-iv", "scheme 1", "scheme 2", "scheme 4", "timeline", "process for grant", "योजना"]):
        return "scheme_node"
        
    # 5. Standards Recommender / Product query
    if any(k in q for k in ["standard for", "is number", "which standard", "qco for", "cement", "laptop", "smart watch", "helmet", "cylinder", "steel"]):
        return "standards_node"
        
    return "general_qa_node"


async def retrieve_context_node(state: GraphState) -> GraphState:
    """Retrieves both structured product records and dense vector chunks."""
    structured, dense = retriever.retrieve(state["query"], top_k=5)
    return {
        **state,
        "structured_matches": structured,
        "retrieved_chunks": dense
    }


async def general_qa_node(state: GraphState) -> GraphState:
    provider = get_llm_provider()
    sys_prompt = get_system_prompt(state["language"])
    answer = await provider.generate(state["query"], sys_prompt, state["retrieved_chunks"], state["language"])
    sources, grounded, pct = checker.verify_groundedness(answer, state["retrieved_chunks"])
    return {
        **state,
        "capability": "general_qa",
        "answer": answer,
        "sources": sources,
        "grounded_overall": grounded,
        "grounded_percentage": pct
    }


async def standards_node(state: GraphState) -> GraphState:
    provider = get_llm_provider()
    sys_prompt = get_system_prompt(state["language"])
    answer = await provider.generate(state["query"], sys_prompt, state["retrieved_chunks"], state["language"])
    sources, grounded, pct = checker.verify_groundedness(answer, state["retrieved_chunks"])
    return {
        **state,
        "capability": "standards_recommend",
        "answer": answer,
        "sources": sources,
        "grounded_overall": grounded,
        "grounded_percentage": pct
    }


async def scheme_node(state: GraphState) -> GraphState:
    provider = get_llm_provider()
    sys_prompt = get_system_prompt(state["language"])
    answer = await provider.generate(state["query"], sys_prompt, state["retrieved_chunks"], state["language"])
    sources, grounded, pct = checker.verify_groundedness(answer, state["retrieved_chunks"])
    return {
        **state,
        "capability": "schemes_guide",
        "answer": answer,
        "sources": sources,
        "grounded_overall": grounded,
        "grounded_percentage": pct
    }


async def lab_node(state: GraphState) -> GraphState:
    provider = get_llm_provider()
    sys_prompt = get_system_prompt(state["language"])
    answer = await provider.generate(state["query"], sys_prompt, state["retrieved_chunks"], state["language"])
    sources, grounded, pct = checker.verify_groundedness(answer, state["retrieved_chunks"])
    return {
        **state,
        "capability": "labs_suggest",
        "answer": answer,
        "sources": sources,
        "grounded_overall": grounded,
        "grounded_percentage": pct
    }


async def consumer_node(state: GraphState) -> GraphState:
    provider = get_llm_provider()
    sys_prompt = get_system_prompt(state["language"])
    answer = await provider.generate(state["query"], sys_prompt, state["retrieved_chunks"], state["language"])
    sources, grounded, pct = checker.verify_groundedness(answer, state["retrieved_chunks"])
    return {
        **state,
        "capability": "consumer_mode",
        "answer": answer,
        "sources": sources,
        "grounded_overall": grounded,
        "grounded_percentage": pct
    }


async def hallmarking_node(state: GraphState) -> GraphState:
    provider = get_llm_provider()
    sys_prompt = get_system_prompt(state["language"])
    answer = await provider.generate(state["query"], sys_prompt, state["retrieved_chunks"], state["language"])
    sources, grounded, pct = checker.verify_groundedness(answer, state["retrieved_chunks"])
    return {
        **state,
        "capability": "hallmarking",
        "answer": answer,
        "sources": sources,
        "grounded_overall": grounded,
        "grounded_percentage": pct
    }


def build_bis_graph():
    workflow = StateGraph(GraphState)

    workflow.add_node("retrieve_context", retrieve_context_node)
    workflow.add_node("general_qa_node", general_qa_node)
    workflow.add_node("standards_node", standards_node)
    workflow.add_node("scheme_node", scheme_node)
    workflow.add_node("lab_node", lab_node)
    workflow.add_node("consumer_node", consumer_node)
    workflow.add_node("hallmarking_node", hallmarking_node)

    workflow.set_entry_point("retrieve_context")
    workflow.add_conditional_edges(
        "retrieve_context",
        route_intent,
        {
            "general_qa_node": "general_qa_node",
            "standards_node": "standards_node",
            "scheme_node": "scheme_node",
            "lab_node": "lab_node",
            "consumer_node": "consumer_node",
            "hallmarking_node": "hallmarking_node"
        }
    )

    workflow.add_edge("general_qa_node", END)
    workflow.add_edge("standards_node", END)
    workflow.add_edge("scheme_node", END)
    workflow.add_edge("lab_node", END)
    workflow.add_edge("consumer_node", END)
    workflow.add_edge("hallmarking_node", END)

    return workflow.compile()

bis_graph = build_bis_graph()
