function deleteBooksSales(isbn13SaleID, isbn13, quantity, lineTotal, saleId) {
    // Put our data we want to send in a javascript object
    let data = {
      id: isbn13SaleID,
      isbn13: isbn13,
      quantity: quantity,
      lineTotal: lineTotal,
      saleId: saleId
    };
  
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-books-sales", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(isbn13SaleID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}
  
function deleteRow(isbn13SaleID){
    
    let table = document.getElementById("books-sales-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == isbn13SaleID) {
            table.deleteRow(i);
            break;
         }
      }
  }
