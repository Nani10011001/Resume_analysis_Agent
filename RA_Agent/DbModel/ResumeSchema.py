from pydantic import BaseModel,Field,ConfigDict
from typing import List,Optional
from datetime import datetime,timezone
from bson import ObjectId
#from ..Db.pyDb import resume_collection
class Resume(BaseModel):
    user_id:ObjectId
    filename:str
   
    update_at:datetime = Field(default=lambda: datetime(timezone.utc))
    
    model_config=ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders= {ObjectId:str})

""" resume= Resume(user_id=ObjectId("697f49dd9703fef7e998f642"),
               skills=["python","MongDb"])

result=resume_collection.insert_one(resume.model_dump())
print("Inserted Id: ",result.inserted_id)
 """