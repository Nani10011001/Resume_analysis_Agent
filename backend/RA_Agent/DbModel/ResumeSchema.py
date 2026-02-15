from pydantic import BaseModel,Field,ConfigDict
from typing import List,Optional
from datetime import datetime
from bson import ObjectId
#from ..Db.pyDb import resume_collection
class Resume(BaseModel):
    user_id:ObjectId
    raw_text:str
    skills: List[str]=Field(min_length=1)
    experience_years:Optional[float]= Field(default=None,ge=0)
    version:int = Field(ge=1,default=1)
    update_at:datetime = Field(default_factory=datetime)
    
    model_config=ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders= {ObjectId:str})

""" resume= Resume(user_id=ObjectId("697f49dd9703fef7e998f642"),
               skills=["python","MongDb"])

result=resume_collection.insert_one(resume.model_dump())
print("Inserted Id: ",result.inserted_id)
 """