
# from textblob import TextBlob

# # Analyze sentiment of a single comment
# def analyze_sentiment(comment):
#     analysis = TextBlob(comment)
#     if analysis.sentiment.polarity > 0:
#         return 'positive'
#     elif analysis.sentiment.polarity == 0:
#         return 'neutral'
#     else:
#         return 'negative'

# # Analyze overall sentiment of a post based on all comments
# def analyze_post_sentiment(comments):
#     positive = 0
#     negative = 0
#     neutral = 0

#     for comment in comments:
#         sentiment = analyze_sentiment(comment)
#         if sentiment == 'positive':
#             positive += 1
#         elif sentiment == 'negative':
#             negative += 1
#         else:
#             neutral += 1

#     total = len(comments)
#     return {
#         'positive': positive / total,
#         'negative': negative / total,
#         'neutral': neutral / total,
#         'overall': max((positive / total, 'positive'), (negative / total, 'negative'), (neutral / total, 'neutral'))[1]
#     }
    

from textblob import TextBlob
from googletrans import Translator

# Initialize the translator
translator = Translator()

# Analyze sentiment of a single comment (now handling Hindi)
def analyze_sentiment(comment):
    try:
        # Detect the language of the comment
        lang = translator.detect(comment).lang
        # Translate to English if it's Hindi
        if lang == 'hi':  # 'hi' is the code for Hindi
            comment = translator.translate(comment, dest='en').text
    except Exception as e:
        print(f"Error in translation: {e}")
    
    # Perform sentiment analysis using TextBlob
    analysis = TextBlob(comment)
    if analysis.sentiment.polarity > 0:
        return 'positive'
    elif analysis.sentiment.polarity == 0:
        return 'neutral'
    else:
        return 'negative'

# Analyze overall sentiment of a post based on all comments
def analyze_post_sentiment(comments):
    positive = 0
    negative = 0
    neutral = 0

    for comment in comments:
        sentiment = analyze_sentiment(comment)
        if sentiment == 'positive':
            positive += 1
        elif sentiment == 'negative':
            negative += 1
        else:
            neutral += 1

    total = len(comments)
    return {
        'positive': positive / total,
        'negative': negative / total,
        'neutral': neutral / total,
        'overall': max((positive / total, 'positive'), (negative / total, 'negative'), (neutral / total, 'neutral'))[1]
    }
