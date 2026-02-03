def generate_cold_email(resume_data, job_data):
    fin_mail_template = f"""
    ### RESUME DATA:
    {resume_data}
    
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
    
    # Here you would typically call your LLM or email generation logic
    # For demonstration, we will return a placeholder response
    return {
        "subject": "Experienced Applicant for Job Title at Company Name",
        "body": fin_mail_template
    }