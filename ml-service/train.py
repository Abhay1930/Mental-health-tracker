import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

def train_model():
    # Load data
    data_path = 'ml-service/data/synthetic_mood_data.csv'
    if not os.path.exists(data_path):
        print("Data file not found. Run data_gen.py first.")
        return

    df = pd.read_csv(data_path)
    
    # Feature Engineering: Create lag features (yesterday's mood)
    # In a real app, this would be the user's previous entry
    df['prev_mood'] = df['mood_score'].shift(1)
    df = df.dropna() # Remove the first row with NaN lag
    
    # Select features and target
    features = [
        'sleep_hours', 'stress_level', 'exercise_minutes', 
        'social_interaction_level', 'screen_time_hours', 
        'journal_sentiment_score', 'prev_mood'
    ]
    X = df[features]
    y = df['mood_score']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training on {len(X_train)} samples, testing on {len(X_test)} samples...")
    
    # Baseline: Linear Regression
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    lr_preds = lr.predict(X_test)
    
    # Main Model: Random Forest
    rf = RandomForestRegressor(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    rf_preds = rf.predict(X_test)
    
    # Evaluation
    print("\n--- Model Performance ---")
    print(f"Linear Regression MAE: {mean_absolute_error(y_test, lr_preds):.4f}")
    print(f"Random Forest MAE: {mean_absolute_error(y_test, rf_preds):.4f}")
    print(f"Random Forest RMSE: {np.sqrt(mean_squared_error(y_test, rf_preds)):.4f}")
    print(f"Random Forest R2 Score: {r2_score(y_test, rf_preds):.4f}")
    
    # Save the model and feature list
    model_data = {
        'model': rf,
        'features': features
    }
    joblib.dump(model_data, 'ml-service/models/mood_model.joblib')
    print("\nModel saved to ml-service/models/mood_model.joblib")

if __name__ == "__main__":
    train_model()
