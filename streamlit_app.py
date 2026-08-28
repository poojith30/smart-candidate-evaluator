import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="AI Candidate Evaluator", layout="wide")

components.iframe(
    "https://smart-candidate-evaluator.vercel.app",
    height=900,
    scrolling=True
)
