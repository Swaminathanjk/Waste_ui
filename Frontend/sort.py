import json

# Load JSON data
with open("D:\Waste_ui\Frontend\waste.json", "r") as file:
    data = json.load(file)

# Sort by 'name' in ascending order
sorted_data = sorted(data, key=lambda x: x["name"])

# Save the sorted JSON back to a file
with open("D:\Waste_ui\Frontend\sorted_waste.json", "w") as file:
    json.dump(sorted_data, file, indent=4)

print("Sorted JSON saved to sorted_data.json")
