SELECT Books.isbn13 AS ISBN13, Books.title AS Title, IFNULL(GROUP_CONCAT(DISTINCT CONCAT(Authors.authorFirstName, ' ', Authors.authorLastName) SEPARATOR ", "), "N/A") AS Author, IFNULL(GROUP_CONCAT(Genres.genreName SEPARATOR ", "), "N/A") AS "Genre(s)", Books.price AS Price, Publishers.publisherName AS Publisher, Books.quantity AS QTY 
FROM Books
LEFT JOIN Publishers ON Books.publisherId = Publishers.publisherId
LEFT JOIN BooksAuthors ON Books.isbn13 = BooksAuthors.isbn13
LEFT JOIN BooksGenres ON Books.isbn13 = BooksGenres.isbn13
LEFT JOIN Authors ON BooksAuthors.authorId = Authors.authorId
LEFT JOIN Genres ON BooksGenres.genreId = Genres.genreId
GROUP BY Books.isbn13
ORDER BY Authors.authorLastName;