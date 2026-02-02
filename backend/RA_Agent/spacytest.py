import spacy

spacymodel = spacy.load("en_core_web_md")

text = "jai suriya worked at infosys from 2021 to 2024"
doc = spacymodel(text)


for ent in doc.ents:
    print(ent.text, ent.label_)
