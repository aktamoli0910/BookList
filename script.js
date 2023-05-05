// Book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        console.log(list);
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete'))
        el.parentElement.parentElement.remove();
    }

    static showAlerts(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));


        // To put the alert before the form
        const container =  document.querySelector('.container');
        const form =  document.querySelector('#book-form');
        container.insertBefore(div, form);


        // To remove the Alert after 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//Store Class
class Store {
    // Local storage cannot store object, it only stores strings, so we need to json.stringify everything before storing and JSON.parse before using
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));

    }
}


//Display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Add a book
document.querySelector('#book-form').addEventListener('submit', (e)=> {

    e.preventDefault();

    title = document.querySelector('#title').value;
    author = document.querySelector('#author').value;
    isbn = document.querySelector('#isbn').value;

    if(title === '' || author === '' || isbn === '')
    UI.showAlerts("PLEASE FILL ALL FIELDS", "danger");

    else{
        const book = new Book(title, author, isbn);
        UI.addBookToList(book);
        Store.addBook(book);
        UI.showAlerts("BOOK ADDED SUCCESSFULLY", "success");
        UI.clearFields(book);
    }
    
});

//Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Target gives ion which currently the event is working. if we put event on delete button it will just work for 1st delete button
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlerts("BOOK REMOVED SUCCESSFULLY", "success");
});