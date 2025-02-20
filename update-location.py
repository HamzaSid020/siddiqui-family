import json
import time
import requests

# File name containing the locations
FILE_NAME = "locations.json"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

def get_coordinates(area, city, country):
    """Fetch latitude and longitude from OpenStreetMap API"""
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
    
    response = requests.get(NOMINATIM_URL, params=params, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
        else:
            print(f"No data found for: {query}")
            return None, None
    else:
        print(f"API Request failed for {query}. Status code: {response.status_code}")
        return None, None


def update_json():
    """Update the JSON file with new latitude and longitude"""
    try:
        with open(FILE_NAME, "r", encoding="utf-8") as file:
            locations = json.load(file)

        for location in locations:
            print(f"Updating {location['name']}...")
            lat, lon = get_coordinates(location["area"], location["city"], location["country"])
            
            if lat and lon:
                location["latitude"] = lat
                location["longitude"] = lon
            
            time.sleep(1)  # Delay to avoid being blocked by API

        with open(FILE_NAME, "w", encoding="utf-8") as file:
            json.dump(locations, file, indent=4)

        print("JSON file updated successfully!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_json()