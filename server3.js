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

app.put('/books/:isbn/review', (req, res) => {
  const { isbn } = req.params;
  const { username, review } = req.body;

  if (!username || !review) {
    return res.status(400).json({ message: 'Username and review are required.' });
  }

  const book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  const existingReview = book.reviews.find(r => r.username === username);
  if (existingReview) {
    existingReview.review = review;
    res.json({ message: 'Review updated successfully.' });
  } else {
    book.reviews.push({ username, review });
    res.json({ message: 'Review added successfully.' });
  }
});

app.delete('/books/:isbn/review', (req, res) => {
  const { isbn } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Only registered users can delete reviews.' });
  }

  const book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  const reviewIndex = book.reviews.findIndex(r => r.username === username);
  if (reviewIndex === -1) {
    return res.status(404).json({ message: 'No review found for this user on the book.' });
  }

  book.reviews.splice(reviewIndex, 1);
  return res.status(200).json({ message: 'Review deleted successfully.', reviews: book.reviews });
});



function getAllBooks(callback) {
  setTimeout(() => {
    callback(null, books);
  }, 500);
}

app.get('/books-async', (req, res) => {
  getAllBooks((err, allBooks) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch books.' });
    }
    res.json(allBooks);
  });
});

app.get('/books/searchisbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  new Promise((resolve, reject) => {
    const book = books.find(b => b.isbn === isbn);
    if (book) {
      resolve(book);
    } else {
      reject('Book not found.');
    }
  })
    .then(book => res.json(book))
    .catch(err => res.status(404).json({ message: err }));
});

app.get('/books/searchauthor/:author', (req, res) => {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const filtered = books.filter(b => b.author === author);
    if (filtered.length > 0) {
      resolve(filtered);
    } else {
      reject('No books found by this author.');
    }
  })
    .then(books => res.json(books))
    .catch(err => res.status(404).json({ message: err }));
});

app.get('/books/searchtitle/:title', (req, res) => {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const book = books.find(b => b.title === title);
    if (book) {
      resolve(book);
    } else {
      reject('Book not found by this title.');
    }
  })
    .then(book => res.json(book))
    .catch(err => res.status(404).json({ message: err }));
});






app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
