//app.js

// SETUP
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

PORT = 9125;

var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');                 // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));              // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                             // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Static Files
app.use(express.static('public'));

// ROUTES
app.get('/', function(req, res)
    {                                                       
        let query1 = "SELECT * FROM Books;";                        // Define our query

        db.pool.query(query1, function(error, rows, fields){        // Execute query

            res.render('index', {data: rows});                      // Render the index.hbs file, and also send the renderer an object 
        })                                                          // where 'data is equal to the 'rows' we recieved back from the query
        
    });

// RENDER EMPLOYEES ENTITY PAGE
app.get('/employees', function(req, res)
    {                                                       
        let query1 = "SELECT employeeId, employeeFirstName, employeeLastName, employeePhone, DATE_FORMAT(hireDate, '%M %d %Y') AS 'hireDay', isActive FROM Employees;";                        // Define our query

        db.pool.query(query1, function(error, rows, fields){        // Execute query

            res.render('employees', {data: rows});                      // Render the employees.hbs file, and also send the renderer an object 
        })                                                          // where 'data is equal to the 'rows' we recieved back from the query
        
    });

// POST ROUTES
// ADD-EMPLOYEE
app.post('/add-employee', function(req, res) 
{
    
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let employee_fname = data.fname;
    let lname = data.lname;
    let phone = parseInt(data.phoneNumber);
    if (isNaN(phone))
    {
        phone = 'NULL'
    }
    let isactive = parseInt(data.isActive);
    if (isNaN(isactive))
    {
        isactive = 'NULL'
    }
    let hiredate = data.hireDate;

    // Format the hiredate for insertion
    let formatDate = `SELECT DATE_FORMAT(${hiredate}, '%Y-%m-%d')`;

    // Create the query and run it on the database
    setMode = `SET sql_mode = ''`; 
    addEmployee = `INSERT INTO Employees (employeeFirstName, employeeLastName, employeePhone, hireDate, isActive) VALUES (?, ?, ?, ?, ?)`;
    
    // Changes strict mode
    db.pool.query(setMode, function(error, rows, fields){
        // if (error) {
        //     console.log(error)
        //     res.sendStatus(400);
        // } else {
            /// Insert employee
            db.pool.query(addEmployee, [employee_fname, lname, phone, hiredate, isactive], function(error, rows, fields){
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                } else {
                    // Select employees
                    selectEmployees = "SELECT employeeId, employeeFirstName, employeeLastName, employeePhone, DATE_FORMAT(hireDate, '%M %d %Y') AS 'hireDay', isActive FROM Employees;";

                    db.pool.query(selectEmployees, function(error, rows, fields){
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
            })
        })
});

// DELETE ROUTE
app.delete('/delete-employees/', function(req,res,next){             // Route for deleting data from Employees
    let data = req.body;
    let employeeID = parseInt(data.id);
    let deleteEmployee = `DELETE FROM Employees WHERE employeeId = ?`;

  
          // Run the 1st query
          db.pool.query(deleteEmployee, [employeeID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                
                res.sendStatus(204);                    
              }
  })});

// UPDATE EMPLOYEE 
app.put('/update-employee', function(req,res,next){
    let data = req.body;
  
    let employeeId = parseInt(data.employeeId);
    let employeePhone = parseInt(data.employeePhone);

    let queryUpdatePhone = `UPDATE Employees SET employeePhone= ? WHERE employeeId= ?`;
    let selectEmployee = `SELECT * FROM Employees WHERE employeeId = ?`;

          // Run the 1st query
          db.pool.query(queryUpdatePhone, [employeePhone, employeeId], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              } 
              else 
              {
                // Run the second query
                db.pool.query(selectEmployee, [employeeId], function(error, rows, fields) {
                    console.log(rows)
                    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});


app.get('/publishers', function(req, res)
{
    let query1 = "SELECT * FROM Publishers;";

    db.pool.query(query1, function(error, rows, fields){
        res.render('publishers', {data: rows});
    })
});

app.get('/authors', function(req, res)
{
    let query1 = "SELECT * FROM Authors;";

    db.pool.query(query1, function(error, rows, fields){
        res.render('authors', {data: rows});
    })
});

//https://www.mysqltutorial.org/mysql-group_concat/
//https://stackoverflow.com/questions/10336022/mysql-group-concat-with-nulls
app.get('/books', function(req, res)
{
    /*QUERIES*/
    // Declare Query 1 (table data retrieval)
    let getBooksQ;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.bookTitle === undefined)
    {
        // Query to retrieve the Books table from SQL database
        getBooksQ = "SELECT isbn13 AS ISBN13, title AS Title, publisherId AS Publisher, price AS Price, quantity AS Quantity FROM Books;";
    }

    // If there is a query string, we assume this is a search, and return the desired results
    else
    {
        getBooksQ = `SELECT isbn13 AS ISBN13, title AS Title, publisherId AS Publisher, price AS Price, quantity AS Quantity FROM Books WHERE Title LIKE "%${req.query.bookTitle}%"`
    }
    
    let getBooksAuthorsQ = "SELECT isbn13AuthorId AS ID, authorId AS Author, isbn13 AS Book FROM BooksAuthors;";
    let getBooksGenresQ = "SELECT isbn13GenreId AS ID, isbn13 AS Book, genreId AS Genre FROM BooksGenres;";
    let getPublishersQ = "SELECT * FROM Publishers;";
    let getAuthorsQ = "SELECT * FROM Authors;";
    let getGenresQ = "SELECT * FROM Genres;";
    let getCombinedTableQ = `SELECT Books.isbn13 AS ISBN13, 
                                Books.title AS Title, 
                                IFNULL(GROUP_CONCAT(DISTINCT CONCAT(Authors.authorFirstName, ' ', Authors.authorLastName) SEPARATOR ", "), "N/A") AS Author, 
                                IFNULL(GROUP_CONCAT(Genres.genreName SEPARATOR ", "), "N/A") AS "Genre", 
                                Books.price AS Price, 
                                IFNULL(Publishers.publisherName, "N/A") AS Publisher, 
                                Books.quantity AS QTY 
                            FROM Books
                            LEFT JOIN Publishers ON Books.publisherId = Publishers.publisherId
                            LEFT JOIN BooksAuthors ON Books.isbn13 = BooksAuthors.isbn13
                            LEFT JOIN BooksGenres ON Books.isbn13 = BooksGenres.isbn13
                            LEFT JOIN Authors ON BooksAuthors.authorId = Authors.authorId
                            LEFT JOIN Genres ON BooksGenres.genreId = Genres.genreId
                            GROUP BY Books.isbn13
                            ORDER BY Authors.authorLastName;`


    db.pool.query(getBooksQ, function(error, rows, fields)
    {
        // Save the books
        let books = rows;

        let bookMap = {};
        books.map(book => {
            let id = parseInt(book.ISBN13, 10);
            bookMap[id] = book["Title"];
        })

        // Run the second query
        db.pool.query(getPublishersQ, (error, rows, fields) => {

            // Save the publishers
            let publishers = rows;

            // Construct an object for reference in the table
            let publisherMap = {};
            publishers.map(publisher => {
                let id = parseInt(publisher.publisherId, 10);
                publisherMap[id] = publisher["publisherName"];
            })

            // Overwrite the publisher ID with the name of the publisher in the books object
            books = books.map(book => {
                return Object.assign(book, {Publisher: publisherMap[book.Publisher]})
            })

            db.pool.query(getBooksAuthorsQ, (error, rows, fields) => {
                let booksauthors = rows;

                db.pool.query(getAuthorsQ, (error, rows, fields) => {
                    let authors = rows;

                    let authorMap = {};
                    authors.map(author => {
                        let id = parseInt(author.authorId, 10);
                        authorMap[id] = author["authorFirstName"] + " " + author["authorLastName"];
                    })

                    booksauthors = booksauthors.map(bookauthor => {
                        return Object.assign(bookauthor, {Author: authorMap[bookauthor.Author]})
                    })

                    booksauthors = booksauthors.map(bookauthor => {
                        return Object.assign(bookauthor, {Book: bookMap[bookauthor.Book]})
                    })

                    db.pool.query(getBooksGenresQ, (error, rows, fields) => {
                        let booksgenres = rows;

                        db.pool.query(getGenresQ, (error, rows, fields) => {
                            let genres = rows;
                            
                            let genreMap = {};
                            genres.map(genre => {
                                let id = parseInt(genre.genreId, 10);
                                genreMap[id] = genre["genreName"]
                            })

                            booksgenres = booksgenres.map(bookgenre => {
                                return Object.assign(bookgenre, {Book: bookMap[bookgenre.Book]});
                            })

                            booksgenres = booksgenres.map(bookgenre => {
                                return Object.assign(bookgenre, {Genre: genreMap[bookgenre.Genre]});
                            })

                            db.pool.query(getCombinedTableQ, (error, rows, fields) => {
                                if(error)
                                {
                                    console.log(error)
                                }
                                else
                                {
                                    let combined = rows;
                                    return res.render('books', {booksdata: books, publishersdata: publishers, booksauthorsdata: booksauthors, authorsdata: authors, booksgenresdata: booksgenres, genresdata: genres, combineddata: combined});
                                }  
                            })
                        })
                    })
                })
            })
        })
    })
});

app.put('/put-bookgenre', function(req, res, next)
{
    let data = req.body;

    let isbn13GenreId = parseInt(data.isbn13GenreId);
    let genreId = parseInt(data.genreId);

    if (isNaN(genreId))
    {
        genreId = null;
    }

    let updateBookGenreQ = `UPDATE BooksGenres SET genreId = ? WHERE BooksGenres.isbn13GenreId = ?`;
    let selectGenre = `SELECT * FROM Genres WHERE genreId= ?`;

    db.pool.query(updateBookGenreQ, [genreId, isbn13GenreId], function(error, rows, fields)
    {
        if (error) 
        {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            console.log(`Query: ${updateBookGenreQ} successful`);
            db.pool.query(selectGenre, [genreId], function(error, rows, fields)
            {
                if (error)
                {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    //console.log(rows);
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-bookgenre', function(req, res)
{
    //Data
    let data = req.body;

    let book = parseInt(data.isbn13);
    let genre = parseInt(data.genreId);

    if (isNaN(book))
    {
        book = null;
    }

    if (isNaN(genre))
    {
        genre = null;
    }

    //Queries
    let checkDuplicatesQ = `SELECT COUNT(*) AS numDups FROM BooksGenres WHERE isbn13 = ${book} AND genreId = ${genre};`
    let postBooksGenresQ = `INSERT INTO BooksGenres (isbn13, genreId) VALUE (${book}, ${genre});`;
    let getBooksGenresQ = `SELECT * FROM BooksGenres;`;
    let getGenresQ = `SELECT * FROM Genres;`
    let getBooksQ = `SELECT * FROM Books;`

    //Query Calls
    db.pool.query(checkDuplicatesQ, function(error, rows, fields)
    {
        if(error)
        {
            console.log(error)
            res.sendStatus(400)
        }
        else
        {
            let dupCount = rows[0].numDups;

            if (dupCount > 0)
            {
                console.log("Duplicate entry");
            }
            else
            {
                db.pool.query(postBooksGenresQ, function(error, rows, fields)
                {
                    if (error)
                    {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        db.pool.query(getBooksGenresQ, function(error, rows, fields)
                        {
                            if(error)
                            {
                                console.log(error);
                                res.sendStatus(400);
                            }
                            else
                            {
                                // Dyanmically update new row with Book and Genre names
                                let booksgenres = rows;
                                
                                db.pool.query(getBooksQ, function(error, rows, fields)
                                {
                                    let books = rows;
            
                                    let bookMap = {};
                                    books.map(book => {
                                        let id = parseInt(book.isbn13, 10);
                                        bookMap[id] = book["title"];
                                    })

                                    db.pool.query(getGenresQ, function(error, rows, fields)
                                    {
                                        let genres = rows;
                                        let genreMap = {};
                                        
                                        genres.map(genre => {
                                            let id = parseInt(genre.genreId, 10);
                                            genreMap[id] = genre["genreName"]
                                        })

                                        booksgenres = booksgenres.map(bookgenre => {
                                            return Object.assign(bookgenre, {isbn13: bookMap[bookgenre.isbn13]});
                                        })

                                        booksgenres = booksgenres.map(bookgenre => {
                                            return Object.assign(bookgenre, {genreId: genreMap[bookgenre.genreId]});
                                        })

                                        res.send(booksgenres);
                                    })

                                })
                            }
                        })
                    }
                })
            }
        }
    })
});

app.post('/add-bookauthor', function(req, res)
{
    //Data
    let data = req.body;

    let author = parseInt(data.authorId);
    let book = parseInt(data.isbn13);
    if (isNaN(author))
    {
        author = null
    }

    if (isNaN(book))
    {
        book = null
    }
    
    //Queries
    let checkDuplicatesQ = `SELECT COUNT(*) AS numDups FROM BooksAuthors WHERE authorId = ${author} AND isbn13 = ${book};`;
    let postBooksAuthorsQ = `INSERT INTO BooksAuthors (authorId, isbn13) VALUE (${author}, ${book});`
    let getAuthorsQ = "SELECT * FROM Authors;";
    let getBooksQ = "SELECT * FROM Books;";
    let getBooksAuthorsQ = `SELECT * FROM BooksAuthors;`;

    //Query Calls
    db.pool.query(checkDuplicatesQ, function(error, rows, fields)
    {
        if (error)
        {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            let data = rows
            let dupCount = data[0].numDups;

            if (dupCount > 0)
            {
                console.log("Duplicate entry");
            }
            else
            {
                db.pool.query(postBooksAuthorsQ, function(error, rows, fields)
                {
                    if (error)
                    {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        db.pool.query(getBooksAuthorsQ, function(error, rows, fields)
                        {
                            if (error)
                            {
                                console.log(error);
                                res.sendStatus(400);
                            }
                            else
                            {
                                /*Dynamically update row with Author Name and Book Title*/
                                let booksauthors = rows;
            
                                db.pool.query(getAuthorsQ, function(error, rows, fields)
                                {
                                    let authors = rows;
            
                                    let authorMap = {};
                                    authors.map(author => {
                                        let id = parseInt(author.authorId, 10);
                                        authorMap[id] = author["authorFirstName"] + " " + author["authorLastName"];
                                    })
            
                                    db.pool.query(getBooksQ, function(error, rows, fields)
                                    {
                                        let books = rows;
            
                                        let bookMap = {};
                                        books.map(book => {
                                            let id = parseInt(book.isbn13, 10);
                                            bookMap[id] = book["title"];
                                        })
            
                                        booksauthors = booksauthors.map(bookauthor => {
                                            return Object.assign(bookauthor, {authorId: authorMap[bookauthor.authorId]})
                                        })
                    
                                        booksauthors = booksauthors.map(bookauthor => {
                                            return Object.assign(bookauthor, {isbn13: bookMap[bookauthor.isbn13]})
                                        })
            
                                        res.send(booksauthors);
                                    })
                                })
                            }
                        })
                    }
                })
            }
        }
    })
});

app.post('/add-publisher', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let pname = data.publisherName;

    if (pname == "")
    {
        pname = null;
    }

    // Create the query and run it on the database
    if (pname == null)
    {
        query1 = `INSERT INTO Publishers (publisherName) VALUES (${pname});`;
    }
    else
    {
        query1 = `INSERT INTO Publishers (publisherName) VALUES ('${data.publisherName}');`;
    }
    
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Publishers
            query2 = `SELECT * FROM Publishers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});



app.post('/add-author', function(req, res)
{
    let data = req.body;

    let fname = data.authorFirstName;
    let lname = data.authorLastName;

    if (fname == "")
    {
        fname = null;
    }

    if (lname == "")
    {
        lname = null;
    }

    // Create the query and run it on the database
    if (lname == null && fname == null)
    {
        query1 = `INSERT INTO Authors(authorFirstName, authorLastName) VALUES (${fname}, ${lname});`;
    }
    else if (lname == null)
    {
        query1 = `INSERT INTO Authors(authorFirstName, authorLastName) VALUES ('${fname}', ${lname});`;
    }
    else if (fname == null)
    {
        query1 = `INSERT INTO Authors(authorFirstName, authorLastName) VALUES (${fname}, '${lname}');`;
    }
    else
    {
        query1 = `INSERT INTO Authors(authorFirstName, authorLastName) VALUES ('${fname}', '${lname}');`;
    }
    
    db.pool.query(query1, function(error, rows, fields)
    {
        if (error) 
        {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Authors;`;
            db.pool.query(query2, function(error, rows, fields)
            {
                if (error) 
                {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-book', function(req, res)
{
    let data = req.body;
    
    // Data Validation
    let isbn = data.isbn13;
    let title = data.title;
    let publisherId = data.publisherId;
    let price = data.price;
    let quantity = data.quantity;

    //isbn - check to see if result is NaN and set to null if true
    if (isNaN(isbn) || isbn == '')
    {
        isbn = null
    }

    //console.log(`ISBN = ${isbn}`);

    //title - check for empty string
    if (title == '')
    {
        title = null;
    }

    //publisherId - check for null
    if (isNaN(publisherId) || publisherId == '')
    {
        publisherId = null;
    }

    //price - check for null
    if (isNaN(price) || price == '')
    {
        price = null;
    }

    //quantity - check for null
    if (isNaN(quantity) || quantity == '')
    {
        quantity = null;
    }

    if(title == null || isbn == null)
    {
        if (title == null && isbn != null)
        {
            query1 = `INSERT INTO Books(isbn13, title, price, publisherId, quantity) VALUES ('${isbn}', ${title}, ${price}, ${publisherId}, ${quantity});`;
        }
        else if (title != null || isbn == null)
        {
            query1 = `INSERT INTO Books(isbn13, title, price, publisherId, quantity) VALUES (${isbn}, '${title}', ${price}, ${publisherId}, ${quantity});`;
        }
        else if (title == null && isbn == null)
        {
            query1 = `INSERT INTO Books(isbn13, title, price, publisherId, quantity) VALUES (${isbn}, ${title}, ${price}, ${publisherId}, ${quantity});`;
        }
    }
    else
    {
        query1 = `INSERT INTO Books(isbn13, title, price, publisherId, quantity) VALUES ('${isbn}', '${title}', ${price}, ${publisherId}, ${quantity});`;
    }

    db.pool.query(query1, function(error, rows, fields)
    {
        if(error)
        {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            query2 = "SELECT * FROM Books";
            db.pool.query(query2, function(error, rows, fields)
            {
                if (error)
                {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    // We're sending our response to add_book, which then calls addRowToTable
                    // and dynamically populates the table with data without refreshing. We want
                    // this data to include the publisher name, not ID, so we need to do the same
                    // reassignment as in GET /books
                    let books = rows;
                    query3 = "SELECT * FROM Publishers;";
                    db.pool.query(query3, function(error, rows, fields)
                    {
                        let publishers = rows;
                        
                        let publisherMap = {};
                        publishers.map(publisher => {
                            let id = parseInt(publisher.publisherId, 10);
                            publisherMap[id] = publisher["publisherName"];
                        })

                        books = books.map(book => {
                            return Object.assign(book, {publisherId: publisherMap[book.publisherId]})
                        })

                        res.send(books);
                    })
                }
            })
        }
    })
});

// RENDER GENRES ENTITY PAGE
app.get('/genres', function(req, res)
    {  
        let query1 = "SELECT * FROM Genres;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('genres', {data: rows});                  // Render the genres.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

// ADD GENRE
app.post('/add-genre', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let genreName = parseInt(data.genreName);
    if (isNaN(genreName))
    {
        genreName = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Genres (genreName) VALUES ('${data.genreName}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Genres;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// DELETE GENRE
app.delete('/delete-genre', function(req,res,next){
    let data = req.body;
    let genreID = parseInt(data.id);
    let deleteGenres = `DELETE FROM Genres WHERE genreId = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteGenres, [genreID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
                  // Run the second query
              }
  })});


// RENDER SALES ENTITY PAGE
app.get('/sales', function(req, res)
    {  
        let query1 = "SELECT saleId, DATE_FORMAT(saleDate, '%M %d %Y') AS 'saleDay', totalSaleAmount, concat(Employees.employeeFirstName, ' ', Employees.employeeLastName) AS 'employeeName' FROM Sales INNER JOIN Employees ON Sales.employeeId = Employees.employeeId ORDER BY Sales.saleId ASC;";
        let query2 = "SELECT employeeId, employeeFirstName, employeeLastName FROM Employees;"
        let query3 = "SELECT * FROM BooksSales;"
        let query4 = "SELECT * FROM Books;"

        db.pool.query(query1, function(error, rows, fields){
            let sales = rows;
            db.pool.query(query2, function(error, rows, fields){
                let employees = rows;
                db.pool.query(query3, function(error, rows, fields){
                    let bookssales = rows;
                    db.pool.query(query4, function(error, rows, fields){
                        let books = rows;
                        res.render('sales', {data: sales, employees: employees, bookssales: bookssales, books: books});
                    })
                })
            })
        })
    });

// ADD SALE
app.post('/add-sale', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let saleId = data.saleId;
    let saleDate = data.saleDate;
    let employeeId = parseInt(data.employeeId);
    if (isNaN(employeeId))
    {
        employeeId = 'NULL'
    };
    let temporaryTotalSaleAmount = 0;

    // Create the query and run it on the database

    addSale = `INSERT INTO Sales (saleDate, totalSaleAmount, employeeId) VALUES (?, ?, ?)`;

        db.pool.query(addSale, [saleDate, temporaryTotalSaleAmount, employeeId], function(error, rows, fields){

            if (error) {
        
                console.log(error)
                res.sendStatus(400);
                }
            else
                {
                    selectSales = `SELECT saleId, DATE_FORMAT(saleDate, '%M %d %Y') AS 'saleDay', totalSaleAmount, concat(Employees.employeeFirstName, ' ', Employees.employeeLastName) AS 'employeeName' FROM Sales INNER JOIN Employees ON Sales.employeeId = Employees.employeeId ORDER BY Sales.saleId ASC;`;
                    db.pool.query(selectSales, function(error, rows, fields){
        
                        if (error) {
                            
                            console.log(error);
                            res.sendStatus(400);
                        }
                        else
                        {
                            res.send(rows);
                        }
                    })
                }
        })
    })

// DELETE SALE
app.delete('/delete-sale', function(req,res,next){
    let data = req.body;
    let saleID = parseInt(data.id);
    let deleteSales = `DELETE FROM Sales WHERE saleId = ?`;
  
  
          db.pool.query(deleteSales, [saleID], function(error, rows, fields){
              if (error) {
  
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});

  app.get('/books-sales', function(req, res)
  {  
      let query1 = "SELECT saleId, DATE_FORMAT(saleDate, '%M %d %Y') AS 'saleDay', totalSaleAmount, concat(Employees.employeeFirstName, ' ', Employees.employeeLastName) AS 'employeeName' FROM Sales INNER JOIN Employees ON Sales.employeeId = Employees.employeeId ORDER BY Sales.saleId ASC;";
      let query2 = "SELECT employeeId, employeeFirstName, employeeLastName FROM Employees;"
      let query3 = "SELECT * FROM BooksSales;"
      let query4 = "SELECT * FROM Books;"

      db.pool.query(query1, function(error, rows, fields){
          let sales = rows;
          db.pool.query(query2, function(error, rows, fields){
              let employees = rows;
              db.pool.query(query3, function(error, rows, fields){
                  let bookssales = rows;
                  db.pool.query(query4, function(error, rows, fields){
                      let books = rows;
                      res.render('books-sales', {data: sales, employees: employees, bookssales: bookssales, books: books});
                  })
              })
          })
      })
  });

// ADD BOOKSSALES
app.post('/add-books-sales', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let isbn13 = data.isbn13;
    let saleId = data.saleId;
    let lineQuantity = data.lineQuantity;

    // Create the query and run it on the database

    let addBooksSales = `INSERT INTO BooksSales (isbn13, saleId, quantity, lineTotal) VALUES (?, ?, ?, ?)`;
    let prices = "SELECT price FROM Books WHERE isbn13 = ?;"
    let selectQuantity = "SELECT quantity FROM Books WHERE isbn13 = ?;"
    let adjustQuantity = "UPDATE Books SET quantity = ? WHERE isbn13 = ?;"

    let selectTotalSaleAmount = "SELECT SUM(lineTotal) AS sum FROM BooksSales WHERE saleId = ?;"
    let updateTotalSale = "UPDATE Sales SET totalSaleAmount = ? WHERE saleId = ?;"

    db.pool.query(prices, [isbn13], function(error, rows, fields){
        let price = rows[0].price;
        let lineTotal = data.lineQuantity * price;

        db.pool.query(addBooksSales, [isbn13, saleId, lineQuantity, lineTotal], function(error, rows, fields){

            db.pool.query(selectQuantity, [isbn13], function(error, rows, fields){

                let quantity = rows[0].quantity;
                let subtractedQuantity = quantity - data.lineQuantity;

                db.pool.query(adjustQuantity, [subtractedQuantity, isbn13], function(error, rows, fields){

                    db.pool.query(selectTotalSaleAmount, [saleId], function(error, rows, fields){
                        let totalSaleAmount = rows[0].sum;

                        db.pool.query(updateTotalSale, [totalSaleAmount, saleId], function(error, rows, fields){

                            if (error) {
                                console.log(error)
                                res.sendStatus(400);
                            }
                            else
                            {
                                selectBooksSales = `SELECT * FROM BooksSales;`;
                                db.pool.query(selectBooksSales, function(error, rows, fields){
                                    if (error) {
                                        console.log(error);
                                        res.sendStatus(400);
                                    }
                                    else
                                    {
                                        res.send(rows);
                                    }
                                })
                            }
                        })
                    })
                })
            })
        })
    })
});

// DELETE BOOKSSALES
app.delete('/delete-books-sales', function(req,res,next){
    let data = req.body;
    let isbn13saleId = parseInt(data.id);
    let isbn13 = data.isbn13;
    let quantity = data.quantity;
    let lineTotal = data.lineTotal;
    let saleId = data.saleId;
    let deleteBooksSales = `DELETE FROM BooksSales WHERE isbn13SaleId = ?`;
    let selectQuantity = "SELECT quantity FROM Books WHERE isbn13 = ?;"
    let adjustQuantity = "UPDATE Books SET quantity = ? WHERE isbn13 = ?;"
    let selectTotalSaleAmount = "SELECT totalSaleAmount FROM Sales WHERE saleId = ?;"
    let updateTotalSale = "UPDATE Sales SET totalSaleAmount = ? WHERE saleId = ?;"
  

    db.pool.query(selectQuantity, [isbn13], function(error, rows, fields){

        let booksQuantity = rows[0].quantity;
        let addedQuantity = booksQuantity + quantity;

        db.pool.query(adjustQuantity, [addedQuantity, isbn13], function(error, rows, fields){

            db.pool.query(deleteBooksSales, [isbn13saleId], function(error, rows, fields){

                    db.pool.query(selectTotalSaleAmount, [saleId], function(error, rows, fields){
                        let originalTotalSaleAmount = rows[0].totalSaleAmount
                        let newTotalSaleAmount = originalTotalSaleAmount - lineTotal

                        db.pool.query(updateTotalSale, [newTotalSaleAmount, saleId], function(error, rows, fields){
                                
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                                }
                                else
                                {
                                    res.sendStatus(204);
                                }
                        })
                    })
            })
        })
})});

// LISTENER
app.listen(PORT, function() {
    console.log('Express started on flip2.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});
