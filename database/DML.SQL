-- Team members: Samantha Jones and Jonathan Louangrath (Group 7)
-- Project: Rage Against the Page - independent bookstore inventory and catalog
-- Queries for bookstore functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language


-- Books
--------------------------------------------------------------
--Select all books
SELECT * FROM Books;

--Select existing isbn13s and titles for Update a Book, Add Author to Book, Add Genre to Book, add Line Items to Sales form dropdowns
SELECT isbn13, title FROM Books;

--Add a new book
INSERT INTO `Books` (`isbn13`, `title`, `price`, `publisherId`, `quantity`) VALUES (:isbn13Input, :titleInput, :priceInput, :publisherIdInput, :quantityInput);

-- Delete a book
DELETE FROM Books
WHERE isbn13 = :isbn13Input;

--Update Book
UPDATE Books
SET title = :titleInput, price =:priceInput, publisherId = :publisherIdFromTable, quantity = :quantityInput
WHERE isbn13 = :isbn13FromTable;

-- Search for Books with title
SELECT * FROM Books WHERE title LIKE :titleInput;

--Remove relationship between Books and Publishers by updating publisherId FK to NULL (NULLable relationship)
UPDATE Books
SET publisherId = NULL
WHERE isbn13 = :isbn13Input;

--Get all books and their publishers for the Books page to make FKs user friendly
SELECT isbn13, title, Publishers.publisherName AS publisherName, price, quantity FROM Books
INNER JOIN Publishers ON Books.publisherId = Publishers.publisherId;


-- BooksAuthors
--------------------------------------------------------------
--Select all BooksAuthors
SELECT * FROM BooksAuthors;

--Add a new BooksAuthors
INSERT INTO `BooksAuthors` (`authorId`, `isbn13`) VALUES (:authorIdInput, :isbn13Input);

-- Delete a BooksAuthors
DELETE FROM BooksAuthors
WHERE isbn13AuthorId = :isbn13AuthorIdFromDropdown;


-- Authors
--------------------------------------------------------------
--Select all authors
SELECT * FROM Authors;

--Select existing authors' names for Add Author to Book, Add a New Book form dropdown
SELECT authorFirstName, authorLastName FROM Authors;

--Add a new author
INSERT INTO `Authors` (`authorId`, `authorFirstName`, `authorLastName`) VALUES (:authorIdInput, :authorFirstNameInput, :authorLastNameInput);

-- Delete an author
DELETE FROM Authors
WHERE authorId = :authorIdFromTable;

--Update author
UPDATE Authors
SET authorFirstName = :authorFirstNameInput, authorLastName = :authorLastNameInput
WHERE authorId = :authorIdFromDropdown;

-- Search for authors with name
SELECT * FROM Authors WHERE authorLastName LIKE :authorLastNameInput;


-- Publishers
--------------------------------------------------------------
--Select all publishers
SELECT * FROM Publishers;

--Select publisherName for Add a New Book dropdown
SELECT publisherName from Publishers;

--Add a new publisher
INSERT INTO `Publishers` (`publisherId`, `publisherName`) VALUES (:publisherIdInput, :publisherNameInput);

-- Delete a publisher
DELETE FROM Publishers
WHERE publisherId = :publisherIdFromTable;

--Update author
UPDATE Authors
SET publisherName = :publisherNameInput
WHERE publisherId = :publisherIdFromTable;


-- Genres
--------------------------------------------------------------
--Select all genres
SELECT * FROM Genres;

--Add a new genre
INSERT INTO `Genres` (`genreId`, `genreName`) VALUES (:genreIdInput, :genreNameInput);

-- Delete a genre
DELETE FROM Genres
WHERE genreId = :genreIdFromTable;

--Update genre
UPDATE Genres
SET genreName = :genreNameInput
WHERE genreId = :genreIdFromTable;

--Select genres for Add a New Book, Update a Book, Add Genre to Book form dropdown
SELECT genreName from Genres;


-- BooksGenres
--------------------------------------------------------------
--Select all BooksGenres
SELECT * FROM BooksGenres;

--Add a new BooksGenres
INSERT INTO `BooksGenres` (`isbn13`, `genreId`) VALUES (:isbn13Input, :genreIdInput);

-- Delete a BooksGenres
DELETE FROM BooksGenres
WHERE isbn13GenreId = :isbn13GenreIdFromTable;


-- Sales
--------------------------------------------------------------
--Select all sales
SELECT * FROM Sales;

--Select saleId and saleDate for Add Line Items to Sales form dropdown
SELECT saleId, saleDate FROM Sales;

--Select saleId for Remove Line Item From Sales form dropdown
SELECT saleId FROM Sales;

--Add a new sale
INSERT INTO `Sales` (`saleId`, `saleDate`, `totalSaleAmount`, `employeeId`) VALUES (:saleIdInput, :saleDateInput, :totalSaleAmountInput, :employeeIdInput);

-- Delete a sale
DELETE FROM Sales
WHERE saleId = :saleIdFromButton;

--Update sale
UPDATE Sales
SET saleDate = :saleDateInput, totalSaleAmount = :totalSaleAmountInput, employeeId = :employeeIdFromTable
WHERE saleId = :saleIdInput;

-- Search for sales with date
SELECT * FROM Sales WHERE saleDate = :saleDateInput;

-- Get all sales and employee names for the Sales page to make FKs user friendly
SELECT saleId, saleDate, totalSaleAmount, Employees.employeeFirstName, Employees.employeeLastName FROM Sales
INNER JOIN Employees ON Sales.employeeId = Employees.employeeId;

-- BooksSales
--------------------------------------------------------------
--Select all BooksSales
SELECT * FROM BooksSales;

--Add a new BooksSales
INSERT INTO `BooksSales` (`isbn13`, `saleId`, `quantity`, `lineTotal`) VALUES (:isbn13Input, :saleIdFromTable, :quantityInput, :lineTotalInput);

-- Delete a BooksSales
DELETE FROM BooksSales
WHERE isbn13SaleId = :isbn13SaleIdFromTable;

-- Dis-associate a book from a sale (M-to-M relationship deletion)
DELETE FROM BooksSales WHERE isbn13 = :isbn13Input AND saleId = :saleIdInput;

-- Employees
--------------------------------------------------------------
--Select all employees
SELECT * FROM Employees;

--Select employee by employeeId
SELECT * FROM Employees WHERE employeeId = :employeeIdInput;

--Select employee names for Add a New Sale form dropdown
SELECT employeeFirstName, employeeLastName from Employees;

--Add a new employee
INSERT INTO Employees (employeeFirstName, employeeLastName, employeePhone, hireDate, isActive) VALUES (${data.fname}, ${data.lname}, ${data.phoneNumber}, ${data.hireDate}, ${data.isActive});

-- Delete an employee
DELETE FROM Employees WHERE employeeId = :employeeIdFromDropdown;

--Update employee
UPDATE Employees SET employeePhone = :employeePhoneInput WHERE employeeId = :employeeIdInput;

--Update employee phone
UPDATE Employees SET employeePhone = ? WHERE employeeId = ?;

-- Search for employees by last name for Search for Employee by Last Name form
SELECT * FROM Employees WHERE employeeLastName LIKE :employeeLastNameInput;
