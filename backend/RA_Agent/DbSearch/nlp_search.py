from RA_Agent.Db.pyDb import nlp_db
from bson import ObjectId
def get_nlp_info(userId:ObjectId,resume_id:ObjectId):
    return nlp_db.find_one({"userId":userId,
                            "resume_id":resume_id},
                           {"nlp_extraction_info":1,
                            "nlp_experience_info":1})