import os
import json

def merge_json_files(directory):
    merged_data = []
    locations_data = []  # To store extracted locations

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    merged_data.extend(data)

                    # Extract first name, last name, and location
                    for person in data:
                        first_name = person['data'].get('first name')
                        last_name = person['data'].get('last name')
                        location = person['data'].get('location')

                        if first_name and last_name and location:
                            # Combine first and last name into one field
                            full_name = f"{first_name} {last_name}"
                            
                            # Split the location into area, city, and country
                            location_parts = location.split(', ')
                            if len(location_parts) == 3:
                                area, city, country = location_parts
                            else:
                                area, city, country = location, '', ''  # Handle cases with incomplete location

                            locations_data.append({
                                "name": full_name,
                                "area": area,
                                "city": city,
                                "country": country
                            })

    # Write merged result to data-siddiqui-family.json
    with open('data-siddiqui-family.json', 'w') as f:
        json.dump(merged_data, f, indent=2)

    # Write locations data to locations.json (overwrite if exists)
    with open('locations.json', 'w') as f:
        json.dump(locations_data, f, indent=2)

    print("Merge complete! Merged family tree and locations data saved.")

# Usage
family_jsons_dir = './family_jsons'
merge_json_files(family_jsons_dir)
