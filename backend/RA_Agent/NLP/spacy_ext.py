import spacy
import re
nlp =spacy.load("en_core_web_md")
Year_regex=re.compile(r"\b(19\d{2}|20\d{2})\b")
# extraction information from the pdf resume content
def extract_resume_entities(text: str)->dict:
    doc= nlp(text)
    name=None
    companies=set()
    years= []
    for ent in doc.ents:
        if ent.label_=="PERSON" and not name:
            name =ent.text.strip()
        elif ent.label_=="ORG":
            companies.add(ent.text.strip())
        elif ent.label_ =="DATE":
            matches= Year_regex.findall(ent.text)
            years.extend(matches)
        years=sorted(set(years))
    return {
        "name":name,
        "companies":list(companies),
        "years":years
    }