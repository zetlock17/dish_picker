from fastapi import FastAPI, HTTPException, Header, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import sqlite3
import uuid
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL_USERS = "./databases/testUsers.db"
DATABASE_URL_DISHES = "./databases/testDishes.db"

def create_tables():
    conn = sqlite3.connect(DATABASE_URL_USERS)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

    conn = sqlite3.connect(DATABASE_URL_DISHES)
    cursor = conn.cursor()
    cursor.execute('DROP TABLE IF EXISTS dishes')
    cursor.execute('''
        CREATE TABLE dishes (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            components TEXT NOT NULL,
            description TEXT,
            image BLOB,
            time INTEGER,
            dificulty INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    conn.commit()
    conn.close()

create_tables()

class UserIn(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: str
    username: str
    password: str

class DishIn(BaseModel):
    user_id: str
    name: str
    components: str
    description: str = None
    time: int = None
    dificulty: int = None

class Dish(BaseModel):
    id: str
    user_id: str
    name: str
    components: str
    description: str = None
    image: str = None
    time: int = None
    dificulty: int = None

def get_current_user(username: str):
    conn = sqlite3.connect(DATABASE_URL_USERS)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    db_user = cursor.fetchone()
    conn.close()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username")
    return db_user

@app.post("/register")
async def register(user: UserIn):
    conn = sqlite3.connect(DATABASE_URL_USERS)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (user.username,))
    db_user = cursor.fetchone()
    if db_user:
        conn.close()
        raise HTTPException(status_code=400, detail="Username already registered")
    user_id = str(uuid.uuid4())
    cursor.execute('INSERT INTO users (id, username, password) VALUES (?, ?, ?)', (user_id, user.username, user.password))
    conn.commit()
    conn.close()
    return {"message": "User registered successfully", "id": user_id}

@app.post("/login")
async def login(user: UserIn):
    conn = sqlite3.connect(DATABASE_URL_USERS)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (user.username,))
    db_user = cursor.fetchone()
    conn.close()
    if not db_user or db_user[2] != user.password:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    return {"message": "User logged in successfully", "isAuth": True, "username": user.username, "id": db_user[0]}

@app.post("/add_dish")
async def add_dish(
    user_id: str = Form(...),
    name: str = Form(...),
    components: str = Form(...),
    description: str = Form(None),
    time: int = Form(None),
    dificulty: int = Form(None),
    image: UploadFile = File(None)
):
    try:
        conn = sqlite3.connect(DATABASE_URL_DISHES)
        cursor = conn.cursor()
        dish_id = str(uuid.uuid4())
        
        image_data = None
        if image:
            image_data = await image.read()

        cursor.execute(
            'INSERT INTO dishes (id, user_id, name, components, description, image, time, dificulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            (dish_id, user_id, name, components, description, image_data, time, dificulty)
        )
        conn.commit()
        conn.close()
        return {"message": "Dish added successfully", "id": dish_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/dishes")
async def get_dishes(username: str = Header(None)):
    try:
        if not username:
            raise HTTPException(status_code=400, detail="Username header missing")
        
        user = get_current_user(username)
        conn = sqlite3.connect(DATABASE_URL_DISHES)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM dishes WHERE user_id = ?', (user[0],))
        dishes = cursor.fetchall()
        conn.close()

        return [{
            "id": dish[0],
            "user_id": dish[1],
            "name": dish[2],
            "components": dish[3],
            "description": dish[4],
            "image": True if dish[5] else None,  # Just indicate if image exists
            "time": dish[6],
            "dificulty": dish[7]
        } for dish in dishes]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dish_image/{dish_id}")
async def get_dish_image(dish_id: str):
    conn = sqlite3.connect(DATABASE_URL_DISHES)
    cursor = conn.cursor()
    cursor.execute('SELECT image FROM dishes WHERE id = ?', (dish_id,))
    image_data = cursor.fetchone()
    conn.close()

    if not image_data or not image_data[0]:
        raise HTTPException(status_code=404, detail="Image not found")

    return Response(content=image_data[0], media_type="image/png")