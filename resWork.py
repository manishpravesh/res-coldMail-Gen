import os
import json
from langchain_community.document_loaders import PyPDFLoader
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq  # Assuming this is a valid LLM (or use any other LLM of choice)

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
    model="deepseek-r1-distill-llama-70b",
    groq_api_key='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'
    # other params...
)


# Define the updated prompt template for extracting detailed work experience information
res_embed_tojson_template = PromptTemplate.from_template(
    """
    ### RESUME DATA:~
    {resume_text}
    
    ### INSTRUCTIONS:
    Extract the following information from the resume data and provide it in JSON format:
    - name
    - email
    - projects (Include all relevant details like project title, description, tech stack used, project type, etc.)
    - work experience (Include details such as job title, company, duration, description, tech stack, location, etc.)
    - skills
    
    ### OUTPUT FORMAT:
    {{
        "name": "John Doe",
        "email": "john.doe@example.com",
        "projects": [
            {{
                "title": "Project 1",
                "description": "Description of Project 1",
                "tech_stack": ["Python", "Django", "PostgreSQL"],
                "project_type": "Web App"
            }},
            {{
                "title": "Project 2",
                "description": "Description of Project 2",
                "tech_stack": ["React", "Node.js", "MongoDB"],
                "project_type": "Full-Stack Web Application"
            }}
        ],
        "work_experience": [
            {{
                "title": "Software Engineer",
                "company": "Company A",
                "duration": "Jan 2020 - Present",
                "description": "Worked on building scalable web applications and optimizing backend performance.",
                "tech_stack": ["Python", "Django", "AWS"],
                "location": "Remote"
            }},
            {{
                "title": "Junior Developer",
                "company": "Company B",
                "duration": "Jun 2018 - Dec 2019",
                "description": "Developed front-end applications using React and improved user interfaces.",
                "tech_stack": ["React", "JavaScript", "CSS"],
                "location": "New York, USA"
            }}
        ],
        "skills": ["Python", "Machine Learning", "Data Analysis"]
    }}
    """
)

# Generate response from LLM (use it to extract detailed work experience information)
response = llm.invoke(res_embed_tojson_template.format(resume_text=pages_string))

extrac_res_data = (response.content)


# Print the extracted response (JSON format with detailed work experience information)

print(extrac_res_data)

