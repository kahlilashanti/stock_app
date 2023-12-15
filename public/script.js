console.log('working');

// Global variable to store the current stock price
let currentStockPrice = 0;

// Function to search for stocks
function searchStock() {
    let stockSymbol = document.getElementById('stock-search').value.trim();

    // Basic validation
    if (!stockSymbol) {
        console.error('Stock symbol is required');
        return;
    }

    fetch(`/search-stock?symbol=${stockSymbol}`)
        .then(response => response.json())
        .then(data => {
            // Format and display the data
            displayStockData(data);
            // Update the current stock price
            const price = data.price.results ? data.price.results[0] : null;
            currentStockPrice = price ? price.c : 0;
            updateTotalWorth(); // Update the total worth based on the new price
        })
        .catch(error => {
            console.error('Error:', error);
            // Optionally, update the UI to show the error
        });
}

// Function to format and display stock data
function displayStockData(data) {
    const company = data.company;

    let htmlContent = `
        <h2>${company.name} (${company.symbol})</h2>
        <img src="${company.logo}" alt="${company.name} logo" style="width:100px;"><br>
        <strong>Current Price:</strong> $${currentStockPrice}<br>
        
    `;
    document.getElementById('stock-data').innerHTML = htmlContent;
}

// Function to update total worth
function updateTotalWorth() {
    const quantity = document.getElementById('stock-quantity').value;
    const totalWorth = quantity * currentStockPrice;
    document.getElementById('total-worth').textContent = totalWorth.toFixed(2);
}

// Event listeners
document.getElementById('search-button').addEventListener('click', searchStock);
document.getElementById('stock-quantity').addEventListener('input', updateTotalWorth);
