import requests
import random
from typing import List

dish_names: List[str] = [
    "Паста", "Борщ", "Пицца", "Салат", "Суп", "Жаркое", "Плов", "Котлеты",
    "Рагу", "Ризотто", "Лазанья", "Шашлык", "Гуляш", "Карри", "Рамен",
    "Пельмени", "Тефтели", "Запеканка", "Омлет", "Стейк"
]

dish_prefixes: List[str] = [
    "Домашний", "Классический", "Праздничный", "Традиционный", "Пряный",
    "Легкий", "Острый", "Сытный", "Ароматный", "Нежный"
]

ingredients: List[str] = [
    "картофель", "морковь", "лук", "чеснок", "помидоры", "огурцы", "капуста",
    "говядина", "свинина", "курица", "рис", "макароны", "сыр", "масло",
    "соль", "перец", "зелень", "грибы", "баклажаны", "кабачки", "тыква",
    "сметана", "майонез", "яйца", "молоко", "сливки", "горох", "фасоль",
    "кукуруза", "перец болгарский", "брокколи", "цветная капуста", "тесто",
    "ветчина", "колбаса", "бекон", "креветки", "рыба", "лосось", "специи"
]

def login() -> str:
    try:
        response = requests.post(
            'http://127.0.0.1:8000/login',
            json={
                "username": "zetlock17",
                "password": "zetlock17"
            }
        )
        data = response.json()
        
        if response.status_code != 200:
            print(f"Login failed: {data.get('detail', 'Unknown error')}")
            exit(1)
            
        # Проверяем статус авторизации
        if not data.get('isAuth'):
            print("Login failed: Authentication unsuccessful")
            exit(1)
            
        return data.get('id')
        
    except requests.exceptions.ConnectionError:
        print("Error: Server is not running. Start it with:")
        print("uvicorn main:app --reload")
        exit(1)
    except Exception as e:
        print(f"Unexpected error during login: {e}")
        print("Response content:", response.text)
        exit(1)

def create_dish(user_id: str, name: str, components: str) -> None:
    try:
        data = {
            'name': name,
            'components': components,
            'user_id': user_id
        }
        response = requests.post('http://127.0.0.1:8000/add_dish', data=data)
        if response.status_code == 200:
            print(f"Added dish: {name}")
        else:
            print(f"Failed to add dish {name}: {response.text}")
    except Exception as e:
        print(f"Error adding dish {name}: {e}")

def generate_unique_dish_name(used_names: set) -> str:
    while True:
        prefix = random.choice(dish_prefixes)
        base = random.choice(dish_names)
        name = f"{prefix} {base}"
        if name not in used_names:
            used_names.add(name)
            return name

def main():
    print("Attempting to login...")
    user_id = login()
    print(f"Login successful. User ID: {user_id}")
    
    used_names = set()
    
    for i in range(100):
        # Генерация уникального имени
        name = generate_unique_dish_name(used_names)
        
        # Генерация случайного набора ингредиентов (4-8 штук)
        selected_ingredients = random.sample(ingredients, random.randint(4, 8))
        components = ", ".join(selected_ingredients)
        
        create_dish(user_id, name, components)
        print(f"Progress: {i+1}/100")

if __name__ == "__main__":
    main()