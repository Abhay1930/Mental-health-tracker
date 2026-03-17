from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load model on startup — use absolute path so this works from any CWD
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'models', 'mood_model.joblib')
if os.path.exists(model_path):
    model_data = joblib.load(model_path)
    model = model_data['model']
    features = model_data['features']
    print("Mood prediction model loaded successfully.")
else:
    model = None
    print("Warning: Model file not found. Please run train.py first.")

@app.route('/predict-mood', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.get_json()
        
        # Build a named DataFrame so sklearn doesn't emit feature_names warnings
        input_df = pd.DataFrame([{
            'sleep_hours':              data.get('sleep_hours', 7),
            'stress_level':             data.get('stress_level', 5),
            'exercise_minutes':         data.get('exercise_minutes', 30),
            'social_interaction_level': data.get('social_interaction_level', 5),
            'screen_time_hours':        data.get('screen_time_hours', 4),
            'journal_sentiment_score':  data.get('journal_sentiment_score', 0),
            'prev_mood':                data.get('prev_mood', 5),
        }])
        
        prediction = model.predict(input_df)[0]
        
        # Determine confidence/insight
        confidence = "high" if abs(prediction - 5) > 2 else "moderate"
        
        return jsonify({
            'predicted_mood': round(float(prediction), 1),
            'confidence': confidence
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    # Using port 5005 to avoid collisions
    app.run(host='0.0.0.0', port=5006, debug=False)
