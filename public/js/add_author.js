// add_author.js

let addAuthorForm = document.getElementById('add-author-form');

addAuthorForm.addEventListener("submit", function(e) 
{
    e.preventDefault();

    // Get form fields 
    let inputFirstName = document.getElementById("input-aFirstName");
    let inputLastName = document.getElementById("input-aLastName");

    // Get values from form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;

    // Put data to send in a javascript object
    let data = {
        authorFirstName: firstNameValue,
        authorLastName: lastNameValue
    }

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-author", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
            // add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields
            inputFirstName.value = '';
            inputLastName.value = '';
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
    let currentTable = document.getElementById("authors-table");
    
    //get the location where we should insert the new row
    let newRowIndex = currentTable.rows.length;

    //get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    //create a new row w/ appropriate cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");

    //Fill cells
    idCell.innerText = newRow.authorId;
    firstNameCell.innerText = newRow.authorFirstName;
    lastNameCell.innerText = newRow.authorLastName;

    //Add cells to row
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);

    //Add row to table
    currentTable.appendChild(row);

}