from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from googletrans import Translator  # Biblioteca para tradução

app = FastAPI()

class TextRequest(BaseModel):
    text: str
    lang: str

@app.post("/generate-summary")
async def generate_summary(request: TextRequest):
    translator = Translator()
    translated = await translator.translate(request.text, dest=request.lang)
    translated_text = translated.text
    print(f"Texto traduzido: {translated_text}")
    openai_api_key = "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"  
    prompt_template = "Resuma o seguinte texto: {text}"
    prompt = PromptTemplate(input_variables=["text"], template=prompt_template)
    model = OpenAI(temperature=0.7, openai_api_key=openai_api_key)
    chain = LLMChain(prompt=prompt, llm=model)
    summary = chain.run({"text": translated_text})
    return {"summary": summary}
