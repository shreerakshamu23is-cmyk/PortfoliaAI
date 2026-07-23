from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(String, primary_key=True, index=True) # UUID or slug string
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Nullable for guest portfolios
    title = Column(String, nullable=False, default="My Portfolio")
    theme = Column(String, default="modern-glass")
    
    # Store the complete parsed and enhanced portfolio data as JSON
    data = Column(JSON, nullable=False)
    
    # Custom styling parameters (color, font, layout preferences)
    customizations = Column(JSON, nullable=True)
    
    raw_resume_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="portfolios")
