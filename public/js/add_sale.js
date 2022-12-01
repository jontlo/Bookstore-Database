// Get the objects we need to modify
let addSaleForm = document.getElementById('add-sale-form');

// Modify the objects we need
addSaleForm.addEventListener("submit", function(e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSaleDate = document.getElementById("input-sale-date");
    let inputEmployeeId = document.getElementById("employee-id-select");

    // Get the values from the form fields
    let saleDateValue = inputSaleDate.value;
    let employeeIdValue = inputEmployeeId.value;

    // Put our data we want to send in a js object
    let data = {
        saleDate: saleDateValue,
        employeeId: employeeIdValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sale", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputSaleDate.value = '';
            inputEmployeeId.value = '';

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
    let currentTable = document.getElementById("sales-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);

    // Format date to add to row
    let lastRow = currentTable.rows.length - 1;

    // console.log(lastRow);
    // let date = new Date(Date.parse(parsedData[lastRow]['saleDate']));
    // let options = {month: 'long', day: '2-digit', year: 'numeric'};
    // let formattedSaleDate = date.toLocaleString('en-US', options).replace(',','');
    // console.log(formattedSaleDate);

    // Format employee name to add to row
    let formattedEmployeeName = parsedData[lastRow]['employeeName']

    let newRow = parsedData[parsedData.length - 1];

    // Create a row and two cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let totalCell = document.createElement("TD");
    let employeeCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.saleId;
    dateCell.innerText = newRow.saleDay;
    totalCell.innerText = newRow.totalSaleAmount;
    employeeCell.innerText = formattedEmployeeName;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSale(newRow.saleId);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(dateCell);
    row.appendChild(totalCell);
    row.appendChild(employeeCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.saleId);

    // Add the row to the table
    currentTable.appendChild(row);
}
