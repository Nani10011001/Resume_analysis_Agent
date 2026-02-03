""" import spacy

spacymodel = spacy.load("en_core_web_md")

text = "jai suriya worked at infosys from 2021 to 2024"
doc = spacymodel(text)


for ent in doc.ents:
    print(ent.text, ent.label_)
 """
from NLP.spacy_ext import extract_resume_entities
from NLP.spacy_ex import build_experience_blocks
text="""Jai Suriya
Software Engineer

Email: jai.suriya@email.com
Phone: +91 9876543210
Location: Chennai, India

PROFESSIONAL SUMMARY
Software Engineer with 3 years of experience in backend development and NLP-based systems.

SKILLS
Python, JavaScript, SQL, MongoDB, FastAPI, spaCy, Docker

WORK EXPERIENCE
Software Engineer
ABC Technologies Pvt Ltd
January 2022 - Present
- Developed resume parsing services using Python and spaCy.
- Built REST APIs for document analysis.

Backend Developer
XYZ Solutions
June 2020 - December 2021
- Designed microservices for text extraction and analysis.

EDUCATION
Bachelor of Technology in Computer Science
Anna University
2016 - 2020
"""
entities=extract_resume_entities(text=text)
blocks=build_experience_blocks(text,entities)
print("info extraction: ",entities)
print("experience Block",blocks)