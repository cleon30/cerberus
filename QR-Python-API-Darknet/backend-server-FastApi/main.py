from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
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

# instruction to deploy server --> uvicorn main:app --reload
# @app.get("/data")
# async def room():
#     with open('../data.json') as json_file:
#         data = json.load(json_file)
#     return data

@app.get("/data/last")
async def room():
    with open('../data_last.json') as json_file2:
        data2 = json.load(json_file2)
    return data2