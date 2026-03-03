def scoring_engine(spacy_entities, spacy_experience, signals, full_text):

    score = 0
    breakdown = {}

    # -----------------------------------
    # 1️⃣ Achievement Impact (Max 25)
    # -----------------------------------
    quantified_keywords = ["%", "percent", "increase", "reduced", "improved", "growth", "$", "revenue"]
    impact_hits = sum(1 for word in quantified_keywords if word.lower() in full_text.lower())

    if impact_hits >= 4:
        impact_score = 25
    elif impact_hits >= 2:
        impact_score = 18
    elif impact_hits >= 1:
        impact_score = 10
    else:
        impact_score = 5

    score += impact_score
    breakdown["achievement_impact"] = impact_score


    # -----------------------------------
    # 2️⃣ Skill Depth & Proof (Max 20)
    # -----------------------------------
    skills = spacy_entities.get("skills", [])
    projects = spacy_experience or []

    proof_score = min(len(projects) * 4, 20)

    score += proof_score
    breakdown["skill_depth"] = proof_score


    # -----------------------------------
    # 3️⃣ Experience Progression (Max 15)
    # -----------------------------------
    years = spacy_entities.get("year_experience", 0)

    if years >= 8:
        exp_score = 15
    elif years >= 5:
        exp_score = 12
    elif years >= 3:
        exp_score = 8
    elif years >= 1:
        exp_score = 5
    else:
        exp_score = 2

    score += exp_score
    breakdown["experience_progression"] = exp_score


    # -----------------------------------
    # 4️⃣ Project Complexity (Max 15)
    # -----------------------------------
    tech_stack_size = len(set(skills))

    if tech_stack_size >= 12:
        project_score = 15
    elif tech_stack_size >= 8:
        project_score = 12
    elif tech_stack_size >= 5:
        project_score = 8
    else:
        project_score = 4

    score += project_score
    breakdown["project_complexity"] = project_score


    # -----------------------------------
    # 5️⃣ Clarity & Communication (Max 10)
    # -----------------------------------
    vague_words = ["responsible for", "worked on", "involved in", "participated"]
    vagueness_hits = sum(1 for v in vague_words if v in full_text.lower())

    clarity_score = 10 - min(vagueness_hits * 2, 8)
    clarity_score = max(2, clarity_score)

    score += clarity_score
    breakdown["clarity"] = clarity_score


    # -----------------------------------
    # 6️⃣ Structure & ATS Safety (Max 10)
    # -----------------------------------
    structure_score = 10

    if signals.get("parsing_risks", {}).get("tables", {}).get("value"):
        structure_score -= 4

    score += structure_score
    breakdown["structure"] = max(structure_score, 0)


    # -----------------------------------
    # 7️⃣ Penalties (Max -15)
    # -----------------------------------
    penalty = 0

    if signals.get("keywords", {}).get("keywords_stuffing", {}).get("value"):
        penalty += 8

    if signals.get("parsing_risks", {}).get("images", {}).get("value"):
        penalty += 5

    score -= penalty
    breakdown["penalties"] = penalty


    final_score = max(0, min(100, score))

    return {
        "total_score": round(final_score, 2),
        "breakdown": breakdown
    }