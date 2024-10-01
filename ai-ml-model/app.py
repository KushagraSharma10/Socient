
from flask import Flask, request, jsonify
from sentiment_model import analyze_sentiment, analyze_post_sentiment
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Specify allowed origin here

CORS(app, origins=['http://localhost:3000', 'http://localhost:5173'])  # Frontend and Backend
# Your existing routes go here


# Route to analyze a single comment
@app.route('/analyze-comment', methods=['POST'])
def analyze_comment():
    data = request.get_json()
    content = data['content']
    sentiment = analyze_sentiment(content)
    return jsonify({'sentiment': sentiment})

# Route to analyze the overall sentiment of a post based on its comments
@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiments():
    data = request.get_json()
    comments = data['comments']
    sentiment_result = analyze_post_sentiment(comments)
    return jsonify(sentiment_result)


if __name__ == '__main__':
    app.run(debug=True)
    