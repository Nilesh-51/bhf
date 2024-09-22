from flask import Flask, request, jsonify
import base64
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

USER_ID = "john_doe_17091999"  # Example User ID
EMAIL = "john@xyz.com"          # Example College Email
ROLL_NUMBER = "ABCD123"         # Example Roll Number

def validate_file(file_b64):
    if not file_b64:
        return False, None, 0
    
    try:
        file_data = base64.b64decode(file_b64)
        mime_type = 'application/octet-stream'  # Default MIME type

        # Size in KB
        file_size_kb = len(file_data) / 1024
        return True, mime_type, file_size_kb
    except Exception:
        return False, None, 0

@app.route('/bfhl', methods=['POST'])
def post_bfhl():
    data = request.json
    input_data = data.get("data", [])
    file_b64 = data.get("file_b64", None)

    # Separating numbers and alphabets
    numbers = [item for item in input_data if item.isdigit()]
    alphabets = [item for item in input_data if item.isalpha()]
    
    # Finding highest lowercase alphabet
    lowest_lowercase = [ch for ch in alphabets if ch.islower()]
    highest_lowercase = max(lowest_lowercase) if lowest_lowercase else None

    file_valid, file_mime_type, file_size_kb = validate_file(file_b64)

    response = {
        "is_success": True,
        "user_id": USER_ID,
        "email": EMAIL,
        "roll_number": ROLL_NUMBER,
        "numbers": numbers,
        "alphabets": alphabets,
        "highest_lowercase_alphabet": [highest_lowercase] if highest_lowercase else [],
        "file_valid": file_valid,
        "file_mime_type": file_mime_type,
        "file_size_kb": round(file_size_kb) if file_size_kb else 0,
    }
    
    return jsonify(response), 200

@app.route('/bfhl', methods=['GET'])
def get_bfhl():
    response = {
        "operation_code": 1
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)
