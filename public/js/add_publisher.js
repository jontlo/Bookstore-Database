// add_publisher.js

// Get the objects we need to modify
let addPublisherForm = document.getElementById('add-publisher-form');


// Modify the objects we need
addPublisherForm.addEventListener("submit", function(e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPublisherName = document.getElementById("input-pname");

    // Get the values from the form fields
    let publisherNameValue = inputPublisherName.value;

    // Put our data we want to send in a js object
    let data = {
        publisherName: publisherNameValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-publisher", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPublisherName.value = '';
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

// Creates a single row from an object representing a single record from Publishers
addRowToTable = (data) => {
    
    // Get a reference to the current table on the page and clear it out
    let currentTable = document.getElementById("publisher-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and two cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let pNameCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.publisherId;
    pNameCell.innerText = newRow.publisherName;

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(pNameCell);

    // Add the row to the table
    currentTable.appendChild(row);
}