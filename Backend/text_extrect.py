import PyPDF2
from typing import List
from fastapi import UploadFile


def Extrect_all_Pdfs(files:List[UploadFile]):
    all_text ={}
    for file in files:
        reader = PyPDF2.PdfReader(file.file)
        text =""
        
        for page in reader.pages:
            text += page.extract_text() or ""
        all_text[file.filename] =text
    return all_text
    