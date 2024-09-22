document.getElementById('inputForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const jsonInput = document.getElementById('jsonInput').value.trim(); // Trim whitespace
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';

    try {
        // Validate JSON input
        const parsedInput = JSON.parse(jsonInput);

        // Call the API
        const response = await fetch('http://127.0.0.1:5000/bfhl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedInput),
        });

        // Check if response is OK (status 200)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.is_success) {
            document.getElementById('filterSection').classList.remove('hidden');
            document.getElementById('responseSection').classList.remove('hidden');

            // Store the full response for filtering
            window.apiResponse = result;
        } else {
            errorMessage.textContent = 'Error processing request.';
        }
    } catch (error) {
        // Handle JSON parsing error
        if (error instanceof SyntaxError) {
            errorMessage.textContent = 'Invalid JSON format. Please check your input.';
        } else {
            errorMessage.textContent = 'An error occurred: ' + error.message;
        }
    }
});

document.getElementById('filterButton').addEventListener('click', () => {
    const selectedOptions = Array.from(document.getElementById('filterSelect').selectedOptions).map(option => option.value);
    const filteredResponse = {};

    selectedOptions.forEach(option => {
        if (option === 'alphabets') {
            filteredResponse['Alphabets'] = window.apiResponse.alphabets.join(', ');
        } else if (option === 'numbers') {
            filteredResponse['Numbers'] = window.apiResponse.numbers.join(', ');
        } else if (option === 'highestLowercase') {
            filteredResponse['Highest Lowercase Alphabet'] = window.apiResponse.highest_lowercase_alphabet.join(', ');
        }
    });

    document.getElementById('responseOutput').textContent = JSON.stringify(filteredResponse, null, 2);
});
