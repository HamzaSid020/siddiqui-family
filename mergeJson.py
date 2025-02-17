import os
import json
from jsonmerge import Merger

def merge_json_files(directory):
    merged_data = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    merged_data.extend(data)
    
    return merged_data

# Usage
family_jsons_dir = './family_jsons'
merged_result = merge_json_files(family_jsons_dir)

# Write the merged result to a new JSON file
with open('data-siddiqui-family1.json', 'w') as f:
    json.dump(merged_result, f, indent=2)
