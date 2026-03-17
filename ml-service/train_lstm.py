import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import joblib
import os

# Set random seed for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

def create_sequences(data, seq_length):
    """
    Convert a 2D array of features into 3D sequences of (samples, time_steps, features).
    The target y is the mood score of the next consecutive days.
    """
    X, y_1, y_3, y_7 = [], [], [], []
    # We need enough data to predict up to 7 days ahead
    for i in range(len(data) - seq_length - 7):
        X.append(data[i:(i + seq_length)])
        # Target for next day
        y_1.append(data[i + seq_length, -1])  # Assuming mood_score is the last column
        
        # Target for next 3 days. We'll introduce slight smoothing/lookahead variance 
        # so the model learns a distinct pattern for the future.
        y_3.append(data[i + seq_length + 2, -1] * 0.9 + data[i + seq_length, -1] * 0.1) 
        y_7.append(data[i + seq_length + 6, -1] * 0.8 + data[i + seq_length, -1] * 0.2)
        
    return np.array(X), np.array(y_1), np.array(y_3), np.array(y_7)

def train_lstm_model(seq_length=7):
    base = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base, 'data', 'synthetic_mood_data.csv')
    if not os.path.exists(data_path):
        print("Data file not found. Run data_gen.py first.")
        return

    df = pd.read_csv(data_path)
    
    # Sort by date just to be safe
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)
    
    # Select features
    features = [
        'sleep_hours', 'stress_level', 'exercise_minutes', 
        'social_interaction_level', 'screen_time_hours', 
        'journal_sentiment_score', 'mood_score'
    ]
    data = df[features].values
    
    # Scale the data
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)
    
    # Create sequences
    X, y_1, y_3, y_7 = create_sequences(scaled_data, seq_length)
    
    # Multi-output target: [day_1, day_3, day_7]
    y = np.column_stack((y_1, y_3, y_7))
    
    # Split into train/test
    split = int(0.8 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    
    print(f"Training on {len(X_train)} sequences, testing on {len(X_test)} sequences...")
    print(f"X shape: {X.shape}, y shape: {y.shape}")
    
    # Build LSTM Model
    model = Sequential([
        LSTM(64, activation='relu', input_shape=(seq_length, len(features)), return_sequences=True),
        Dropout(0.2),
        LSTM(32, activation='relu'),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(3) # 3 outputs: next_day, 3_days, 7_days
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    
    # Train the model
    print("\n--- Training LSTM Model ---")
    model.fit(X_train, y_train, epochs=30, batch_size=32, validation_split=0.1, verbose=1)
    
    # Evaluate
    print("\n--- Model Evaluation ---")
    loss, mae = model.evaluate(X_test, y_test, verbose=0)
    print(f"Test MAE: {mae:.4f}")
    
    # Save the model and scaler
    os.makedirs(os.path.join(base, 'models'), exist_ok=True)
    
    # Save keras model
    model_path = os.path.join(base, 'models', 'lstm_mood_model.h5')
    model.save(model_path)
    
    # Save the scaler and feature info
    scaler_path = os.path.join(base, 'models', 'lstm_scaler.joblib')
    model_data = {
        'scaler': scaler,
        'features': features,
        'seq_length': seq_length
    }
    joblib.dump(model_data, scaler_path)
    
    print(f"\nModel saved to {model_path}")
    print(f"Scaler saved to {scaler_path}")

if __name__ == "__main__":
    # Ensure TF doesn't complain about logs if not needed
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
    train_lstm_model(seq_length=7)
