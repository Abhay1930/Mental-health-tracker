from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load model on startup
model_path = 'ml-service/models/mood_model.joblib'
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
        
        # Prepare input features in correct order
        # Note: In production, 'prev_mood' would be fetched from DB 
        # For simplicity in this API, we expect it in the request or use a default
        input_data = [
            data.get('sleep_hours', 7),
            data.get('stress_level', 5),
            data.get('exercise_minutes', 30),
            data.get('social_interaction_level', 5),
            data.get('screen_time_hours', 4),
            data.get('journal_sentiment_score', 0),
            data.get('prev_mood', 5) # Default to 5 if not provided
        ]
        
        prediction = model.predict([input_data])[0]
        
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
    # Using port 5005 to avoid collisions (server is on 5001, client 5173)
    app.run(port=5005, debug=True)
