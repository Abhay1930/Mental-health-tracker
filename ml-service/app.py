from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
from tensorflow.keras.models import load_model

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

# Load LSTM model on startup
lstm_model_path = os.path.join(BASE_DIR, 'models', 'lstm_mood_model.h5')
lstm_scaler_path = os.path.join(BASE_DIR, 'models', 'lstm_scaler.joblib')

if os.path.exists(lstm_model_path) and os.path.exists(lstm_scaler_path):
    lstm_model = load_model(lstm_model_path, compile=False)
    lstm_data = joblib.load(lstm_scaler_path)
    lstm_scaler = lstm_data['scaler']
    lstm_features = lstm_data['features']
    lstm_seq_length = lstm_data['seq_length']
    print("LSTM mood prediction model loaded successfully.")
else:
    lstm_model = None
    print("Warning: LSTM Model file not found. Please run train_lstm.py first.")

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

@app.route('/predict_future', methods=['POST'])
def predict_future():
    if not lstm_model:
        return jsonify({'error': 'LSTM Model not loaded'}), 500
    
    try:
        data = request.get_json()
        history = data.get('history', [])
        
        if len(history) < lstm_seq_length:
            return jsonify({'error': f'Not enough history. Needed {lstm_seq_length} days.'}), 400
            
        recent_history = history[-lstm_seq_length:]
        
        input_data = []
        for day in recent_history:
            day_features = [
                day.get('sleep_hours', 7),
                day.get('stress_level', 5),
                day.get('exercise_minutes', 30),
                day.get('social_interaction_level', 5),
                day.get('screen_time_hours', 4),
                day.get('journal_sentiment_score', 0),
                day.get('mood_score', 5)
            ]
            input_data.append(day_features)
            
        input_data = np.array(input_data)
        scaled_input = lstm_scaler.transform(input_data)
        X = scaled_input.reshape(1, lstm_seq_length, len(lstm_features))
        
        # Predict using the LSTM (outputs normalized values)
        prediction_scaled = lstm_model.predict(X, verbose=0)[0] 
        
        # We need to inverse transform the predicted mood scores
        # We'll create a dummy array with 7 columns (matching the feature dimension)
        # to correctly "inverse transform" just the mood score.
        dummy_row = np.zeros(len(lstm_features))
        
        unscaled_predictions = []
        for p_scaled in prediction_scaled:
            dummy_row[-1] = p_scaled # Put the scaled prediction into the mood_score column
            unscaled_val = lstm_scaler.inverse_transform([dummy_row])[0][-1]
            unscaled_predictions.append(unscaled_val)
            
        prediction = np.array(unscaled_predictions)
        prediction = np.clip(prediction, 1, 10)
        
        def mood_label(score):
            if score >= 8: return "Excellent"
            if score >= 6.5: return "Good"
            if score >= 4.5: return "Neutral"
            if score >= 3: return "Poor"
            return "Terrible"
            
        return jsonify({
            'next_day': {
                'score': round(float(prediction[0]), 1),
                'label': mood_label(prediction[0])
            },
            '3_days': {
                'score': round(float(prediction[1]), 1),
                'label': mood_label(prediction[1])
            },
            '7_days': {
                'score': round(float(prediction[2]), 1),
                'label': mood_label(prediction[2])
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    # Using port 5005 to avoid collisions
    app.run(host='0.0.0.0', port=5006, debug=False)
