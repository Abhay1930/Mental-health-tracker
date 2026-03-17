from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

# Load model configurations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_path(folder, filename):
    return os.path.join(BASE_DIR, folder, filename)

# Standard mood model
model_path = get_path('models', 'mood_model.joblib')
if os.path.exists(model_path):
    m_data = joblib.load(model_path)
    model = m_data['model']
    features = m_data['features']
    print("Main model loaded.")
else:
    model = None

# LSTM time-series model
l_model_path = get_path('models', 'lstm_mood_model.h5')
l_scaler_path = get_path('models', 'lstm_scaler.joblib')

if os.path.exists(l_model_path) and os.path.exists(l_scaler_path):
    lstm_model = load_model(l_model_path, compile=False)
    l_data = joblib.load(l_scaler_path)
    lstm_scaler = l_data['scaler']
    lstm_features = l_data['features']
    lstm_seq_length = l_data['seq_length']
    print("LSTM model loaded.")
else:
    lstm_model = None

@app.route('/predict-mood', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model unavailable'}), 500
    
    try:
        req = request.json
        # Feature mapping
        input_df = pd.DataFrame([{
            'sleep_hours':              req.get('sleep_hours', 7),
            'stress_level':             req.get('stress_level', 5),
            'exercise_minutes':         req.get('exercise_minutes', 30),
            'social_interaction_level': req.get('social_interaction_level', 5),
            'screen_time_hours':        req.get('screen_time_hours', 4),
            'journal_sentiment_score':  req.get('journal_sentiment_score', 0),
            'prev_mood':                req.get('prev_mood', 5),
        }])
        
        pred = model.predict(input_df)[0]
        conf = "high" if abs(pred - 5) > 2 else "moderate"
        
        return jsonify({
            'predicted_mood': round(float(pred), 1),
            'confidence': conf
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict_future', methods=['POST'])
def predict_future():
    if not lstm_model:
        return jsonify({'error': 'Prediction engine offline'}), 500
    
    try:
        req = request.json
        history = req.get('history', [])
        
        if len(history) < lstm_seq_length:
            return jsonify({'error': 'Insufficient data history'}), 400
            
        # Extract features for LSTM
        inputs = []
        for h in history[-lstm_seq_length:]:
            inputs.append([
                h.get('sleep_hours', 7),
                h.get('stress_level', 5),
                h.get('exercise_minutes', 30),
                h.get('social_interaction_level', 5),
                h.get('screen_time_hours', 4),
                h.get('journal_sentiment_score', 0),
                h.get('mood_score', 5)
            ])
            
        X = np.array(inputs)
        X_scaled = lstm_scaler.transform(X).reshape(1, lstm_seq_length, len(lstm_features))
        
        # Raw tensor prediction
        y_scaled = lstm_model.predict(X_scaled, verbose=0)[0] 
        
        # Inverse transform logic
        def unscale(val):
            row = np.zeros(len(lstm_features))
            row[-1] = val
            return lstm_scaler.inverse_transform([row])[0][-1]

        preds = [np.clip(unscale(v), 1, 10) for v in y_scaled]
        
        def label(v):
            if v >= 8: return "Excellent"
            if v >= 6.5: return "Good"
            if v >= 4.5: return "Neutral"
            if v >= 3: return "Poor"
            return "Terrible"
            
        return jsonify({
            'next_day': {'score': round(float(preds[0]), 1), 'label': label(preds[0])},
            '3_days':   {'score': round(float(preds[1]), 1), 'label': label(preds[1])},
            '7_days':   {'score': round(float(preds[2]), 1), 'label': label(preds[2])}
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'online', 'models': {'base': model is not None, 'lstm': lstm_model is not None}})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006)
