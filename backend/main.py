from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить все источники. В продакшене укажите конкретные домены.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    username: str
    password: str

@app.post("/register")
async def register(user: User):
    # Here you would normally add the user to your database
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(user: User):
    # Here you would normally check the user's credentials
    return {"message": "User logged in successfully", "isAuth": True, "username": user.username}