# School Asset Management Backend

FastAPI backend for the school asset management system.

## Step 1

This first version only establishes:

- FastAPI application
- Supabase server-side connection
- `/api/health` connectivity check
- CORS for the Vite frontend

AI Agent, Skills, authentication/RBAC and business APIs will be added in later steps.

## Run on Windows PowerShell

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Fill `.env` with the Supabase URL and **service-role key**.

Then:

```powershell
uvicorn app.main:app --reload --port 8000
```

Open:

- http://127.0.0.1:8000/
- http://127.0.0.1:8000/docs
- http://127.0.0.1:8000/api/health

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to React/Vite or commit it to Git.
