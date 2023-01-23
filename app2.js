// Event Listeners
document.getElementById("book-form").addEventListener("submit", function (e) {
  const ui = new UI();

  if (
    ui.title.value === "" ||
    ui.author.value === "" ||
    ui.isbn.value === "" ||
    isNaN(Number(ui.isbn.value))
  ) {
    ui.showAlert("Please fill out all inputs with valid infromation", "error");
    e.preventDefault();
    return;
  }

  ui.addBookToList();
  ui.clearInputValues();
  ui.showAlert("Your book has been successfully added.", "success");
  e.preventDefault();
});

document.addEventListener("DOMContentLoaded", function (e) {
  const sessionManager = new SessionManager();

  sessionManager.loadBooks();
});

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  constructor() {
    this.title = document.getElementById("title");
    this.author = document.getElementById("author");
    this.isbn = document.getElementById("isbn");
    this.bookList = document.getElementById("book-list");
    this.container = document.querySelector(".container");
    this.bookForm = document.getElementById("book-form");
  }

  addBookToList(savedBook = null) {
    const book = Boolean(savedBook)
      ? savedBook
      : new Book(this.title.value, this.author.value, this.isbn.value);

    const newBookEntry = document.createElement("tr");
    newBookEntry.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
        `;

    const removeButtonEntry = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.id = "remove-book";
    removeButton.className = "btn";
    removeButton.innerText = "Remove";

    removeButton.addEventListener("click", function (e) {
      const ui = new UI();
      ui.removeBookFromList(e.target);
      ui.showAlert("Your book has been succesfully removed.", "success");
    });

    removeButtonEntry.appendChild(removeButton);
    newBookEntry.appendChild(removeButtonEntry);

    this.bookList.appendChild(newBookEntry);

    if (!Boolean(savedBook)) {
      const sessionManager = new SessionManager();

      sessionManager.addBook(book);
    }
  }

  removeBookFromList(target) {
    if (target.id === "remove-book") {
      target.parentElement.parentElement.remove();

      const sessionManager = new SessionManager();

      sessionManager.removeBook(
        target.parentElement.previousElementSibling.innerText
      );
    }
  }

  clearInputValues() {
    this.title.value = "";
    this.author.value = "";
    this.isbn.value = "";
  }

  showAlert(message, className) {
    const alert = document.createElement("div");
    alert.className = `alert ${className}`;
    alert.textContent = message;

    this.container.insertBefore(alert, this.bookForm);

    setTimeout(function () {
      const ui = new UI();
      ui.container.removeChild(alert);
    }, 2500);
  }
}

class SessionManager {
  constructor() {
    this.books = Boolean(localStorage.getItem("books"))
      ? JSON.parse(localStorage.getItem("books"))
      : [];
  }

  addBook(book) {
    this.books.push(book);

    localStorage.setItem("books", JSON.stringify(this.books));
  }

  removeBook(isbn) {
    const book = this.books.find(function (book) {
      return book.isbn === isbn;
    });

    if (Boolean(book)) {
      this.books.splice(this.books.indexOf(book), 1);
      localStorage.setItem("books", JSON.stringify(this.books));
    }
  }

  loadBooks() {
    this.books.forEach(function (book) {
      const ui = new UI();

      ui.addBookToList(book);
    });
  }
}
