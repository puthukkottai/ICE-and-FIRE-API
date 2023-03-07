const apiUrl = 'https://www.anapioficeandfire.com/api/books?pageSize=50';

// Fetch the book data from the API and display it on the page
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const books = data.map(book => {
      return {
        name: book.name,
        authors: book.authors,
        numberOfPages: book.numberOfPages,
        isbn: book.isbn,
        publisher: book.publisher,
        released: book.released,
        characters: book.characters.slice(0, 5).map(url => {
          return fetch(url)
            .then(response => response.json())
            .catch(error => console.error(error));
        })
      };
    });

    // Wait for all character data to be fetched before displaying the books
    Promise.all(books.flatMap(book => book.characters))
      .then(characters => {
        books.forEach((book, index) => {
          book.characters = characters.slice(index * 5, index * 5 + 5);
        });

        displayBooks(books);

        const searchBox = document.getElementById('search-box');
        searchBox.addEventListener('input', () => {
          const searchTerm = searchBox.value.toLowerCase();
          const filteredBooks = books.filter(book => book.name.toLowerCase().includes(searchTerm));
          displayBooks(filteredBooks);
        });
      })
      .catch(error => console.error(error));
  })
  .catch(error => console.error(error));

// Display the books on the page
function displayBooks(books) {
  // Clear the previous book cards
  const container = document.getElementById('book-cards');
  container.innerHTML = '';

  // Loop through each book and create a card for it
  books.forEach(book => {
    // Extract the relevant details from the book object
    const name = book.name;
    const author = book.authors.join(', ');
    const pages = book.numberOfPages;
    const isbn = book.isbn;
    const published = book.publisher;
    const released = book.released;

    // Create a card element for the book
    const card = document.createElement('div');
    card.classList.add('book-card');
    card.innerHTML = `
      <h2>${name}</h2>
      <p><strong>Author:</strong> ${author}</p>
      <p><strong>Number of pages:</strong> ${pages}</p>
      <p><strong>ISBN:</strong> ${isbn}</p>
      <p><strong>Published by:</strong> ${published}</p>
      <p><strong>Release date:</strong> ${released}</p>
      <ul class="character-list">
        ${book.characters.map(character => `<li>${character.name}</li>`).join('')}
      </ul>
    `;

    container.appendChild(card);
  });
}
