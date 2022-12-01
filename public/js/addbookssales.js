// Get the objects we need to modify
let addBooksSalesForm = document.getElementById('add-line-item-form');

// Modify the objects we need
addBooksSalesForm.addEventListener("submit", function(e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIsbn13 = document.getElementById("input-isbn13");
    let inputSaleId = document.getElementById("input-sale-id");
    let inputLineQuantity = document.getElementById("input-line-quantity");

    // Get the values from the form fields
    let isbn13Value = inputIsbn13.value;
    let saleIdValue = inputSaleId.value;
    let lineQuantityValue = inputLineQuantity.value;

    // Put our data we want to send in a js object
    let data = {
        isbn13: isbn13Value,
        saleId: saleIdValue,
        lineQuantity: lineQuantityValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-books-sales", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputIsbn13.value = '';
            inputSaleId.value = '';
            inputLineQuantity.value = '';

            console.log("addRowToTable() fired, input fields cleared");
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200)
        {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from an object representing a single record from Sales
addRowToTable = (data) => {
    
    // Get a reference to the current table on the page and clear it out
    let currentTable = document.getElementById("books-sales-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);

    let newRow = parsedData[parsedData.length - 1];

    // Create a row and two cells
    let row = document.createElement("TR");
    let isbn13SaleIdCell = document.createElement("TD");
    let isbn13Cell = document.createElement("TD");
    let saleIdCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");
    let lineTotalCell = document.createElement("TD");

    // Fill the cells with correct data
    isbn13SaleIdCell.innerText = newRow.isbn13SaleId;
    isbn13Cell.innerText = newRow.isbn13;
    saleIdCell.innerText = newRow.saleId;
    quantityCell.innerText = newRow.quantity;
    lineTotalCell.innerText = newRow.lineTotal;
    
    // Add the cells to the row
    row.appendChild(isbn13SaleIdCell);
    row.appendChild(isbn13Cell);
    row.appendChild(saleIdCell);
    row.appendChild(quantityCell);
    row.appendChild(lineTotalCell);

    row.setAttribute('data-value', newRow.saleId);

    // Add the row to the table
    currentTable.appendChild(row);
}
