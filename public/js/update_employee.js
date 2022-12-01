
// Get the objects we need to modify
let updateEmployeeForm = document.getElementById('update-employee');

// Modify the objects we need
updateEmployeeForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEmployeeId = document.getElementById("employee-id-select");
    let inputPhoneNumber = document.getElementById("input-phoneNumber");

    // Get the values from the form fields
    let employeeIDValue = inputEmployeeId.value;
    let phoneNumberValue = inputPhoneNumber.value;
    
    // currently the database table for Employees does not allow updating values to NULL
    // so we must abort if being bassed NULL for phoneNumber

    if (isNaN(phoneNumberValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        employeeId: employeeIDValue,
        employeePhone: phoneNumberValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-employee", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            // Add the new data to the table
            updateRow(xhttp.response, employeeIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});


function updateRow(data, employeeID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("employees-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == employeeID) {

            // Get the location of the row where we found the matching employee ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of phone number value
            let td3 = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign phone number to our value we updated to
            td3.innerHTML = parsedData[0].employeePhone; 

       }
    }
}

function deleteDropDownMenu(employeeID){
    let selectMenu = document.getElementById("employee-id-select");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(employeeID)){
        selectMenu[i].remove();
        break;
      } 
    }
  }
