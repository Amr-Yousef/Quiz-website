import string
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
import uuid

class Question(declarative_base()):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    choices = Column(String)
    answer = Column(String)