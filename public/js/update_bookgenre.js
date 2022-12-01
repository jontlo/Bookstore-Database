let updateBookGenreForm = document.getElementById("update-bookgenre-form");

updateBookGenreForm.addEventListener("submit", function(e)
{
    //console.log("Submit button pressed, updating form");

    e.preventDefault();

    let inputRelationship = document.getElementById("input-updateBookGenreID");
    let inputGenre = document.getElementById("input-updateGenreID");

    let relationshipValue = inputRelationship.value;
    let genreValue = inputGenre.value;

    if (isNaN(relationshipValue))
    {
        console.log("Relationship cannot be null");
        return;
    }

    let data = {
        isbn13GenreId: relationshipValue,
        genreId: genreValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-bookgenre", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) 
        {
            //console.log("Input is valid");
            //console.log(xhttp.response);
            updateRow(xhttp.response, relationshipValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200)
        {
            console.log("There was an error with the input");
        }
    }

    xhttp.send(JSON.stringify(data));
});

function updateRow(data, isbn13GenreId)
{
    let parsedData = JSON.parse(data);
    console.log(parsedData);


    let table = document.getElementById("booksgenres-table");

    for (let i = 1, row; row = table.rows[i]; i++)
    {
        //console.log("in for loop");
        //console.log(table.rows[i].getElementsByTagName("td")[0].innerText);
        if (table.rows[i].getElementsByTagName("td")[0].innerText == isbn13GenreId)
        {
            //console.log("Updating row");
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            let td = updateRowIndex.getElementsByTagName("td")[2];

            if (parsedData.length === 0)
            {
                td.innerHTML = "";
            }
            else
            {
                td.innerHTML = parsedData[0].genreName;
            }
            
            break;
        }
    }
}