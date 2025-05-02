import json
import time
import requests
from retry import retry
from datetime import datetime

# File name containing the locations
FILE_NAME = "locations.json"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
MAX_RETRIES = 3
RATE_LIMIT_DELAY = 1.5  # Increased delay to be more conservative

def log_error(message):
    """Log error messages with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] ERROR: {message}")

@retry(tries=MAX_RETRIES, delay=RATE_LIMIT_DELAY, backoff=2)
def get_coordinates(area, city, country):
    """Fetch latitude and longitude from OpenStreetMap API with retry logic"""
    query = f"{area}, {city}, {country}"
    params = {
        "format": "json",
        "q": query,
        "addressdetails": 1,
        "limit": 1
    }
    
    headers = {
        "User-Agent": "hamzahmedsiddiqui@outlook.com"
    }
    
    try:
        response = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
        else:
            log_error(f"No data found for: {query}")
            return None, None
            
    except requests.exceptions.RequestException as e:
        log_error(f"API Request failed for {query}: {str(e)}")
        raise  # This will trigger the retry

def update_json():
    """Update the JSON file with new latitude and longitude"""
    try:
        # Read the current file
        with open(FILE_NAME, "r", encoding="utf-8") as file:
            locations = json.load(file)

        # Create a backup
        backup_file = f"{FILE_NAME}.{datetime.now().strftime('%Y%m%d_%H%M%S')}.backup"
        with open(backup_file, "w", encoding="utf-8") as file:
            json.dump(locations, file, indent=4)

        # Track progress
        total = len(locations)
        updated = 0
        failed = 0

        for location in locations:
            print(f"Updating {location['name']}... ({updated + 1}/{total})")
            
            # Skip if coordinates already exist and are valid
            if "latitude" in location and "longitude" in location:
                if isinstance(location["latitude"], (int, float)) and isinstance(location["longitude"], (int, float)):
                    print(f"Skipping {location['name']} - coordinates already exist")
                    updated += 1
                    continue

            lat, lon = get_coordinates(location["area"], location["city"], location["country"])
            
            if lat and lon:
                location["latitude"] = lat
                location["longitude"] = lon
                updated += 1
            else:
                failed += 1
            
            time.sleep(RATE_LIMIT_DELAY)  # Rate limiting delay

        # Save the updated data
        with open(FILE_NAME, "w", encoding="utf-8") as file:
            json.dump(locations, file, indent=4)

        print(f"\nUpdate complete!")
        print(f"Total locations: {total}")
        print(f"Successfully updated: {updated}")
        print(f"Failed updates: {failed}")

    except Exception as e:
        log_error(f"Critical error in update_json: {str(e)}")
        raise

if __name__ == "__main__":
    update_json()