import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv("backend/.env")
key = os.getenv("GEMINI_API_KEY")

async def main():
    print(f"Testing GEMINI_API_KEY: {key[:8]}...{key[-4:] if key else 'NONE'}")
    async with httpx.AsyncClient(timeout=8.0) as client:
        # 1. Test generateContent
        for model in ["gemini-2.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.7-flash", "gemma-4-26b-a4b-it"]:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
            try:
                payload = {
                    "contents": [{"parts": [{"text": "You are Mockora AI. Answer in 5 words: What is an algorithm?"}]}]
                }
                res = await client.post(url, json=payload)
                print(f"Model {model} -> HTTP {res.status_code}")
                if res.status_code == 200:
                    text = res.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    print(f"Response: {text.strip()}")
                    break
            except Exception as e:
                print(f"Error {model}: {e}")

if __name__ == "__main__":
    asyncio.run(main())
