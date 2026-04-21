from Db.pyDb import nlp_db
from bson import ObjectId

def get_nlp_info(userId: ObjectId, resume_id: ObjectId) -> str:
    doc = nlp_db.find_one(
        {"userId": userId, "resume_id": resume_id},
        {"nlp_extraction_info": 1, "nlp_experience_info": 1, "raw_text": 1}
    )

    if not doc:
        return ""

    parts = []

    raw_text = doc.get("raw_text", "")
    if raw_text:
        parts.append(str(raw_text))

    nlp_extraction = doc.get("nlp_extraction_info", "")
    if nlp_extraction:
        parts.append(str(nlp_extraction))

    nlp_experience = doc.get("nlp_experience_info", "")
    if nlp_experience:
        parts.append(str(nlp_experience))

    return "\n".join(parts)