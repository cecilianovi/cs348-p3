from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.sqlite" #use a test database.
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(255))

with app.app_context():
    db.create_all()

@app.route("/test", methods=["POST"])
def test_route():
    data = request.json
    print("Received data:", data)
    return jsonify({"message": "Data received!"}), 200

@app.route("/update_message", methods=["POST"])
def update_message():
    data = request.json
    message_text = data.get("message")
    if message_text:
        with app.app_context():
            message = Message.query.first()
            if message:
                message.text = message_text
            else:
                message = Message(text=message_text)
            db.session.add(message)
            db.session.commit()
        return jsonify({"message": "Message updated!"}), 200
    else:
        return jsonify({"error": "Message text is required"}), 400

if __name__ == "__main__":
    app.run(debug=True)