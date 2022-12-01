// add_book.js

let addBookForm = document.getElementById('add-book-form');

addBookForm.addEventListener("submit", function(e)
{
    e.preventDefault();

    // Get form fields
    let inputIsbn = document.getElementById("input-bookIsbn");
    let inputTitle = document.getElementById("input-bookTitle");
    let inputPub = document.getElementById("input-bookPub");
    let inputPrice = document.getElementById("input-bookPrice");
    let inputQuantity = document.getElementById("input-bookQuantity")

    // Get values from fields
    let isbnVal = inputIsbn.value;
    let titleVal = inputTitle.value;
    let pubVal = inputPub.value;
    let priceVal = inputPrice.value;
    let quantVal = inputQuantity.value;


    // Data Sanitization
    
    // ISBN13: check for '-' and remove if present
    if (isbnVal.includes("-"))
    {
        while(isbnVal.includes("-"))
        {
            isbnVal = isbnVal.replace('-', '');
        }
    }

    // Put our data in a js object
    let data =
    {
        isbn13: isbnVal,
        title: titleVal,
        publisherId: pubVal,
        price: priceVal, 
        quantity: quantVal
    }

    console.log(data.price);
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () =>
    {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            //console.log(data.isbn13);
            addBookRowToTable(xhttp.response, data.isbn13);

            inputIsbn.value = '';
            inputTitle.value = '';
            inputPub.value = '';
            inputPrice.value = '';
            inputQuantity.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200)
        {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for response
    xhttp.send(JSON.stringify(data));
});

addBookRowToTable = (data, isbn13) =>
{
    //console.log(data);
    let currentTable = document.getElementById("books-table");
    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);

    let newRow;

    // Because our ISBNs are not consecutive, we need to find the proper row in
    // the request response to add to our table dynamically
    for (let i = 0; i < parsedData.length; i++)
    {
        if (parsedData[i].isbn13 == isbn13)
        {
            newRow = parsedData[i];
            newRowIndex = i + 1;
            break;
        }
    }

    // Create a new row and insert it to the proper place in the table
    let row = currentTable.insertRow(newRowIndex);

    // Create new cells for the row
    let isbnCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let pubCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let quantCell = document.createElement("TD");
    
    // Fill cells
    isbnCell.innerText = newRow.isbn13;
    titleCell.innerText = newRow.title;
    pubCell.innerText = newRow.publisherId;
    priceCell.innerText = newRow.price;
    quantCell.innerText = newRow.quantity;

    if (pubCell.innerText == 'undefined')
    {
        pubCell.innerText = '';
    }
    
    // Add cells to row
    row.appendChild(isbnCell);
    row.appendChild(titleCell);
    row.appendChild(pubCell);
    row.appendChild(priceCell);
    row.appendChild(quantCell);
}