from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

class Question(declarative_base()):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    choices = Column(String)
    answer = Column(String)
    explanation = Column(String)