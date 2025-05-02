from flask import Flask
from flask_cors import CORS
from models import db
from routes import routes

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///cfa.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)  # ✅ Initialize db here

import os

with app.app_context():
    db.create_all()

# Register routes
app.register_blueprint(routes, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
