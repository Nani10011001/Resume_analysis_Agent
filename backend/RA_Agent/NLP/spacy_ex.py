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
def extract_experience(text:str)->dict:
    upper_text= text.upper()
    start=None
    end=len(text)
    
    # Find the start of experience section
    for header in Experience_headers:
        if header in upper_text:
            start=upper_text.find(header)+len(header)
            break
    
    # If no experience header found, return empty dict
    if start is None:
        return {}
    
    # Find the end of experience section
    for stop in Stop_headers:
        idx= upper_text.find(stop,start)
        if idx !=-1:
            end=idx
            break
    
    # Extract and return the experience text
    extracted_exp_info=text[start:end].strip()
    return {
        "experience_text":extracted_exp_info
    }
