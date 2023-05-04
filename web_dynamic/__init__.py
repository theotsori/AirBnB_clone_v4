#!/usr/bin/python3
""" web_dynamic/__init__.py """

from flask import Flask

app = Flask(__name__)
app.url_map.strict_slashes = False
