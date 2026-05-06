"""In-memory database for development and testing."""
from datetime import datetime
from typing import Any, Dict, List, Optional
import uuid


class InMemoryDB:
    """Simple in-memory database for development."""
    
    def __init__(self):
        self.profiles: Dict[str, dict] = {}
        self.nutritionist_profiles: Dict[str, dict] = {}
        self.patient_profiles: Dict[str, dict] = {}
    
    def create_profile(
        self,
        user_id: str,
        role: str,
        username: str,
        phone: Optional[str] = None,
        avatar_url: Optional[str] = None,
    ) -> dict:
        """Create a base profile."""
        profile = {
            "id": user_id,
            "role": role,
            "username": username,
            "phone": phone,
            "avatar_url": avatar_url,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        self.profiles[user_id] = profile
        return profile
    
    def get_profile(self, user_id: str) -> Optional[dict]:
        """Get profile by user ID."""
        return self.profiles.get(user_id)
    
    def update_profile(self, user_id: str, **updates) -> Optional[dict]:
        """Update profile."""
        if user_id not in self.profiles:
            return None
        
        profile = self.profiles[user_id]
        profile.update(updates)
        profile["updated_at"] = datetime.utcnow().isoformat()
        return profile
    
    def create_nutritionist_profile(
        self,
        profile_id: str,
        crn: str,
        specialty: Optional[str] = None,
        bio: Optional[str] = None,
    ) -> dict:
        """Create nutritionist-specific profile."""
        prof = {
            "id": str(uuid.uuid4()),
            "profile_id": profile_id,
            "crn": crn,
            "specialty": specialty,
            "bio": bio,
            "created_at": datetime.utcnow().isoformat(),
        }
        self.nutritionist_profiles[profile_id] = prof
        return prof
    
    def get_nutritionist_profile(self, profile_id: str) -> Optional[dict]:
        """Get nutritionist profile."""
        return self.nutritionist_profiles.get(profile_id)
    
    def create_patient_profile(
        self,
        profile_id: str,
        **data,
    ) -> dict:
        """Create patient-specific profile."""
        prof = {
            "id": str(uuid.uuid4()),
            "profile_id": profile_id,
            **data,
            "created_at": datetime.utcnow().isoformat(),
        }
        self.patient_profiles[profile_id] = prof
        return prof
    
    def get_patient_profile(self, profile_id: str) -> Optional[dict]:
        """Get patient profile."""
        return self.patient_profiles.get(profile_id)


# Global in-memory database instance
_db = InMemoryDB()


def get_memory_db() -> InMemoryDB:
    """Get the global in-memory database."""
    return _db
