import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_mood_data(num_rows=3000):
    np.random.seed(42)
    
    start_date = datetime.now() - timedelta(days=num_rows)
    dates = [start_date + timedelta(days=i) for i in range(num_rows)]
    
    # Base features
    sleep_hours = np.random.uniform(4, 10, num_rows)
    exercise_minutes = np.random.uniform(0, 90, num_rows)
    social_interaction = np.random.uniform(1, 10, num_rows)
    screen_time = np.random.uniform(2, 12, num_rows)
    journal_sentiment = np.random.uniform(-1, 1, num_rows)
    
    # Stress level (correrlated with sleep and screen time)
    # Less sleep and more screen time = higher stress
    stress_level = 10 - (sleep_hours * 0.8) + (screen_time * 0.3) + np.random.normal(0, 1, num_rows)
    stress_level = np.clip(stress_level, 1, 10)
    
    # Mood score calculation with correlations
    # Mood improves with: sleep, exercise, social, sentiment
    # Mood declines with: stress
    mood_score = (
        (sleep_hours * 0.15) + 
        (exercise_minutes * 0.02) + 
        (social_interaction * 0.2) + 
        (journal_sentiment * 1.5) - 
        (stress_level * 0.3) + 
        5 # base constant
    )
    
    # Add some randomness and clip to 1-10
    mood_score += np.random.normal(0, 0.5, num_rows)
    mood_score = np.clip(mood_score, 1, 10)
    
    df = pd.DataFrame({
        'date': dates,
        'sleep_hours': np.round(sleep_hours, 1),
        'stress_level': np.round(stress_level, 1),
        'exercise_minutes': np.round(exercise_minutes).astype(int),
        'social_interaction_level': np.round(social_interaction, 1),
        'screen_time_hours': np.round(screen_time, 1),
        'journal_sentiment_score': np.round(journal_sentiment, 2),
        'mood_score': np.round(mood_score, 1)
    })
    
    return df

if __name__ == "__main__":
    print("Generating synthetic mood data...")
    df = generate_mood_data(5000)
    df.to_csv('ml-service/data/synthetic_mood_data.csv', index=False)
    print(f"Dataset saved to ml-service/data/synthetic_mood_data.csv ({len(df)} rows)")
