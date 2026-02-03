"""
Database initialization script
Run this to create all tables in your database
"""
from database import engine, Base
from models import User, Resume, Job, GeneratedEmail, UsageTracking


def init_database():
    """Create all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")
    print("\nTables created:")
    print("  - users")
    print("  - resumes")
    print("  - jobs")
    print("  - generated_emails")
    print("  - usage_tracking")


if __name__ == "__main__":
    init_database()
