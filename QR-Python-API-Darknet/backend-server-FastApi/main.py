from fastapi import FastAPI
import json
app = FastAPI()
# instruction to deploy server --> uvicorn main:app --reload
@app.get("/data")
async def room():
    with open('../data.json') as json_file:
        data = json.load(json_file)
    return data

@app.get("/data/last")
async def room():
    with open('../data_last.json') as json_file2:
        data2 = json.load(json_file2)
    return data2