from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base

class Question(declarative_base()):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    choices = Column(String)
    answer = Column(String)
    explanation = Column(String)

class Set(declarative_base()):
    __tablename__ = 'questions_sets'
    set_code = Column(Integer, primary_key=True)
    questions_uuid = Column(JSON)