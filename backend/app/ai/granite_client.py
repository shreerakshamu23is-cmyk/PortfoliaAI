import json
import logging
import httpx
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger("granite_client")

class IBMGraniteClient:
    """Client for interacting with IBM Granite AI models via WatsonX API or HTTP endpoint."""
    
    def __init__(self):
        self.api_key = settings.WATSONX_APIKEY
        self.project_id = settings.WATSONX_PROJECT_ID
        self.url = settings.WATSONX_URL
        self.model_id = settings.GRANITE_MODEL_ID
        self.iam_token: Optional[str] = None

    def is_configured(self) -> bool:
        return bool(self.api_key and self.project_id)

    async def get_iam_token(self) -> Optional[str]:
        """Obtain IAM bearer token using IBM Cloud API key."""
        if not self.api_key:
            return None
        
        iam_url = "https://iam.cloud.ibm.com/identity/token"
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": self.api_key
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                res = await client.post(iam_url, headers=headers, data=data)
                if res.status_code == 200:
                    token_data = res.json()
                    return token_data.get("access_token")
                else:
                    logger.warning(f"Failed to get IBM IAM token: {res.status_code} {res.text}")
                    return None
            except Exception as e:
                logger.error(f"Error fetching IBM IAM token: {e}")
                return None

    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> Optional[str]:
        """Calls IBM Granite model on WatsonX AI."""
        if not self.is_configured():
            logger.info("IBM WatsonX credentials not set. Skipping IBM Granite call.")
            return None

        token = await self.get_iam_token()
        if not token:
            return None

        endpoint = f"{self.url.rstrip('/')}/ml/v1/text/generation?version=2023-05-29"
        
        combined_prompt = ""
        if system_prompt:
            combined_prompt += f"<|system|>\n{system_prompt}\n"
        combined_prompt += f"<|user|>\n{prompt}\n<|assistant|>\n"

        payload = {
            "input": combined_prompt,
            "parameters": {
                "decoding_method": "greedy",
                "max_new_tokens": 1500,
                "min_new_tokens": 1,
                "stop_sequences": ["<|user|>", "<|endoftext|>"],
                "repetition_penalty": 1.05
            },
            "model_id": self.model_id,
            "project_id": self.project_id
        }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                res = await client.post(endpoint, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    results = data.get("results", [])
                    if results:
                        generated_text = results[0].get("generated_text", "")
                        return generated_text.strip()
                else:
                    logger.warning(f"IBM Granite generation error: {res.status_code} {res.text}")
                    return None
            except Exception as e:
                logger.error(f"HTTP error calling IBM Granite: {e}")
                return None

granite_client = IBMGraniteClient()
