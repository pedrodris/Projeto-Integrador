"""Mock Supabase client for local development and testing."""
import uuid
import jwt
from datetime import datetime, timedelta
from typing import Any, Dict, Optional


class MockAuthUser:
    """Mock Supabase Auth user object."""
    
    def __init__(self, id: str, email: str, password: str):
        self.id = id
        self.email = email
        self.password = password
        self.phone = None
        self.user_metadata = {}
        self.app_metadata = {}


class MockSession:
    """Mock Supabase Auth session object."""
    
    def __init__(self, user_id: str, email: str):
        self.access_token = self._create_token(user_id, email)
        self.refresh_token = str(uuid.uuid4())
        self.token_type = "bearer"
        self.user_id = user_id
    
    def _create_token(self, user_id: str, email: str) -> str:
        """Create a mock JWT token."""
        payload = {
            "sub": user_id,
            "email": email,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=24),
        }
        # Sign with a mock secret key
        return jwt.encode(payload, "mock-secret-key", algorithm="HS256")


class MockAuthResponse:
    """Mock response from Supabase auth operations."""
    
    def __init__(self, user: Optional[MockAuthUser] = None, session: Optional[MockSession] = None):
        self.user = user
        self.session = session


class MockAuth:
    """Mock Supabase Auth service."""
    
    def __init__(self):
        # In-memory user storage for testing
        self.users: Dict[str, MockAuthUser] = {
            "test@example.com": MockAuthUser(str(uuid.uuid4()), "test@example.com", "password123"),
        }
    
    def sign_up(self, credentials: Dict[str, str]) -> MockAuthResponse:
        """Mock sign up."""
        email = credentials.get("email", "")
        password = credentials.get("password", "")
        
        if not email or not password:
            raise Exception("Email and password are required")
        
        if email in self.users:
            raise Exception(f"User with email {email} already exists")
        
        user = MockAuthUser(str(uuid.uuid4()), email, password)
        self.users[email] = user
        
        # Create session immediately
        session = MockSession(user.id, user.email)
        
        return MockAuthResponse(user=user, session=session)
    
    def sign_in_with_password(self, credentials: Dict[str, str]) -> MockAuthResponse:
        """Mock sign in with password."""
        email = credentials.get("email", "")
        password = credentials.get("password", "")
        
        if not email or not password:
            raise Exception("Email and password are required")
        
        user = self.users.get(email)
        
        if not user or user.password != password:
            raise Exception("Invalid email or password")
        
        session = MockSession(user.id, user.email)
        return MockAuthResponse(user=user, session=session)
    
    def get_user(self, token: str) -> MockAuthResponse:
        """Mock get user from token."""
        try:
            # Decode the mock JWT
            payload = jwt.decode(token, "mock-secret-key", algorithms=["HS256"])
            user_id = payload.get("sub")
            email = payload.get("email")
            
            # Find user by email
            for stored_user in self.users.values():
                if stored_user.email == email and stored_user.id == user_id:
                    return MockAuthResponse(user=stored_user)
            
            raise Exception("User not found")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")


class MockSupabaseClient:
    """Mock Supabase client for development."""
    
    def __init__(self):
        self.auth = MockAuth()


def get_mock_supabase_client() -> MockSupabaseClient:
    """Get a mock Supabase client."""
    return MockSupabaseClient()
