from pydantic import BaseModel


class CareLinkCreate(BaseModel):
    patient_id: str
    send_invitation: bool = False


class CareLinkResponse(BaseModel):
    id: int
    nutritionist_id: str
    patient_id: str
    status: str
    start_date: str | None = None
    end_date: str | None = None
    notes: str | None = None
    created_at: str
    updated_at: str
    patient_username: str | None = None
    nutritionist_username: str | None = None


class PatientListItem(BaseModel):
    id: str
    username: str | None = None
    created_at: str | None = None
