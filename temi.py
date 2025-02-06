from langchain_groq import ChatGroq
import os 
# 
os.environ['USER_AGENT'] = 'myagent'
llm = ChatGroq(
    model="llama3-8b-8192",
    groq_api_key='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'
    # other params...
)

from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://www.linkedin.com/jobs/view/senior-software-engineer-%E2%80%93-simulation-and-virtualization-at-nvidia-4142964162?refId=HJmHDRYrMhtS7E0ajoFLYg%3D%3D&trackingId=AOOvulAGRgeSiFGekLO%2FAg%3D%3D")
page_data = loader.load().pop().page_content

from langchain_core.prompts import PromptTemplate
prompt_template = PromptTemplate.from_template(
    """
    ### RAW SCRAPED DATA:
    {chunk}
    
    ### INSTRUCTIONS:
    Given the raw data scraped from a company's job posting webpage, extract the information and provide it in JSON format with the following keys: "experience", "job_description", "tech_stack", and "role".
    """
)

# Split page_data into smaller chunks
def chunk_text(text, max_length=1000):
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0
    for word in words:
        if current_length + len(word) > max_length:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_length = 0
        current_chunk.append(word)
        current_length += len(word) + 1
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks

chunks = chunk_text(page_data)

results = []
for chunk in chunks:
    response = llm.generate({"prompt": prompt_template.format(chunk=chunk)})
    results.append(response)

# Combine results as needed
combined_results = " ".join(results)
print(combined_results)
