import streamlit as st
from utils.pdf_loader import load_pdf
from utils.email_generator import generate_email

def main():
    st.title("Cold Email Generator")
    
    st.header("Upload Your Resume")
    resume_file = st.file_uploader("Choose a PDF file", type="pdf")
    
    st.header("Job Posting Link")
    job_link = st.text_input("Enter the job posting link")
    
    if st.button("Generate Cold Email"):
        if resume_file and job_link:
            resume_text = load_pdf(resume_file)
            cold_email = generate_email(resume_text, job_link)
            st.subheader("Generated Cold Email")
            st.text_area("Your Cold Email", value=cold_email, height=300)
        else:
            st.error("Please upload a resume and enter a job posting link.")

if __name__ == "__main__":
    main()