def scoring_engine(spacy_entities, spacy_experience, signals, full_text):

    score = 0
    breakdown = {}

    # ─── 1. Achievement Impact (Max 25) ──────────────────────────
    quantified_keywords = ["%", "percent", "increase", "reduced", "improved", 
                           "growth", "$", "revenue", "decreased", "saved", "delivered"]
    impact_hits = sum(1 for word in quantified_keywords if word.lower() in full_text.lower())

    if impact_hits >= 4:   impact_score = 25
    elif impact_hits >= 2: impact_score = 18
    elif impact_hits >= 1: impact_score = 10
    else:                  impact_score = 5

    score += impact_score
    breakdown["achievement_impact"] = {"score": impact_score, "max": 25, "hits": impact_hits}

    # ─── 2. Skill Depth & Proof (Max 20) ─────────────────────────
    projects = spacy_experience or []
    proof_score = min(len(projects) * 4, 20)

    score += proof_score
    breakdown["skill_depth"] = {"score": proof_score, "max": 20, "projects_found": len(projects)}

    # ─── 3. Experience Progression (Max 15) ──────────────────────
    years = spacy_entities.get("year_experience", 0)

    if years >= 8:   exp_score = 15
    elif years >= 5: exp_score = 12
    elif years >= 3: exp_score = 8
    elif years >= 1: exp_score = 5
    else:            exp_score = 2

    score += exp_score
    breakdown["experience_progression"] = {"score": exp_score, "max": 15, "years": years}

    # ─── 4. Project Complexity (Max 15) ──────────────────────────
    skills = spacy_entities.get("skills", [])
    tech_stack_size = len(set(skills))

    if tech_stack_size >= 12:  project_score = 15
    elif tech_stack_size >= 8: project_score = 12
    elif tech_stack_size >= 5: project_score = 8
    else:                      project_score = 4

    score += project_score
    breakdown["project_complexity"] = {"score": project_score, "max": 15, "skills_found": tech_stack_size}

    # ─── 5. Clarity & Communication (Max 10) ─────────────────────
    vague_words = ["responsible for", "worked on", "involved in", "participated"]
    vagueness_hits = sum(1 for v in vague_words if v in full_text.lower())

    clarity_score = max(2, 10 - min(vagueness_hits * 2, 8))

    score += clarity_score
    breakdown["clarity"] = {"score": clarity_score, "max": 10, "vague_phrases": vagueness_hits}

    # ─── 6. Structure & ATS Safety (Max 10) ──────────────────────
    structure_score = 10
    structure_deductions = []

    if signals.get("parsing_risks", {}).get("tables", {}).get("value"):
        structure_score -= 3
        structure_deductions.append("tables detected")

    if signals.get("parsing_risks", {}).get("multi_column", {}).get("value"):
        structure_score -= 3
        structure_deductions.append("multi-column layout")

    if signals.get("readability", {}).get("mixed_date_formats", {}).get("value"):
        structure_score -= 2
        structure_deductions.append("mixed date formats")

    if not signals.get("sections", {}).get("education", {}).get("value"):
        structure_score -= 2
        structure_deductions.append("missing education section")

    structure_score = max(0, structure_score)
    score += structure_score
    breakdown["structure"] = {"score": structure_score, "max": 10, "deductions": structure_deductions}

    # ─── 7. Section Completeness (Max 5) ─────────────────────────
    # ✅ new — rewards having all key sections
    sections = signals.get("sections", {})
    required = ["summary", "skills", "experience", "education"]
    present = sum(1 for s in required if sections.get(s, {}).get("value"))
    section_score = round((present / len(required)) * 5)

    score += section_score
    breakdown["section_completeness"] = {"score": section_score, "max": 5, "sections_found": present}

    # ─── 8. Penalties ────────────────────────────────────────────
    penalty = 0
    penalty_reasons = []

    # ✅ fixed typo: keywords_stuffing → keyword_stuffing
    if signals.get("keywords", {}).get("keyword_stuffing", {}).get("value"):
        penalty += 8
        penalty_reasons.append("keyword stuffing")

    # ✅ fixed key: images → images_or_logos (matches your signal schema)
    if signals.get("parsing_risks", {}).get("images_or_logos", {}).get("value"):
        penalty += 5
        penalty_reasons.append("images or logos detected")

    if signals.get("readability", {}).get("emojis", {}).get("value"):
        penalty += 3
        penalty_reasons.append("emojis detected")

    score -= penalty
    breakdown["penalties"] = {"deducted": penalty, "reasons": penalty_reasons}

    # ─── Final Score ──────────────────────────────────────────────
    final_score = max(0, min(100, score))

    return {
        "total_score": round(final_score, 2),
        "breakdown":   breakdown
    }