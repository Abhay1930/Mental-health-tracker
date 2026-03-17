import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_data(n=2000):
    start = datetime.now() - timedelta(days=n)
    dates = [start + timedelta(days=i) for i in range(n)]
    
    # Feature generation
    sleep = np.random.uniform(4, 10, n)
    exercise = np.random.uniform(0, 90, n)
    social = np.random.uniform(1, 10, n)
    screen = np.random.uniform(2, 12, n)
    sentiment = np.random.uniform(-1, 1, n)
    
    # Logic for synthetic correlation
    stress = 10 - (sleep * 0.8) + (screen * 0.3) + np.random.normal(0, 1, n)
    stress = np.clip(stress, 1, 10)
    
    mood = (
        (sleep * 0.15) + (exercise * 0.02) + (social * 0.2) + 
        (sentiment * 1.5) - (stress * 0.3) + 5
    )
    mood = np.clip(mood + np.random.normal(0, 0.5, n), 1, 10)
    
    return pd.DataFrame({
        'date': dates,
        'sleep_hours': np.round(sleep, 1),
        'stress_level': np.round(stress, 1),
        'exercise_minutes': np.round(exercise).astype(int),
        'social_interaction_level': np.round(social, 1),
        'screen_time_hours': np.round(screen, 1),
        'journal_sentiment_score': np.round(sentiment, 2),
        'mood_score': np.round(mood, 1)
    })

if __name__ == "__main__":
    count = 4000
    df = generate_data(count)
    
    dir_path = os.path.join(os.path.dirname(__file__), 'data')
    os.makedirs(dir_path, exist_ok=True)
    
    file_path = os.path.join(dir_path, 'synthetic_mood_data.csv')
    df.to_csv(file_path, index=False)
    print(f"Generated {count} samples in {file_path}")
