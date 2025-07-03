import os
from openai import OpenAI as OpenAIClient
import google.generativeai as genai
import requests
from dotenv import load_dotenv

load_dotenv()

openai_client = OpenAIClient(api_key=os.getenv("OPENAI_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")

class AIClientService:
    @staticmethod
    def generate_completion(ainame, aimodel, temperature, maxTokens, prompt_text):
        ainame = ainame.lower()
        print('ainame: ' + ainame)
        print('!!! PROMPT BEGIN: \n' + prompt_text + '\n !!! PROMPT_END')

        if ainame == "openai":
            response = openai_client.chat.completions.create(
                model=aimodel,
                messages=[
                    {"role": "system", "content": "You are an expert HR assistant."},
                    {"role": "user", "content": prompt_text}
                ],
                temperature=temperature,
                max_tokens=maxTokens,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0,
            )
            result = response.choices[0].message.content.strip()
            print('AI result: ',result)
            return result

        elif ainame == "gemini":
            gemini_model = genai.GenerativeModel(aimodel,
                                                 generation_config={
                    "temperature": temperature,
                    "max_output_tokens": maxTokens
                })
            try:
                gemini_response = gemini_model.generate_content(prompt_text)
            except Exception as e:
                print("Gemini ERROR:", str(e))
                raise
            
            result = gemini_response.text.strip()
            #print(result)
            return result

        elif ainame == "deepseek":
            print('!!! deepseek ')
            try:
                resp = requests.post(
                    "https://api.deepseek.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {deepseek_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": aimodel,
                        "messages": [
                            {"role": "system", "content": "You are a helpful assistant."},
                            {"role": "user", "content": prompt_text}
                        ],
                        "temperature": temperature,
                        "max_tokens": maxTokens
                    }
                )
                # Если статус не 2xx
                if resp.status_code != 200:
                    print("DeepSeek response status:", resp.status_code)
                    print("DeepSeek response text:", resp.text)
                    resp.raise_for_status()

                json_data = resp.json()
                result = json_data["choices"][0]["message"]["content"].strip()
                print("DeepSeek result:", result)
                return result

            except Exception as e:
                print("DeepSeek error:", str(e))
                raise

        else:
            raise ValueError(f"AI provider '{ainame}' not supported.")
