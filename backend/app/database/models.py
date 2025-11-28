from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class RequestHistory(Base):
    __tablename__ = "request_history"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, nullable=True)
    question = Column(String, nullable=True)
    answer = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())