const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 1700;

app.use(express.json()); 

let users = [];
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

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users', (req, res) => {
  res.json(users);
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  res.status(200).json({ message: 'Login successful' });
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
    console.log(`Server is running on http://localhost:${PORT}`);
});
