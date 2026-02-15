from pydantic import BaseModel,Field,ConfigDict
from typing import List
from datetime import datetime
from bson import ObjectId

class ResumeEmbedding(BaseModel):
    user_id:ObjectId=Field()
    chunk_id:int =Field(ge=0)
    text:str =Field(min_length=1)
    embedding:List[float]=Field(min_length=384,max_length=384)
    source: str =Field(default="pdf")
    version:int =Field(default=1,ge=1)
    created_at:datetime
    model_config= ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId:str}
    )

