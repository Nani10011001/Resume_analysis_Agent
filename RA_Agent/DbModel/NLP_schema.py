from bson import ObjectId
from pydantic import ConfigDict,BaseModel,Field
from datetime import datetime,timezone
from typing import Dict,List,Any

class NLP_schema_str(BaseModel):
    userId:ObjectId
    resume_id:ObjectId
    raw_text:str =Field(min_length=1)
    nlP_extraction_info:Dict[str,Any]
    nlp_experience_info:Dict[str,Any]
   
    created_at:datetime=Field(default_factory=lambda: datetime.now(timezone.utc))
    model_config=ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId:str}
    )
    
