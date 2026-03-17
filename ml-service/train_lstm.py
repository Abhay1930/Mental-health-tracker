import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import joblib
import os

# Random seeds for consistency
np.random.seed(42)
tf.random.set_seed(42)

def build_sequences(data, seq_len):
    """
    Prepare 3D sequences for LSTM training.
    Targets are next day, 3-day shift, and 7-day shift.
    """
    X, y_1, y_3, y_7 = [], [], [], []
    
    # Iterate through data, leaving room for 7-day forecast
    for i in range(len(data) - seq_len - 7):
        X.append(data[i:(i + seq_len)])
        
        # Mood score is the last feature
        current_mood = data[i + seq_len, -1]
        
        y_1.append(current_mood)
        # Smoothing future targets to prevent model collapse
        y_3.append(data[i + seq_len + 2, -1] * 0.9 + current_mood * 0.1) 
        y_7.append(data[i + seq_len + 6, -1] * 0.8 + current_mood * 0.2)
        
    return np.array(X), np.column_stack((y_1, y_3, y_7))

def run_training(seq_len=7):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(base_dir, 'data', 'synthetic_mood_data.csv')
    
    if not os.path.exists(input_file):
        print("Data source missing.")
        return

    df = pd.read_csv(input_file)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)
    
    cols = [
        'sleep_hours', 'stress_level', 'exercise_minutes', 
        'social_interaction_level', 'screen_time_hours', 
        'journal_sentiment_score', 'mood_score'
    ]
    raw_data = df[cols].values
    
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(raw_data)
    
    X, y = build_sequences(scaled, seq_len)
    
    # Train/Test split
    idx = int(0.8 * len(X))
    X_train, X_test = X[:idx], X[idx:]
    y_train, y_test = y[:idx], y[idx:]
    
    print(f"Dataset active. Train: {len(X_train)} samples, Test: {len(X_test)} samples.")
    
    model = Sequential([
        LSTM(64, activation='relu', input_shape=(seq_len, len(cols)), return_sequences=True),
        Dropout(0.2),
        LSTM(32, activation='relu'),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(3) # [1d, 3d, 7d]
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    
    print("\nStarting training...")
    model.fit(X_train, y_train, epochs=30, batch_size=32, validation_split=0.1, verbose=1)
    
    # Export artifacts
    out_dir = os.path.join(base_dir, 'models')
    os.makedirs(out_dir, exist_ok=True)
    
    m_file = os.path.join(out_dir, 'lstm_mood_model.h5')
    s_file = os.path.join(out_dir, 'lstm_scaler.joblib')
    
    model.save(m_file)
    joblib.dump({
        'scaler': scaler,
        'features': cols,
        'seq_length': seq_len
    }, s_file)
    
    print(f"Exported model to {m_file}")
    print(f"Exported scaler to {s_file}")

if __name__ == "__main__":
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
    run_training()
