from sqlalchemy import Column, Integer, String, JSON, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base

class Question(declarative_base()):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    choices = Column(String)
    answer = Column(String)
    explanation = Column(String)
    time = Column(TIMESTAMP, default=func.current_timestamp())

class Set(declarative_base()):
    __tablename__ = 'sets'
    code = Column(String, primary_key=True)
    name = Column(String)
    creator = Column(String)
    time = Column(TIMESTAMP)

class QuestionSet(declarative_base()):
    __tablename__ = 'questions_sets'
    set_code = Column(String, primary_key=True)
    question_id = Column(String)