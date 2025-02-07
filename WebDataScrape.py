from langchain_groq import ChatGroq
import os 
os.environ['USER_AGENT'] = 'myagent'

llm = ChatGroq(
    model="deepseek-r1-distill-llama-70b",
    groq_api_key='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'
    
)

url = "https://www.google.com/about/careers/applications/jobs/results/93855920110346950-senior-software-engineer-aiml-genai-google-cloud-ai"
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader(url)
page_data = loader.load().pop().page_content

from langchain_core.prompts import PromptTemplate
prompt_template = PromptTemplate.from_template(
    """
    ###SCRAPED DATA:
    {page_data}
    
    ### INSTRUCTIONS:
    Given the raw data scraped from a company's job posting webpage, extract the information and provide it in JSON format with the following keys: "role","Qualification Required", "Experience Required(Minimum)" "job_description", "tech_stack" .
    Only return the valid Json.
    """
)

chain = prompt_template|llm
response = chain.invoke(input={'page_data':page_data})
job_data = response.content
print(response.content)

