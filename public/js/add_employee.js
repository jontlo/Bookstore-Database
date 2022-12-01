// Get the objects we need to modify
let addEmployeeForm = document.getElementById('add-employee-form');

// Modify the objects we need
addEmployeeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-fname");
    let inputLastName = document.getElementById("input-lname");
    let inputPhoneNumber = document.getElementById("input-phonenumber");
    let inputHireDate = document.getElementById("input-hiredate");
    let inputIsActive = document.getElementById("input-isactive");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let phoneNumberValue = inputPhoneNumber.value;
    let hireDateValue = inputHireDate.value;
    let isActiveValue = inputIsActive.value;

    // Put our data we want to send in a javascript object
    let data = {
        fname: firstNameValue,
        lname: lastNameValue,
        phoneNumber: phoneNumberValue,
        hireDate: hireDateValue,
        isActive: isActiveValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employee", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputPhoneNumber.value = '';
            inputHireDate.value = '';
            inputIsActive.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    // console.log("json data:", JSON.stringify(data));
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Employees
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("employees-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    // console.log("parsed");
    // console.log(parsedData);

    // Format date to add to row
    // let lastRow = currentTable.rows.length - 1;
    // let date = new Date(Date.parse(parsedData[lastRow]['hireDate']));
    // let options = {month: 'long', day: '2-digit', year: 'numeric'};
    // let formattedHireDate = date.toLocaleString('en-US', options).replace(',','');

    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let phoneNumberCell = document.createElement("TD");
    let hireDateCell = document.createElement("TD");
    let isActiveCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.employeeId;
    firstNameCell.innerText = newRow.employeeFirstName;
    lastNameCell.innerText = newRow.employeeLastName;
    phoneNumberCell.innerText = newRow.employeePhone;
    hireDateCell.innerText = newRow.hireDay;
    // hireDateCell.innerText = formattedHireDate;
    isActiveCell.innerText = newRow.isActive;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteEmployee(newRow.employeeId);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(phoneNumberCell);
    row.appendChild(hireDateCell);
    row.appendChild(isActiveCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.employeeId);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("employee-id-select");
    let option = document.createElement("option");
    option.text = newRow.employeeFirstName + ' ' +  newRow.employeeLastName;
    option.value = newRow.employeeId;
    selectMenu.add(option);
}