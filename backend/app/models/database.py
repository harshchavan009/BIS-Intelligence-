import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class QueryLog(Base):
    __tablename__ = "query_logs"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    capability = Column(String(50), default="general")
    grounded_overall = Column(Boolean, default=True)
    grounded_percentage = Column(Float, default=100.0)
    sources_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    rating = Column(Integer, nullable=False) # 1 or -1
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class DemoCache(Base):
    __tablename__ = "demo_cache"

    id = Column(Integer, primary_key=True, index=True)
    query = Column(Text, unique=True, nullable=False)
    query_hi = Column(Text, nullable=True)
    capability = Column(String(50), default="general")
    answer = Column(Text, nullable=False)
    answer_hi = Column(Text, nullable=True)
    sources_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    """
    Security and administrative audit trail.
    Data Minimization Compliance (India Digital Personal Data Protection Act, 2023):
    - Client IPs are anonymized/masked (e.g. SHA-256 hash or masked subnet).
    - No PII is logged in plain text.
    - Records security actions, rate anomalies, verification checks, and admin logins.
    """
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    action = Column(String(100), nullable=False)  # e.g., AUTH_LOGIN, VERIFY_CML, VERIFY_HUID, RATE_ANOMALY
    masked_ip = Column(String(64), nullable=False)
    status = Column(String(50), nullable=False)   # SUCCESS, FAILURE, FLAGGED
    details = Column(Text, nullable=True)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
