let addBookGenreForm = document.getElementById('add-bookgenre-form');

addBookGenreForm.addEventListener("submit", function(e)
{
    e.preventDefault();

    let inputBookID = document.getElementById('input-gBookID');
    let inputGenreID = document.getElementById('input-genreID');

    let bookIdValue = inputBookID.value;
    let genreIdValue = inputGenreID.value;

    let data = {
        isbn13: bookIdValue, 
        genreId: genreIdValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-bookgenre", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () =>
    {
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            addBookGenreRowToTable(xhttp.response);

            inputBookID.value = '';
            inputGenreID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200)
        {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));
});

addBookGenreRowToTable = (data) =>
{
    let currentTable = document.getElementById("booksgenres-table");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let genreCell = document.createElement("TD");
    let bookCell = document.createElement("TD");

    idCell.innerText = newRow.isbn13GenreId;
    genreCell.innerText = newRow.genreId;
    bookCell.innerText = newRow.isbn13;

    row.appendChild(idCell);
    row.appendChild(bookCell);
    row.appendChild(genreCell);

    row.setAttribute("data-value", newRow.isbn13GenreId);

    console.log(row.getAttribute("data-value"));

    currentTable.appendChild(row);

    //Dynamically update dropdown for update functionality
    let selectMenu = document.getElementById("input-updateBookGenreID");
    let option = document.createElement("option");
    option.text = newRow.isbn13GenreId;
    option.value = newRow.isbn13GenreId;
    selectMenu.add(option);
}