import os
import json
from langchain.document_loaders import PyPDFLoader
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq  # Assuming this is a valid LLM (or use any other LLM)

# Set environment variable (if needed)
os.environ['USER_AGENT'] = 'myagent'

# Load PDF file
file_path = r"C:\Users\INSP 15\Desktop\temp-pr\ml-Lang\resume-computer-engineering.pdf"
pdf_loader = PyPDFLoader(file_path)
pages = pdf_loader.load()  # Directly load all pages

# Concatenate all pages into a single string
pages_string = " ".join([page.page_content for page in pages])

# Initialize LLM (Groq or any LLM of choice)
llm = ChatGroq(
    model="llama3-8b-8192",
    groq_api_key='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'
    # other params...
)

# Define prompt template for JSON extraction
res_embed_tojson_template = PromptTemplate.from_template(
    """
    ### RESUME DATA:
    {resume_text}
    
    ### INSTRUCTIONS:
    Extract the following information from the resume data and provide it in JSON format:
    - name
    - email
    - projects
    - experiences
    - skills
    
    ### OUTPUT FORMAT:
    {{
        "name": "John Doe",
        "email": "john.doe@example.com",
        "projects": [
            {{
                "title": "Project 1",
                "description": "Description of Project 1"
            }},
            {{
                "title": "Project 2",
                "description": "Description of Project 2"
            }}
        ],
        "experiences": [
            {{
                "title": "Software Engineer",
                "company": "Company A",
                "duration": "Jan 2020 - Present"
            }}
        ],
        "skills": ["Python", "Machine Learning", "Data Analysis"]
    }}
    """
)

# Generate response from LLM (use it to extract details in JSON format)
response = llm.invoke(res_embed_tojson_template.format(resume_text=pages_string))

# Print the extracted response (JSON format)
print(response.content)
