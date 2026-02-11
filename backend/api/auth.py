from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from core.security import create_access_token, verify_password, get_password_hash

router = APIRouter(prefix="/auth", tags=["auth"])

# Mock CEO user for now as per requirements
CEO_EMAIL = "ceo@hugamara.com"
CEO_PASSWORD_HASH = get_password_hash("CEO@2026!")

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login", response_model=Token)
async def login(request: LoginRequest):
    if request.email != CEO_EMAIL or not verify_password(request.password, CEO_PASSWORD_HASH):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": request.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_me():
    # This will be implemented with dependency injection later
    return {"email": CEO_EMAIL, "role": "CEO"}
