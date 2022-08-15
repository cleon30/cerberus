from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
#run with uvicorn main:app --reload
app = FastAPI()
origins = [
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"])

@app.get("/data/last")
async def room():
    with open('../QR-python-API-darknet/data_last.json') as json_file2:
        data2 = json.load(json_file2)
    return data2