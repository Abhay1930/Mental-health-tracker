from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
# No global tensorflow import to speed up health checks
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_path(folder, filename):
    return os.path.join(BASE_DIR, folder, filename)

app = Flask(__name__)
CORS(app)

# Model Cache
MODELS = {
    'base': None,
    'lstm': None,
    'lstm_scaler': None,
    'lstm_features': None,
    'lstm_seq_length': None
}

def load_base_model():
    if MODELS['base'] is None:
        model_path = get_path('models', 'mood_model.joblib')
        if os.path.exists(model_path):
            print("Loading Base model...")
            m_data = joblib.load(model_path)
            MODELS['base'] = m_data['model']
            print("Base model loaded.")
    return MODELS['base']

def load_lstm_model():
    if MODELS['lstm'] is None:
        l_model_path = get_path('models', 'lstm_mood_model.h5')
        l_scaler_path = get_path('models', 'lstm_scaler.joblib')
        
        if os.path.exists(l_model_path) and os.path.exists(l_scaler_path):
            print("Loading LSTM model (this may take a moment)...")
            from tensorflow.keras.models import load_model as tf_load_model
            MODELS['lstm'] = tf_load_model(l_model_path, compile=False)
            l_data = joblib.load(l_scaler_path)
            MODELS['lstm_scaler'] = l_data['scaler']
            MODELS['lstm_features'] = l_data['features']
            MODELS['lstm_seq_length'] = l_data['seq_length']
            print("LSTM model loaded.")
    return MODELS['lstm']

@app.route('/predict-mood', methods=['POST'])
def predict():
    model = load_base_model()
    if not model:
        return jsonify({'error': 'Prediction engine starting up, please wait 15 seconds'}), 503
    
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
        print(f"Prediction error: {e}")
        return jsonify({'error': 'Analysis failed'}), 400

@app.route('/predict_future', methods=['POST'])
def predict_future():
    lstm_model = load_lstm_model()
    scaler = MODELS['lstm_scaler']
    seq_length = MODELS['lstm_seq_length']
    features = MODELS['lstm_features']

    if not lstm_model or scaler is None or seq_length is None or features is None:
        return jsonify({'error': 'Forecasting engine starting up, please wait 30 seconds'}), 503
    
    try:
        req = request.json
        history = req.get('history', [])
        
        if len(history) < seq_length:
            return jsonify({'error': 'Insufficient data history'}), 400
            
        # Extract features for LSTM
        inputs = []
        for h in history[-seq_length:]:
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
        X_scaled = scaler.transform(X).reshape(1, seq_length, len(features))
        
        # Raw tensor prediction
        y_scaled = lstm_model.predict(X_scaled, verbose=0)[0] 
        
        # Inverse transform logic
        def unscale(val):
            row = np.zeros(len(features))
            row[-1] = val
            return scaler.inverse_transform([row])[0][-1]

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
        print(f"Forecast error: {e}")
        return jsonify({'error': 'Forecasting failed'}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'online', 
        'models_ready': {
            'base': MODELS['base'] is not None, 
            'lstm': MODELS['lstm'] is not None
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006)
