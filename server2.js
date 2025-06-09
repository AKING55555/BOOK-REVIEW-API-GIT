const express = require('express');
const bcrypt =require ('bcryptjs');
const userRoutes = require('./server');
const app = express();
const PORT = 1509;


app.use(express.json());
app.use('/users', userRoutes);





let books = [
  { isbn: "123456", title: "Alice in BorderLand", author: "Alice", reviews: [] },
  { isbn: "789012", title: "Game of Thrones", author: "Bob", reviews: [] },
  { isbn: "789312", title: "Breaking Bad", author: "Henry", reviews: [] },
  { isbn: "889012", title: "The SUPRANOS", author: "Bob", reviews: [] },
  { isbn: "679012", title: "Mirzapur", author: "Sandeep", reviews: [] },
  { isbn: "129012", title: "The Succession", author: "Nolan", reviews: [] },
  { isbn: "563612", title: "DARK", author: "james", reviews: [] },
  { isbn: "099012", title: "SQUID GAME", author: "bruce", reviews: [] },
  { isbn: "789812", title: "Money Heist", author: "Henry", reviews: [] }
];


app.get('/books', ( req, res) => {
  res.json(books);
});


app.get('/books/isbn/:isbn', ( req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "BOOK IS NOT PRESENT AT THE MOMENT" });
    }
  } catch (err) {
    console.error("Error in ISBN route:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/books/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const tbook = books.find(b => b.title.toLowerCase() === title);
  if (tbook) {
    res.json(tbook);
  } else {
    res.status(404).json({ message: "BOOK IS NOT PRESENT AT THE MOMENT" });
  }
});



app.get('/books/author/:author', (req, res) => {
  const author = req.params.author.trim().toLowerCase();
  const authorbook = books.filter(b => b.author.toLowerCase() === author.toLowerCase());

  if (authorbook.length > 0) {
    res.json(authorbook);
  } else {
    res.status(404).json({ message: "BOOK IS NOT PRESENT AT THE MOMENT" });
  }
});


app.get('/books/:isbn/reviews', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);

  if (book) {
    res.json({
      isbn: book.isbn,
      title: book.title,
      reviews: book.reviews
    });
  } else {
    res.status(404).json({ message: "BOOK IS NOT PRESENT AT THE MOMENT" });
  }
});





app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
