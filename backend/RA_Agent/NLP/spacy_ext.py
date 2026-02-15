import spacy
import re
nlp =spacy.load("en_core_web_md")
Year_regex=re.compile(r"\b(19\d{2}|20\d{2})\b")
Skill_Blacklist={
   "Python", "JavaScript", "SQL", "MongoDB",
    "FastAPI", "spaCy", "Docker", "NLP"
}
# extraction information from the pdf resume content
def extract_resume_entities(text: str)->dict:
    doc= nlp(text)
    name=None
    companies=set()
    years= set()
    for ent in doc.ents:
        if ent.label_=="PERSON" and not name:
            name =ent.text.strip()
            #filter the company
        elif ent.label_=="ORG":
            org=ent.text.strip()
            if org not in Skill_Blacklist and len(org.split())>1:
                companies.add(org)

        elif ent.label_ =="DATE":
            matches= Year_regex.findall(ent.text)
            for y in matches:
                years.add(y)
        
    return {
        "name":name,
        "companies":list(companies),
        "years":sorted(years)
    }
