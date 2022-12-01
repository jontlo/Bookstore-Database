// add_books_sales.js

let addLineItemForm = document.getElementById('add-line-item-form');

addLineItemForm.addEventListener("submit", function(e) 
{
    e.preventDefault();

    // Get form fields 
    let inputIsbn13 = document.getElementById("input-isbn13");
    let inputSaleId = document.getElementById("input-sale-id");
    let inputLineQuantity = document.getElementById("input-line-quantity");

    // Get values from form fields
    let isbn13Value = inputIsbn13.value;
    let saleIdValue = inputSaleId.value;
    let lineQuantityValue = inputLineQuantity.value;

    // Put data to send in a javascript object
    let data = {
        isbn13: isbn13Value,
        saleId: saleIdValue,
        lineQuantity: lineQuantityValue
    }

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-books-sales", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
            // add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields
            inputIsbn13.value = '';
            inputSaleId.value = '';
            inputLineQuantity.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200)
        {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

// Create a single row from an Object representing a single record from Authors
addRowToTable = (data) => 
{
    //get a reference to the current table on the page and clear it out
    let currentTable = document.getElementById("books-sales-table");
    
    //get the location where we should insert the new row
    let newRowIndex = currentTable.rows.length;

    //get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    //create a new row w/ appropriate cells
    let row = document.createElement("TR");
    let isbn13SaleIdCell = document.createElement("TD");
    let isbn13Cell = document.createElement("TD");
    let saleIdCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");
    let lineTotalCell = document.createElement("TD");

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteBooksSales(newRow.isbn13SaleId, newRow.isbn13, newRow.quantity, newRow.lineTotal, newRow.saleId);
    };

    //Fill cells
    isbn13SaleIdCell.innerText = newRow.isbn13SaleId;
    isbn13Cell.innerText = newRow.isbn13;
    saleIdCell.innerText = newRow.saleId;
    quantityCell.innerText = newRow.quantity;
    lineTotalCell.innerText = newRow.lineTotal;


    //Add cells to row
    row.appendChild(isbn13SaleIdCell);
    row.appendChild(isbn13Cell);
    row.appendChild(saleIdCell);
    row.appendChild(quantityCell);
    row.appendChild(lineTotalCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.isbn13SaleId);

    //Add row to table
    currentTable.appendChild(row);

}