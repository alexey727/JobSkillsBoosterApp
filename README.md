```markdown
# 🚀 JobSkillsBoosterApp

An application to boost skills and competencies. It consists of **Frontend** (React/NextJs) and **Backend** (Python/Flask).

## 📂 Project Structure

```

JobSkillsBoosterApp/
frontend/   # Application user interface
backend/    # API and business logic

````

---

## 🖥️ Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
````

1. Rename the environment file:

   ```bash
   mv .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

By default, the app will be available at [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

1. Rename the environment file:

   ```bash
   mv .env.example .env
   ```

2. Fill in the required **API\_KEYS** inside `.env`:

   ```
   API_KEY1=your_api_key_here
   API_KEY2=your_second_api_key
   ```

3. (Optional but recommended) Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Start the backend server:

   ```bash
   python app.py
   ```

By default, the backend will run at [http://localhost:5000](http://localhost:5000).

---

## 📄 Additional Information

* Make sure you have installed:

  * Node.js >= 16
  * Python >= 3.8
* Adjust ports or environment variables in `.env` files if needed.
* For production deployment, consider using a process manager (e.g., PM2) or Docker.

---

## ✨ Contact

For questions or suggestions:

* Email: [your-email@example.com](mailto:your-email@example.com)
* GitHub Issues: [create an issue](https://github.com/your-repo/issues)

---

✅ Enjoy working with **JobSkillsBoosterApp**!

