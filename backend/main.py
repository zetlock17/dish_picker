from fastapi import FastAPI, HTTPException, Header, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import sqlite3
import uuid
import base64
from datetime import datetime
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL_USERS = "./databases/users.db"
DATABASE_URL_DISHES = "./databases/dishes.db"

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
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dishes (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            components TEXT NOT NULL,
            description TEXT,
            methode TEXT,
            image BLOB,
            time INTEGER,
            dificulty INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    conn.commit()
    conn.close()

    conn = sqlite3.connect(DATABASE_URL_DISHES)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dish_visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            dish_id TEXT NOT NULL,
            visit_date TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (dish_id) REFERENCES dishes (id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ingredients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dish_ingredients (
            dish_id TEXT,
            ingredient_id TEXT,
            PRIMARY KEY (dish_id, ingredient_id),
            FOREIGN KEY (dish_id) REFERENCES dishes (id),
            FOREIGN KEY (ingredient_id) REFERENCES ingredients (id)
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

class IngredientAmount(BaseModel):
    name: str
    amount: float
    unit: str

class DishCreate(BaseModel):
    name: str
    components: str 
    description: Optional[str] = None
    time: Optional[int] = None
    difficulty: Optional[int] = None

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
    name: str = Form(...),
    components: str = Form(...),
    description: str = Form(None),
    time: int = Form(None),
    dificulty: int = Form(None),
    user_id: str = Form(...),
    image: UploadFile = File(None)
):
    conn = sqlite3.connect(DATABASE_URL_DISHES)
    cursor = conn.cursor()
    dish_id = str(uuid.uuid4())
  
    cursor.execute(
        'INSERT INTO dishes (id, user_id, name, components, description, time, dificulty) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (dish_id, user_id, name, components, description, time, dificulty)
    )
    
    ingredients = [ing.strip() for ing in components.split(', ') if ing.strip()]
    
    for ingredient_name in ingredients:
        cursor.execute('SELECT id FROM ingredients WHERE name = ?', (ingredient_name.lower(),))
        result = cursor.fetchone()
        
        if result:
            ingredient_id = result[0]
        else:
            ingredient_id = str(uuid.uuid4())
            cursor.execute('INSERT INTO ingredients (id, name) VALUES (?, ?)',
                         (ingredient_id, ingredient_name.lower()))
        
        cursor.execute(
            'INSERT INTO dish_ingredients (dish_id, ingredient_id) VALUES (?, ?)',
            (dish_id, ingredient_id)
        )
    
    if image:
        image_data = await image.read()
        cursor.execute('UPDATE dishes SET image = ? WHERE id = ?', (image_data, dish_id))
    
    conn.commit()
    conn.close()
    return {"id": dish_id}

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
            "image": True if dish[5] else None,
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

@app.post("/record_visit/{dish_id}")
async def record_visit(dish_id: str, username: str = Header(None)):
    if not username:
        raise HTTPException(status_code=400, detail="Username header missing")
    
    user = get_current_user(username)
    user_id = user[0]
    
    conn = sqlite3.connect(DATABASE_URL_DISHES)
    cursor = conn.cursor()
    visit_date = datetime.now().isoformat()
    
    cursor.execute(
        'INSERT INTO dish_visits (user_id, dish_id, visit_date) VALUES (?, ?, ?)',
        (user_id, dish_id, visit_date)
    )
    
    conn.commit()
    conn.close()
    return {"message": "Visit recorded successfully"}