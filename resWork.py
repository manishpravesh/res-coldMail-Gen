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

# print(extrac_res_data)

# coldMAIL
from WebDataScrape import job_data

fin_mail_template = PromptTemplate.from_template(
    """
    ### RESUME DATA:
    {extrac_res_data}
    
    ### JOB DATA:
    {job_data}

    ### INSTRUCTIONS:
    You are a highly skilled cold email writer specializing in professional job applications. Given the candidate’s resume data and the job role description, your task is to craft an impactful and personalized cold email that highlights the candidate’s relevant skills, qualifications, and experience, aligning them with the job requirements.

    Key instructions:
    1. Focus on the candidate's qualifications that directly match the job's required skills, technologies, and experience.
    2. Emphasize any relevant projects or work experience where the candidate utilized the same tech stacks or skills mentioned in the job data.
    3. Demonstrate how the candidate's expertise and achievements can contribute to the company's needs and goals.
    4. Maintain a professional, concise, and persuasive tone throughout the email.
    5. Personalize the email by mentioning specifics about the company or job role that would appeal to the candidate.
    
    ### EMAIL FORMAT:
    Subject: [Write a compelling subject line that grabs the recipient's attention, highlighting the candidate's fit for the role]

    Dear [Recipient's Name],

    I hope this email finds you well. My name is [Candidate's Name], and I am writing to express my strong interest in the [Job Title] position at [Company Name]. With my extensive experience in [Relevant Field/Industry] and proficiency in [Key Skills/Technologies], I believe I can make a meaningful contribution to your team.

    As a [Current Role] at [Current Company Name] (or [Most Recent Role]), I have successfully [briefly mention a key achievement that is relevant to the job]. I specialize in [Key Skills] and have developed strong expertise in [Technologies/Tools], which aligns perfectly with the requirements for this role.

    I am particularly excited about [Company Name] because of [Company’s Values, Innovations, or Projects]. I greatly admire [Specific Achievement or Company Vision], and I am confident that my expertise in [Key Skills/Technologies] will add significant value to your team and help achieve [Company's Objective or Project].

    In my previous role, I had the opportunity to work on [Project Name or Key Responsibility] where I utilized [Technologies/Skills] that directly align with your current job opening. [Briefly describe the project or work experience, emphasizing the tech stack and how it matches the job role requirements.]

    I would love the opportunity to further discuss how my skills and experiences align with the needs of your team at [Company Name]. I’ve attached my resume for your review and would be delighted to connect at your convenience for an interview.

    Thank you for your time and consideration. I look forward to hearing from you soon.

    Best regards,
    [Candidate's Name]
    [Candidate's Contact Information]

    ### OUTPUT FORMAT:
    {{
        "subject": "A compelling subject line that highlights the candidate's expertise and fit for the role",
        "body": "The complete body of the email as described above, following the personalized approach"
    }}
    """
)
fin_mail_template2 = PromptTemplate.from_template(
    """
    ### RESUME DATA:
    {extrac_res_data}
    
    ### JOB DATA:
    {job_data}

    ### INSTRUCTIONS:
    You are a cold email expert crafting a professional and concise message. Given the candidate's resume and the job description, write an effective cold email that aligns the candidate's qualifications, skills, and experience with the job requirements. Focus on matching technologies and skills, highlighting relevant achievements, and keeping the email to the point while remaining persuasive.

    ### EMAIL FORMAT:
    Subject: [Express the candidate's interest in the job role and their fit for the position, e.g., "Experienced [Job Title] Applicant for [Company Name] Role"]

    Dear [Recipient's Name],

    My name is [Candidate's Name], and I am very interested in the [Job Title] position at [Company Name]. With experience in [Relevant Field/Industry] and expertise in [Key Skills/Technologies], I believe I can contribute effectively to your team.

    In my recent role as [Current Role] at [Current Company Name], I [mention a brief key achievement or responsibility]. My skills in [Key Skills] and experience with [Tech Stack] are a strong match for the position you are looking to fill.

    I am particularly excited about the opportunity to work with [Company Name] because [Reason for Interest in the Company]. I have experience with [mention any matching technologies or relevant projects] that directly align with the requirements of this role.

    I’ve attached my resume and would love the chance to discuss how my background can contribute to your team. Thank you for your time, and I look forward to hearing from you.

    Best regards,
    [Candidate's Name]
    [Candidate's Contact Information]

    ### OUTPUT FORMAT:
    {{
        "subject": "A clear and concise subject line that specifies the purpose of the email, such as 'Experienced [Job Title] Applicant for [Company Name] Role'",
        "body": "The body of the email as described above, concise and to the point"
    }}
    """
)

mail = llm.invoke(fin_mail_template.format(extrac_res_data=extrac_res_data, job_data=job_data))
mail2 = llm.invoke(fin_mail_template2.format(extrac_res_data=extrac_res_data, job_data=job_data))

print(mail.content)

print("-----------------------------------------------------------------------------------------------------")
print(mail2.content)