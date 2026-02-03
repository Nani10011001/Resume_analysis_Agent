
def build_experience_blocks(text: str,entities: dict)->list:
    years=entities.get("years",[])
    companies=entities.get("companies",[])
    blocks=[]
    if companies:
        for company in companies:
            block={
                "companies":company,
                "years":years[:2] if len(years)>= 2 else years,
                "raw_text":text
            }
            blocks.append(block)
    return blocks