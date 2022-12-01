-- Team members: Samantha Jones and Jonathan Louangrath (Group 7)
-- Project: Rage Against the Page - independent bookstore inventory and catalog

-- Disable foreign key checks and commits
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Table `Publishers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Publishers` ;

CREATE TABLE IF NOT EXISTS `Publishers` (
  `publisherId` INT AUTO_INCREMENT,
  `publisherName` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`publisherId`),
  CONSTRAINT `publisherIdUnique` UNIQUE (`publisherId`));


-- -----------------------------------------------------
-- Table `Books`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Books` ;

CREATE TABLE IF NOT EXISTS `Books` (
  `isbn13` VARCHAR(17) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `publisherId` INT,
  `quantity` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`isbn13`),
  CONSTRAINT `isbnUnique` UNIQUE (`isbn13`),
  FOREIGN KEY (`publisherId`)
    REFERENCES `Publishers` (`publisherId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `Authors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Authors` ;

CREATE TABLE IF NOT EXISTS `Authors` (
  `authorId` INT NOT NULL AUTO_INCREMENT,
  `authorFirstName` VARCHAR(50) NOT NULL,
  `authorLastName` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`authorId`),
  CONSTRAINT `authorIdUnique` UNIQUE (`authorId`));


-- -----------------------------------------------------
-- Table `Genres`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Genres` ;

CREATE TABLE IF NOT EXISTS `Genres` (
  `genreId` INT NOT NULL AUTO_INCREMENT,
  `genreName` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`genreId`),
  CONSTRAINT `genreIdUnique` UNIQUE (`genreId`));


-- -----------------------------------------------------
-- Table `Employees`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Employees` ;

CREATE TABLE IF NOT EXISTS `Employees` (
  `employeeId` INT NOT NULL AUTO_INCREMENT,
  `employeeFirstName` VARCHAR(50) NOT NULL,
  `employeeLastName` VARCHAR(50) NOT NULL,
  `employeePhone` VARCHAR(15) NOT NULL,
  `hireDate` DATE NOT NULL,
  `isActive` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`employeeId`),
  CONSTRAINT `employeeIdUnique` UNIQUE (`employeeId`));


-- -----------------------------------------------------
-- Table `Sales`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Sales` ;

CREATE TABLE IF NOT EXISTS `Sales` (
  `saleId` INT NOT NULL AUTO_INCREMENT,
  `saleDate` DATE NOT NULL,
  `totalSaleAmount` DECIMAL(10,2),
  `employeeId` INT NOT NULL,
  PRIMARY KEY (`saleId`),
  CONSTRAINT `saleIdUnique` UNIQUE (`saleId`),
  FOREIGN KEY (`employeeId`)
    REFERENCES `Employees` (`employeeId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `BooksSales`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `BooksSales` ;

CREATE TABLE IF NOT EXISTS `BooksSales` (
  `isbn13SaleId` INT NOT NULL AUTO_INCREMENT,
  `isbn13` VARCHAR(17) NOT NULL,
  `saleId` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `lineTotal` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`isbn13SaleId`),
  FOREIGN KEY (`isbn13`)
    REFERENCES `Books` (`isbn13`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`saleId`)
    REFERENCES `Sales` (`saleId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `BooksGenres`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `BooksGenres` ;

CREATE TABLE IF NOT EXISTS `BooksGenres` (
  `isbn13GenreId` INT NOT NULL AUTO_INCREMENT,
  `isbn13` VARCHAR(17) NOT NULL,
  `genreId` INT,
  PRIMARY KEY (`isbn13GenreId`),
  FOREIGN KEY (`isbn13`)
    REFERENCES `Books` (`isbn13`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`genreId`)
    REFERENCES `Genres` (`genreId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `BooksAuthors`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `BooksAuthors` ;

CREATE TABLE IF NOT EXISTS `BooksAuthors` (
  `isbn13AuthorId` INT NOT NULL AUTO_INCREMENT,
  `isbn13` VARCHAR(17) NOT NULL,
  `authorId` INT NOT NULL,
  PRIMARY KEY (`isbn13AuthorId`),
  FOREIGN KEY (`authorId`)
    REFERENCES `Authors` (`authorId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`isbn13`)
    REFERENCES `Books` (`isbn13`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- Insert example data for each entity
INSERT INTO `Authors` (`authorFirstName`, `authorLastName`) VALUES
('J. R. R.', 'Tolkien'),
('Ocean', 'Vuong'),
('Isabel', 'Allende'),
('Emily', 'Zhu'),
('Jory', 'John'),
('Pete', 'Oswald');

INSERT INTO `Genres` (`genreName`) VALUES
('Autobiographical novel'),
('Fantasy'),
('Literary Fiction'),
('Children\'s Picture Book'),
('Action');

INSERT INTO `Publishers` (`publisherName`) VALUES
('Alfred A. Knopf'),
('George Allen & Unwin'),
('Penguin Press'),
('HarperCollins');

INSERT INTO `Books` (`isbn13`, `title`, `price`, `publisherId`, `quantity`) VALUES
('9780048230706', 'The Hobbit, or There and Back Again', '10.99', 2, 0),
('9780048231123', 'The Fellowship of the Ring', '15.99', 2, 24),
('9780062954527', 'The Cool Bean', '6.99', 4, 22),
('9780525562023', 'On Earth We\'re Briefly Gorgeous', '18.99', 3, 40),
('9780552774956', 'The House of Spirits', '12.99', 1, 36),
('1779513224', 'Batman: No Man\'s Land Omnibus Vol. 1', '72.99', NULL, 4);

INSERT INTO `BooksAuthors` (`authorId`, `isbn13`) VALUES
(1, '9780048230706'),
(1, '9780048231123'),
(5, '9780062954527'),
(6, '9780062954527');

INSERT INTO `BooksGenres` (`isbn13`, `genreId`) VALUES
('9780048231123', 2),
('9780048231123', 5),
('9780552774956', 2);

INSERT INTO `Employees` (`employeeFirstName`, `employeeLastName`, `employeePhone`, `hireDate`, `isActive`) VALUES
('Kim', 'Madden', '6431889971', '2021-09-01', 1),
('Malik', 'Andrade', '3577894422', '2022-05-01', 1),
('Arya', 'Schmitt', '3877721101', '2019-11-18', 0);

INSERT INTO `Sales` (`saleDate`, `totalSaleAmount`, `employeeId`) VALUES
('2022-09-20', '31.98', 2),
('2022-07-07', '47.97', 2),
('2019-12-06', '37.98', 3);

INSERT INTO `BooksSales` (`isbn13`, `saleId`, `quantity`, `lineTotal`) VALUES
('9780048231123', 2, 1, '15.99'),
('9780525562023', 1, 1, '18.99'),
('9780525562023', 2, 1, '18.99'),
('9780525562023', 3, 2, '37.98'),
('9780552774956', 2, 1, '12.99');

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
