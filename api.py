import json
import random
from unittest import result

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker

import uuid

from assets.python.quizwebsite import Question


app = FastAPI()

# Dialect+driver://username:password@host:port/database
# As a reminder, a URL that includes the password "kx@jj5/g", where the “at” sign and slash characters are represented as %40 and %2F
engine = create_engine('mysql+pymysql://root:@localhost/quiz')
Session = sessionmaker(engine)

@app.get("/")
def root():
    return {"message": "This is the root"}

@app.get("/api/question")
async def root():
    metadata = MetaData()
    questions = Table('questions', metadata, autoload=True, autoload_with=engine)
    session = Session()

    result = session.query(questions).all()
    return result


@app.get("/api/question/{id}")
async def root(id: str):
    metadata = MetaData()
    questions = Table('questions', metadata, autoload=True, autoload_with=engine)
    session = Session()

    result = session.query(questions).filter(questions.c.id == id).first()
    return result


@app.post("/api/question")
async def root(info: Request):
    req_info = await info.json()
    
    # Now we will add th question to the database
    session = Session()

    # In case you were wondering like me to how it knows what table to insert into, it's because we specified the table name in the Question class.
    new_question = Question(id=str(uuid.uuid4()), title=req_info['title'], choices=json.dumps(req_info['choices']), answer=json.dumps(req_info['answer']))
    session.add(new_question)
    session.commit()

    

    return {
        "status" : "Question Added",
        "data" : req_info
    }


@app.get("/api/quiz/random")
async def root():
    metadata = MetaData()
    questions = Table('questions', metadata, autoload=True, autoload_with=engine)
    session = Session()

    rand = random.randrange(0, session.query(questions).count())
    result = session.query(questions)[rand]
    return result


@app.get("/api/quiz/random/{amount}")
async def root(amount: int):
    metadata = MetaData()
    questions = Table('questions', metadata, autoload=True, autoload_with=engine)
    session = Session()

    # TODO: Add a check to make sure the amount is less than the number of questions in the database, if not return an error message.
    rand = random.sample(range(0, session.query(questions).count()), amount)

    result = []
    for num in rand:
        result.append(session.query(questions)[num])
        
    return result

@app.get("/api/quiz/set/{setCode}")
async def root(setCode: str):
    metadata = MetaData()
    questionsSet = Table('questions_sets', metadata, autoload=True, autoload_with=engine)
    session = Session()

    result = session.query(questionsSet).filter(questionsSet.c.set_code == setCode).first()

    return result

@app.get("/api/quiz/set/{setCode}/{numberOfQuestions}")
async def root(setCode: str, numberOfQuestions: int):
    metadata = MetaData()
    questionsSet = Table('questions_sets', metadata, autoload=True, autoload_with=engine)
    questions = Table('questions', metadata, autoload=True, autoload_with=engine)
    session = Session()

    setObj = session.query(questionsSet).filter(questionsSet.c.set_code == setCode).first()
    setQuestions = json.loads(setObj.questions_uuid)
    
    UUIDArray = random.sample(setQuestions, numberOfQuestions)

    result = []
    for questionUUID in UUIDArray:
        result.append(session.query(questions).filter(questions.c.id == questionUUID).first())

    return result