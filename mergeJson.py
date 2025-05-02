import os
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def validate_person_data(person):
    """Validate the structure of a person's data"""
    required_fields = ['id', 'data', 'rels']
    data_fields = ['gender', 'first name', 'last name']
    
    # Check required top-level fields
    if not all(field in person for field in required_fields):
        return False, f"Missing required fields in person data: {required_fields}"
    
    # Check required data fields
    if not all(field in person['data'] for field in data_fields):
        return False, f"Missing required data fields: {data_fields}"
    
    return True, "Valid"

def parse_location(location):
    """Parse location string into area, city, and country"""
    if not location:
        return '', '', ''
        
    parts = [part.strip() for part in location.split(',')]
    
    if len(parts) == 3:
        return parts[0], parts[1], parts[2]
    elif len(parts) == 2:
        return parts[0], parts[1], ''
    else:
        return location, '', ''

def merge_json_files(directory):
    """Merge JSON files from the specified directory"""
    merged_data = []
    locations_data = []
    errors = []
    
    # Create backup of existing files
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    for file in ['data-siddiqui-family.json', 'locations.json']:
        if os.path.exists(file):
            backup_file = f"{file}.{timestamp}.backup"
            try:
                with open(file, 'r') as src, open(backup_file, 'w') as dst:
                    dst.write(src.read())
                logger.info(f"Created backup: {backup_file}")
            except Exception as e:
                logger.error(f"Failed to create backup of {file}: {str(e)}")

    try:
        # Process all JSON files
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith('.json'):
                    file_path = os.path.join(root, file)
                    logger.info(f"Processing file: {file_path}")
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                            
                            # Validate each person's data
                            for person in data:
                                is_valid, message = validate_person_data(person)
                                if not is_valid:
                                    errors.append(f"Invalid data in {file_path}: {message}")
                                    continue
                                    
                                merged_data.append(person)
                                
                                # Extract location data
                                first_name = person['data'].get('first name', '').strip()
                                last_name = person['data'].get('last name', '').strip()
                                location = person['data'].get('location', '').strip()
                                
                                if first_name and last_name and location:
                                    full_name = f"{first_name} {last_name}"
                                    area, city, country = parse_location(location)
                                    
                                    locations_data.append({
                                        "name": full_name,
                                        "area": area,
                                        "city": city,
                                        "country": country
                                    })
                                    
                    except json.JSONDecodeError as e:
                        errors.append(f"Invalid JSON in {file_path}: {str(e)}")
                    except Exception as e:
                        errors.append(f"Error processing {file_path}: {str(e)}")

        # Write merged data
        with open('data-siddiqui-family.json', 'w', encoding='utf-8') as f:
            json.dump(merged_data, f, indent=2)
        logger.info("Successfully wrote merged family data")

        # Write locations data
        with open('locations.json', 'w', encoding='utf-8') as f:
            json.dump(locations_data, f, indent=2)
        logger.info("Successfully wrote locations data")

        # Report any errors
        if errors:
            logger.warning("Completed with errors:")
            for error in errors:
                logger.warning(f"- {error}")
        else:
            logger.info("Merge completed successfully with no errors")

    except Exception as e:
        logger.error(f"Critical error during merge: {str(e)}")
        raise

if __name__ == "__main__":
    family_jsons_dir = './family_jsons'
    merge_json_files(family_jsons_dir)
