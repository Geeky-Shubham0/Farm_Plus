import os
from typing import Any

from dotenv import load_dotenv

try:
    import firebase_admin
    from firebase_admin import auth, credentials
except Exception:
    firebase_admin = None
    auth = None
    credentials = None


load_dotenv()


def _build_service_account_from_env() -> dict[str, str] | None:
    project_id = os.getenv("FIREBASE_PROJECT_ID")
    client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
    private_key = os.getenv("FIREBASE_PRIVATE_KEY")

    if not project_id or not client_email or not private_key:
        return None

    return {
        "type": "service_account",
        "project_id": project_id,
        "private_key": private_key.replace("\\n", "\n"),
        "client_email": client_email,
        "token_uri": "https://oauth2.googleapis.com/token",
    }


def is_firebase_configured() -> bool:
    if firebase_admin is None:
        return False

    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if service_account_path and os.path.exists(service_account_path):
        return True

    return _build_service_account_from_env() is not None


def _get_firebase_app() -> Any:
    if firebase_admin is None or credentials is None:
        return None

    try:
        return firebase_admin.get_app()
    except ValueError:
        pass

    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if service_account_path and os.path.exists(service_account_path):
        cred = credentials.Certificate(service_account_path)
        return firebase_admin.initialize_app(cred)

    service_account = _build_service_account_from_env()
    if service_account:
        cred = credentials.Certificate(service_account)
        return firebase_admin.initialize_app(cred)

    return None


def verify_firebase_id_token(id_token: str) -> dict[str, Any]:
    if auth is None:
        raise RuntimeError("firebase-admin is not installed.")

    app = _get_firebase_app()
    if app is None:
        raise RuntimeError("Firebase Admin is not configured.")

    return auth.verify_id_token(id_token, app=app)
