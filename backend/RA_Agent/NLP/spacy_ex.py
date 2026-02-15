Experience_headers=[
    "WORK EXPERIENCE",
    "EXPERIENCE",
    "PROFESSIONAL EXPERIENCE",
    "EMPLOYMENT HISTORY",
    "CAREER HISTORY"]
Stop_headers=[
     "EDUCATION",
    "SKILLS",
    "PROJECTS",
    "CERTIFICATIONS",
    "ACHIEVEMENTS"
]
def extract_experience(text:str)->str:
    upper_text= text.upper()
    start=None
    end=len(text)
    for header in Experience_headers:
        if header in upper_text:
            start=upper_text.find(header)+len(header)
            break
        if start is None:
            return ""
        
        # eduction content slice
        for stop in Stop_headers:
            idx= upper_text.find(stop,start)
            if idx !=-1:
                end=idx
                break
    return text[start:end].strip()
