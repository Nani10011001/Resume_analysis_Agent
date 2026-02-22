from bson import ObjectId
from typing import List,Any,Dict
import json
from RA_Agent.DbModel.NLP_schema import NLP_schema_str
from RA_Agent.Db.pyDb import nlp_db
def Nlp_info_store(userId:ObjectId,resumeId:ObjectId,
                   raw_text:str,
                   nlp_extraction_info:Dict[str,Any],
                   nlp__experience_info:Dict[str,Any]):
     

     Nlp_info=NLP_schema_str(
          userId=userId,
          resume_id=resumeId,
          raw_text=raw_text,
          nlP_extraction_info=nlp_extraction_info,
          nlp_experience_info=nlp__experience_info
          

     )
     records=Nlp_info.model_dump()
     if records:
          nlp_db.insert_one(records)
          print("nlp info is stored into db successfully")
          