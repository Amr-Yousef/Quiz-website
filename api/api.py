import json
import random
import os
from os.path import join, dirname
from dotenv import load_dotenv

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from sqlalchemy import inspect


import uuid

from classes.quizwebsite import Question, QuestionSet, Set


# In case you forgot where you were, your next step is to somehow host this api. Good luck, you'll need it.
dotenv_path = join(dirname(__file__), 'superdupersecret.env')
load_dotenv(dotenv_path)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    engine = create_engine(os.getenv("CONNECTION_STRING"))
    # Try to connect to the database
    Session = sessionmaker(engine)
    print("Database connection successful.")

except OperationalError:
    print("Failed to connect to the database.")
    exit()


@app.get("/")
def root():
    inspector = inspect(engine)

    # Get database name
    db_name = inspector.default_schema_name

    # Get table information
    tables = inspector.get_table_names()

    return {"message": "This is the rootttt", "database": db_name, "tables": tables}

# === Questions ===

@app.get("/api/question")
async def root():
    session = Session()
    result = session.query(Question).all()
    return result


@app.get("/api/question/{id}")
async def root(id: str):
    session = Session()
    result = session.query(Question).filter(Question.id == id).first()
    return result

# TODO: You were here, trying to fit the new post method with the new system
@app.post("/api/question")
async def root(info: Request):
    req_info = await info.json()
    
    # Now we will add th question to the database
    session = Session()

    id = str(uuid.uuid4())
    title = req_info['title']
    choices = json.dumps(req_info['choices'])
    answer = json.dumps(req_info['answer'])

    try:
        explanation = req_info['explanation']
    except KeyError:
        explanation = None
    
    new_question = Question(id=id, title=title, choices=choices, answer=answer, explanation=explanation)

    # In case you were wondering like me to how it knows what table to insert into, it's because we specified the table name in the Question class.
    session.add(new_question)
    session.commit()  # I am not sure whether I need to write this every time or I can just put it at the very end. The latter sounds to be correct.

    try:
        setCode = req_info['set']

        setRow = session.query(Set).filter(Set.code == setCode).first()

        if setRow is None:
            return {"message": "The set code does not exist."}
        
        questionSet = QuestionSet(set_code=setCode, question_id=id)
        session.add(questionSet)

        session.commit()

    except KeyError:
        # This means that the set code was not provided
        return {"message": "The set code was not provided."}

    
    return {
        "status" : "Question Added",
        "data" : req_info
    }


@app.get("/api/quiz/random")
async def root():
    session = Session()

    rand = random.randrange(0, session.query(Question).count())
    result = session.query(Question)[rand]
    return result


@app.get("/api/quiz/random/{amount}")
async def root(amount: int):
    session = Session()

    # TODO: Add a check to make sure the amount is less than the number of questions in the database, if not return an error message.
    rand = random.sample(range(0, session.query(Question).count()), amount)

    result = []
    for num in rand:
        result.append(session.query(Question)[num])
        
    return result


# === Sets ===

@app.get("/api/quiz/set/setinfo")
async def root():
    session = Session()

    result = session.query(Set).all()
    return result

@app.get("/api/quiz/set/setinfo/{setCode}")
async def root(setCode: str):
    session = Session()

    result = session.query(Set).filter(Set.code == setCode).first()

    return result

# Returns the questions in a set
@app.get("/api/quiz/set/questions/{setCode}")
async def root(setCode: str):
    session = Session()

    query = session.query(Question).join(QuestionSet, Question.id == QuestionSet.question_id).filter(QuestionSet.set_code == setCode).all()

    return query

@app.get("/api/quiz/set/questions/{setCode}/{numberOfQuestions}")
async def root(setCode: str, numberOfQuestions: int):
    session = Session()

    query = session.query(Question).join(QuestionSet, Question.id == QuestionSet.question_id).filter(QuestionSet.set_code == setCode).all()

    #samples random questions from the set
    rand = random.sample(query, numberOfQuestions)

    return rand