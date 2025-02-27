from flask import Flask, request, jsonify
from flask_cors import CORS
import chatbot  # Import the chatbot module with its functions

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests from the frontend

@app.route('/')
def home():
    return "Chatbot API is running. Use POST requests at /api/chatbot."

@app.route('/api/chatbot', methods=['POST'])
def chatbot_response():
    user_input = request.json.get('message')
    if user_input:
        # Call chatbot functions to get the response
        intents = chatbot.predict_class(user_input)  # Get intent prediction
        response = chatbot.get_response(intents, chatbot.intents)  # Generate response
        return jsonify({"response": response})
    return jsonify({"response": "I didn't understand that."})

if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=5000)
