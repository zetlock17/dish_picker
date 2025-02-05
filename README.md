# Dish Picker

## Описание
Данный проект будет помогать пользователю определиться, что он хочет приготовить на, например, на обед или ужин.

## Задачи в проекте
1. **Хранение фотографий** – разработка системы хранения и управления изображениями.
2. **Рекомендательная система** – создание механизма персонализированных рекомендаций.
3. **Карусель с рекомендациями** – реализация интерактивного компонента для отображения рекомендаций.
4. **Функционал редактирования и удаления**
5. **Дизайн проекта** – разработка и улучшение визуального оформления и пользовательского интерфейса.
6. **Файл с зависимостями для backend**

## Установка и запуск
1. Клонируйте репозиторий:
   ```sh
   git clone https://github.com/zetlock17/dish_picker
   cd dish_picker
   ```
2. Установка и запуск backend (файла с завиимостями еще нет, сорямба): 
   ```sh
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
3. Установка и запуск frontend (React):
   ```sh
   cd frontend
   npm install
   npm start
   ```

## Лицензия
Проект распространяется под лицензией MIT.
