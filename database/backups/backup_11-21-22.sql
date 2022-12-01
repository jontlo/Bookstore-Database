-- MariaDB dump 10.19  Distrib 10.4.25-MariaDB, for Linux (x86_64)
--
-- Host: classmysql.engr.oregonstate.edu    Database: cs340_jonessa3
-- ------------------------------------------------------
-- Server version	10.6.10-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Authors`
--

DROP TABLE IF EXISTS `Authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Authors` (
  `authorId` int(11) NOT NULL AUTO_INCREMENT,
  `authorFirstName` varchar(50) NOT NULL,
  `authorLastName` varchar(50) NOT NULL,
  PRIMARY KEY (`authorId`),
  UNIQUE KEY `authorIdUnique` (`authorId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Authors`
--

LOCK TABLES `Authors` WRITE;
/*!40000 ALTER TABLE `Authors` DISABLE KEYS */;
INSERT INTO `Authors` VALUES (1,'J. R. R.','Tolkien'),(2,'Ocean','Vuong'),(3,'Isabel','Allende'),(4,'Emily','Zhu'),(5,'Jory','John'),(6,'Pete','Oswald'),(7,'Brandon','Sanderson');
/*!40000 ALTER TABLE `Authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Books`
--

DROP TABLE IF EXISTS `Books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Books` (
  `isbn13` varchar(17) NOT NULL,
  `title` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `publisherId` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`isbn13`),
  UNIQUE KEY `isbnUnique` (`isbn13`),
  KEY `publisherId` (`publisherId`),
  CONSTRAINT `Books_ibfk_1` FOREIGN KEY (`publisherId`) REFERENCES `Publishers` (`publisherId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Books`
--

LOCK TABLES `Books` WRITE;
/*!40000 ALTER TABLE `Books` DISABLE KEYS */;
INSERT INTO `Books` VALUES ('1','test',0.02,2,2),('1779513224','Batman: No Man\'s Land Omnibus Vol. 1',72.99,NULL,4),('9780048230706','The Hobbit, or There and Back Again',10.99,2,0),('9780048231123','The Fellowship of the Ring',15.99,2,24),('9780062954527','The Cool Bean',6.99,4,22),('9780525562023','On Earth We\'re Briefly Gorgeous',18.99,3,40),('9780552774111','test',1.99,4,44),('9780552774956','The House of Spirits',12.99,1,36);
/*!40000 ALTER TABLE `Books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BooksAuthors`
--

DROP TABLE IF EXISTS `BooksAuthors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BooksAuthors` (
  `isbn13AuthorId` int(11) NOT NULL AUTO_INCREMENT,
  `isbn13` varchar(17) NOT NULL,
  `authorId` int(11) NOT NULL,
  PRIMARY KEY (`isbn13AuthorId`),
  KEY `authorId` (`authorId`),
  KEY `isbn13` (`isbn13`),
  CONSTRAINT `BooksAuthors_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `Authors` (`authorId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BooksAuthors_ibfk_2` FOREIGN KEY (`isbn13`) REFERENCES `Books` (`isbn13`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BooksAuthors`
--

LOCK TABLES `BooksAuthors` WRITE;
/*!40000 ALTER TABLE `BooksAuthors` DISABLE KEYS */;
INSERT INTO `BooksAuthors` VALUES (1,'9780048230706',1),(2,'9780048231123',1),(3,'9780062954527',5),(4,'9780062954527',6);
/*!40000 ALTER TABLE `BooksAuthors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BooksGenres`
--

DROP TABLE IF EXISTS `BooksGenres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BooksGenres` (
  `isnb13GenreId` int(11) NOT NULL AUTO_INCREMENT,
  `isbn13` varchar(17) NOT NULL,
  `genreId` int(11) NOT NULL,
  PRIMARY KEY (`isnb13GenreId`),
  KEY `isbn13` (`isbn13`),
  KEY `genreId` (`genreId`),
  CONSTRAINT `BooksGenres_ibfk_1` FOREIGN KEY (`isbn13`) REFERENCES `Books` (`isbn13`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BooksGenres_ibfk_2` FOREIGN KEY (`genreId`) REFERENCES `Genres` (`genreId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BooksGenres`
--

LOCK TABLES `BooksGenres` WRITE;
/*!40000 ALTER TABLE `BooksGenres` DISABLE KEYS */;
INSERT INTO `BooksGenres` VALUES (1,'9780048231123',2),(3,'9780552774956',2);
/*!40000 ALTER TABLE `BooksGenres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BooksSales`
--

DROP TABLE IF EXISTS `BooksSales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BooksSales` (
  `isbn13SaleId` int(11) NOT NULL AUTO_INCREMENT,
  `isbn13` varchar(17) NOT NULL,
  `saleId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `lineTotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`isbn13SaleId`),
  KEY `isbn13` (`isbn13`),
  KEY `saleId` (`saleId`),
  CONSTRAINT `BooksSales_ibfk_1` FOREIGN KEY (`isbn13`) REFERENCES `Books` (`isbn13`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `BooksSales_ibfk_2` FOREIGN KEY (`saleId`) REFERENCES `Sales` (`saleId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BooksSales`
--

LOCK TABLES `BooksSales` WRITE;
/*!40000 ALTER TABLE `BooksSales` DISABLE KEYS */;
INSERT INTO `BooksSales` VALUES (1,'9780048231123',2,1,15.99),(2,'9780525562023',1,1,18.99),(3,'9780525562023',2,1,18.99),(4,'9780525562023',3,2,37.98),(5,'9780552774956',2,1,12.99);
/*!40000 ALTER TABLE `BooksSales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employees`
--

DROP TABLE IF EXISTS `Employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Employees` (
  `employeeId` int(11) NOT NULL AUTO_INCREMENT,
  `employeeFirstName` varchar(50) NOT NULL,
  `employeeLastName` varchar(50) NOT NULL,
  `employeePhone` varchar(15) NOT NULL,
  `hireDate` date NOT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`employeeId`),
  UNIQUE KEY `employeeIdUnique` (`employeeId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employees`
--

LOCK TABLES `Employees` WRITE;
/*!40000 ALTER TABLE `Employees` DISABLE KEYS */;
INSERT INTO `Employees` VALUES (1,'Kim','Madden','6431889971','2021-09-01',1),(2,'Malik','Andrade','-6','2022-05-01',1),(3,'Arya','Schmitt','3877721101','2019-11-18',0);
/*!40000 ALTER TABLE `Employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Genres`
--

DROP TABLE IF EXISTS `Genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Genres` (
  `genreId` int(11) NOT NULL AUTO_INCREMENT,
  `genreName` varchar(100) NOT NULL,
  PRIMARY KEY (`genreId`),
  UNIQUE KEY `genreIdUnique` (`genreId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Genres`
--

LOCK TABLES `Genres` WRITE;
/*!40000 ALTER TABLE `Genres` DISABLE KEYS */;
INSERT INTO `Genres` VALUES (1,'Autobiographical novel'),(2,'Fantasy'),(3,'Literary Fiction'),(4,'Children\'s Picture Book'),(6,'Action'),(9,'Sci-Fi');
/*!40000 ALTER TABLE `Genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Publishers`
--

DROP TABLE IF EXISTS `Publishers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Publishers` (
  `publisherId` int(11) NOT NULL AUTO_INCREMENT,
  `publisherName` varchar(100) NOT NULL,
  PRIMARY KEY (`publisherId`),
  UNIQUE KEY `publisherIdUnique` (`publisherId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Publishers`
--

LOCK TABLES `Publishers` WRITE;
/*!40000 ALTER TABLE `Publishers` DISABLE KEYS */;
INSERT INTO `Publishers` VALUES (1,'Alfred A. Knopf'),(2,'George Allen & Unwin'),(3,'Penguin Press'),(4,'HarperCollins'),(5,'Hachette Book Group'),(6,'uuu');
/*!40000 ALTER TABLE `Publishers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sales`
--

DROP TABLE IF EXISTS `Sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Sales` (
  `saleId` int(11) NOT NULL AUTO_INCREMENT,
  `saleDate` date NOT NULL,
  `totalSaleAmount` decimal(10,2) NOT NULL,
  `employeeId` int(11) NOT NULL,
  PRIMARY KEY (`saleId`),
  UNIQUE KEY `saleIdUnique` (`saleId`),
  KEY `employeeId` (`employeeId`),
  CONSTRAINT `Sales_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `Employees` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sales`
--

LOCK TABLES `Sales` WRITE;
/*!40000 ALTER TABLE `Sales` DISABLE KEYS */;
INSERT INTO `Sales` VALUES (1,'2022-09-20',31.98,2),(2,'2022-07-07',47.97,2),(3,'2019-12-06',37.98,3),(4,'2022-11-16',15.00,1);
/*!40000 ALTER TABLE `Sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostic`
--

DROP TABLE IF EXISTS `diagnostic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diagnostic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostic`
--

LOCK TABLES `diagnostic` WRITE;
/*!40000 ALTER TABLE `diagnostic` DISABLE KEYS */;
INSERT INTO `diagnostic` VALUES (1,'MySQL is working!');
/*!40000 ALTER TABLE `diagnostic` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-21 17:50:19
