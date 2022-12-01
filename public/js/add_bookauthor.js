let addBookAuthorForm = document.getElementById('add-bookauthor-form');

addBookAuthorForm.addEventListener("submit", function(e)
{
    e.preventDefault();

    let inputBookID = document.getElementById('input-bookID');
    let inputAuthorID = document.getElementById('input-authorID');

    let bookIdValue = inputBookID.value;
    let authorIdValue = inputAuthorID.value;

    let data = {
        isbn13: bookIdValue,
        authorId: authorIdValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-bookauthor", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () =>
    {
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            addBookAuthorRowToTable(xhttp.response);

            inputBookID.value = '';
            inputAuthorID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200)
        {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));
});

addBookAuthorRowToTable = (data) =>
{
    let currentTable = document.getElementById("booksauthors-table");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let authorCell = document.createElement("TD");
    let bookCell = document.createElement("TD");

    idCell.innerText = newRow.isbn13AuthorId;
    authorCell.innerText = newRow.authorId;
    bookCell.innerText = newRow.isbn13;

    row.appendChild(idCell);
    row.appendChild(authorCell);
    row.appendChild(bookCell);

    currentTable.appendChild(row);
}