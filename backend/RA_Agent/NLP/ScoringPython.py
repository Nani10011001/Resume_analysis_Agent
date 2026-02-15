def scoring_engine(spacy_entities, spacy_experience, signals, jd_requirements):

    score = 0
    breakdown = {}

    
    resume_skills = set(spacy_entities.get("skills", []))
    jd_skills = set(jd_requirements.get("skills", []))

    if jd_skills:
        matched_skills = resume_skills & jd_skills
        missing_skills = jd_skills - resume_skills

        skill_ratio = len(matched_skills) / len(jd_skills)
        skill_score = skill_ratio * 60
    else:
        matched_skills = set()
        missing_skills = set()
        skill_score = 0

    score += skill_score

    breakdown["skills"] = {
        "matched": list(matched_skills),
        "missing": list(missing_skills),
        "score": round(skill_score, 2)
    }


    resume_exp = spacy_entities.get("year_experience", 0)
    required_exp = jd_requirements.get("min_experience", 0)

    if required_exp > 0:
        if resume_exp >= required_exp:
            exp_score = 25
        else:
            exp_score = (resume_exp / required_exp) * 25
    else:
        exp_score = 0

    score += exp_score

    breakdown["experience"] = {
        "resume_experience": resume_exp,
        "required_experience": required_exp,
        "score": round(exp_score, 2)
    }



    penalty = 0

    if signals.get("parsing_risks", {}).get("tables", {}).get("value"):
        penalty += 7

    if signals.get("keywords", {}).get("keywords_stuffing", {}).get("value"):
        penalty += 8

    score -= penalty

    breakdown["ats_penalty"] = penalty



    final_score = max(0, min(100, score))

    return {
        "total_score": round(final_score, 2),
        "breakdown": breakdown
    }
