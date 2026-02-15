from bson import ObjectId
from pydantic import ConfigDict,BaseModel,Field
from datetime import datetime
from typing import Dict,List,Any

class NLP_schema(BaseModel):
    userId:ObjectId
    resume_id:ObjectId
    raw_text:str =Field(min_length=1)
    nlP_extraction:Dict[str,Any]
    version:int=Field(default=1,ge=1)
    created_at:datetime=Field(default=datetime.)
    model_config=ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId:str}
    )
    
