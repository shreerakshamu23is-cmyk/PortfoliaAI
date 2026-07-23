"""
Portfolio Router Module
Manages database operations for storing, fetching, updating, and exporting portfolios.
"""
import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.portfolio import Portfolio
from app.models.user import User
from app.schemas.portfolio import (
    PortfolioCreate, PortfolioUpdate, PortfolioResponse, PortfolioData
)
from app.routers.auth import get_current_user_optional
from app.services.theme_generator import ThemeGeneratorService
from app.services.portfolio_generator import PortfolioGeneratorService

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

@router.get("/themes")
def get_themes():
    """Return all available portfolio themes."""
    return ThemeGeneratorService.get_all_themes()

@router.post("", response_model=PortfolioResponse)
@router.post("/", response_model=PortfolioResponse)
def create_portfolio(
    payload: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Save generated portfolio object to database."""
    portfolio_id = str(uuid.uuid4())[:8]
    
    db_portfolio = Portfolio(
        id=portfolio_id,
        user_id=current_user.id if current_user else None,
        title=payload.title or f"{payload.data.name}'s Portfolio",
        theme=payload.theme or "modern-glass",
        data=payload.data.model_dump(),
        customizations=payload.customizations.model_dump() if payload.customizations else {}
    )
    
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

@router.get("/{portfolio_id}", response_model=PortfolioResponse)
def get_portfolio(portfolio_id: str, db: Session = Depends(get_db)):
    """Fetch portfolio by ID."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@router.put("/{portfolio_id}", response_model=PortfolioResponse)
def update_portfolio(
    portfolio_id: str,
    payload: PortfolioUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Update existing portfolio by ID."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    if payload.title:
        portfolio.title = payload.title
    if payload.theme:
        portfolio.theme = payload.theme
    if payload.data:
        portfolio.data = payload.data.model_dump()
    if payload.customizations:
        portfolio.customizations = payload.customizations.model_dump()

    db.commit()
    db.refresh(portfolio)
    return portfolio

@router.post("/{portfolio_id}/export")
def export_portfolio_html(
    portfolio_id: str,
    db: Session = Depends(get_db)
):
    """Generate standalone downloadable single-file HTML portfolio."""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    portfolio_data = PortfolioData.model_validate(portfolio.data)
    html_content = PortfolioGeneratorService.generate_html_export(portfolio_data, portfolio.theme)

    return HTMLResponse(
        content=html_content,
        headers={"Content-Disposition": f"attachment; filename=portfolio_{portfolio_id}.html"}
    )
