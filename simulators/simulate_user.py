#!/usr/bin/env python3
"""
Simulate user actions based on profiles
Usage: python simulate_user.py --profile office_worker --start 2025-12-01
"""

import argparse
import requests
import time
from datetime import datetime, timedelta
import random

API_URL = "http://localhost:3000"
API_KEY = None  # Add if needed

PROFILES = {
    "office_worker": {
        "wake_up": "07:00",
        "leave_home": "08:00",
        "return_home": "18:00",
        "sleep": "23:00",
        "actions": [
            {"time": "07:00", "device": "d1", "command": {"on": True, "brightness": 100}},
            {"time": "08:00", "device": "d1", "command": {"on": False}},
            {"time": "18:00", "device": "d1", "command": {"on": True, "brightness": 80}},
            {"time": "22:00", "device": "d1", "command": {"on": False}},
        ]
    },
    "home_worker": {
        "wake_up": "08:00",
        "sleep": "23:00",
        "actions": [
            {"time": "08:00", "device": "d1", "command": {"on": True, "brightness": 90}},
            {"time": "12:00", "device": "d2", "command": {"temperature": 21}},
            {"time": "23:00", "device": "d1", "command": {"on": False}},
        ]
    }
}


def simulate_user_actions(profile_name: str, start_date: str):
    profile = PROFILES.get(profile_name)
    if not profile:
        print(f"Profile {profile_name} not found")
        return
    
    start = datetime.strptime(start_date, "%Y-%m-%d")
    current = start
    
    print(f"Simulating user profile: {profile_name}")
    print(f"Start date: {start_date}")
    
    # Simulate for 7 days
    for day in range(7):
        current_date = start + timedelta(days=day)
        print(f"\nDay {day + 1}: {current_date.strftime('%Y-%m-%d')}")
        
        for action_template in profile["actions"]:
            action_time = datetime.strptime(
                f"{current_date.strftime('%Y-%m-%d')} {action_template['time']}",
                "%Y-%m-%d %H:%M"
            )
            
            # Add some randomness
            action_time += timedelta(minutes=random.randint(-15, 15))
            
            if action_time > datetime.now():
                continue  # Skip future actions
            
            # Simulate the action
            try:
                response = requests.post(
                    f"{API_URL}/api/devices/{action_template['device']}/command",
                    json={
                        "command": "set",
                        "payload": action_template["command"]
                    },
                    headers={"Authorization": f"Bearer {API_KEY}"} if API_KEY else {}
                )
                print(f"  {action_time.strftime('%H:%M')}: {action_template['device']} -> {action_template['command']}")
            except Exception as e:
                print(f"  Error: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Simulate user actions")
    parser.add_argument("--profile", default="office_worker", help="User profile")
    parser.add_argument("--start", default=datetime.now().strftime("%Y-%m-%d"), help="Start date (YYYY-MM-DD)")
    parser.add_argument("--api-url", default=API_URL, help="API URL")
    
    args = parser.parse_args()
    API_URL = args.api_url
    
    simulate_user_actions(args.profile, args.start)

