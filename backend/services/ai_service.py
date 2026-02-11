import os
from openai import OpenAI
from typing import List, Dict

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("WARNING: OPENAI_API_KEY not found. AI features will operate in mock mode.")
    client = None
else:
    client = OpenAI(api_key=api_key)

class AIService:
    @staticmethod
    async def generate_insight(data: Dict) -> str:
        """Generates an executive summary based on raw data."""
        if not client:
            return "Executive AI Forecast: Sales are trending upward by 12%. Recommend optimizing seafood stock in Patiobella."
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are the AI assistant for Hugamara Hospitality Group CEO. Analyze the provided data and provide a concise, professional executive insight."},
                    {"role": "user", "content": f"Analyze this data: {data}"}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating insight: {str(e)}"

    @staticmethod
    async def process_query(query: str, context: Dict) -> str:
        """Processes a natural language query from the CEO."""
        if not client:
            return "As Hugamara AI, I've analyzed your request. Currently, Patiobella shows a 15% margin lead over Eateroo. I recommend investigating Vendor A's recent price spike."
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are Hugamara AI. Answer the CEO's query based on the current business context. Be precise and professional."},
                    {"role": "user", "content": f"Context: {context}\nQuery: {query}"}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error processing query: {str(e)}"

ai_service = AIService()
