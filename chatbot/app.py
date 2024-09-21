from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_message

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"]) 
def get_index():
    return render_template("base.html")

@app.route("/predict", methods=["POST"]) 
def predict():
    text = request.get_json().get("message")
    response, probability = get_message(text)
    message = {"answer": response, "probability": probability}
    return jsonify(message)

if __name__ == "__main__":
    print(f"Server running on port: 8080")
    app.run(debug=True)
