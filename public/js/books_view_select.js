//https://stackoverflow.com/questions/8922002/attach-event-listener-through-javascript-to-radio-button
//https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp

let viewSelectForm = document.getElementById("view-select");

viewSelectForm.addEventListener('click', function(e) 
{
    booksSection= document.getElementById("books-section");
    booksAuthorsSection = document.getElementById("booksauthors-section");
    booksGenresSection = document.getElementById("booksgenres-section");
    combinedTableSection = document.getElementById("combinedtable-section");

    if(e.target && e.target.matches("input[type='radio']"))
    {
        //console.log(e.target)
        //console.log(e.target.value)
        if(e.target.value == 1)
        {
            console.log("toggling books section");
            booksSection.style.display = "block";
            booksAuthorsSection.style.display = "none";
            booksGenresSection.style.display = "none";
            combinedTableSection.style.display = "none";
        }
        else if (e.target.value == 2)
        {
            //show booksauthors table
            booksSection.style.display = "none";
            booksAuthorsSection.style.display = "block";
            booksGenresSection.style.display = "none";
            combinedTableSection.style.display = "none";
        }
        else if (e.target.value == 3)
        {
            //show booksgenres table
            booksSection.style.display = "none";
            booksAuthorsSection.style.display = "none";
            booksGenresSection.style.display = "block";
            combinedTableSection.style.display = "none";
        }
        else if (e.target.value == 4)
        {
            //show combined table
            booksSection.style.display = "none";
            booksAuthorsSection.style.display = "none";
            booksGenresSection.style.display = "none";
            combinedTableSection.style.display = "block";
        }
    }
});