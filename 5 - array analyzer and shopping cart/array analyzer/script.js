

const books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 399,
        quantity: 2
    },

    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 499,
        quantity: 1
    },

    {
        id: 3,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        price: 450,
        quantity: 2
    },

    {
        id: 4,
        title: "Ikigai",
        author: "Hector Garcia",
        price: 299,
        quantity: 1
    }
];




const bookForm = document.getElementById("bookForm");

const bookList = document.getElementById("bookList");

const bookCount = document.getElementById("bookCount");

const subtotalElement =
    document.getElementById("subtotal");

const discountElement =
    document.getElementById("discount");

const discountLabel =
    document.getElementById("discountLabel");

const finalTotalElement =
    document.getElementById("finalTotal");

const discountMessage =
    document.getElementById("discountMessage");

const priceFilter =
    document.getElementById("priceFilter");



function displayBooks() {

    bookList.innerHTML = "";



    let booksToDisplay = books;

    if (priceFilter.checked) {

        booksToDisplay = books.filter(function(book) {

            return book.price > 400;

        });
    }


    booksToDisplay.forEach(function(book) {


        let subtotal =
            book.price * book.quantity;


        let originalIndex =
            books.findIndex(function(item) {

                return item.id === book.id;

            });


        bookList.innerHTML += `

            <div class="book-item">

                <div>

                    <div class="book-title">
                        ${book.title}
                    </div>

                    <div class="book-author">
                        by ${book.author}
                    </div>

                    <div class="book-each">
                        ₹${book.price} each
                    </div>

                </div>


                <div class="quantity-control">

                    <button
                        onclick="changeQuantity(${originalIndex}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${book.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${originalIndex}, 1)"
                    >
                        +
                    </button>

                </div>


                <div class="book-total">
                    ₹${subtotal.toFixed(2)}
                </div>


                <button
                    class="remove-btn"
                    onclick="removeBook(${originalIndex})"
                    title="Remove book"
                >
                    ×
                </button>

            </div>

        `;

    });


    bookCount.textContent =
        `${books.length} ${books.length === 1 ? "book" : "books"}`;


   

    if (booksToDisplay.length === 0) {

        bookList.innerHTML = `
            <div class="empty">
                No books above ₹400 found.
            </div>
        `;
    }
}



function getSubtotals() {

    const subtotals = books.map(function(book) {

        return book.price * book.quantity;

    });

    return subtotals;
}



function calculateSubtotal() {

    const subtotal = books.reduce(function(total, book) {

        return total +
            (book.price * book.quantity);

    }, 0);

    return subtotal;
}




function updateSummary() {

    const subtotal =
        calculateSubtotal();




    let discountRate = 0;


    if (subtotal >= 3000) {

        discountRate = 0.20;

    }

    else if (subtotal >= 2000) {

        discountRate = 0.15;

    }

    else if (subtotal >= 1000) {

        discountRate = 0.10;

    }


    const discount =
        subtotal * discountRate;


    const finalTotal =
        subtotal - discount;



    subtotalElement.textContent =
        `₹${subtotal.toFixed(2)}`;

    discountElement.textContent =
        `-₹${discount.toFixed(2)}`;

    discountLabel.textContent =
        `Discount (${discountRate * 100}%)`;

    finalTotalElement.textContent =
        `₹${finalTotal.toFixed(2)}`;


    if (subtotal === 0) {

        discountMessage.textContent =
            "Add books to start building your cart.";

    }

    else if (discountRate === 0) {

        discountMessage.textContent =
            `Add ₹${(1000 - subtotal).toFixed(2)}
             more to unlock 10% discount.`;

    }

    else if (discountRate === 0.10) {

        discountMessage.textContent =
            "10% discount applied. Spend ₹2000+ to unlock 15%.";

    }

    else if (discountRate === 0.15) {

        discountMessage.textContent =
            "15% discount applied. Spend ₹3000+ to unlock 20%.";

    }

    else {

        discountMessage.textContent =
            "20% maximum discount unlocked!";

    }
}



priceFilter.addEventListener(
    "change",
    displayBooks
);




document.getElementById("findBtn")
    .addEventListener("click", function() {

        const id =
            parseInt(
                document.getElementById("findId").value
            );



        const foundBook =
            books.find(function(book) {

                return book.id === id;

            });


        const result =
            document.getElementById("findResult");


        if (foundBook) {

            result.innerHTML = `

                <strong>
                    #${foundBook.id} —
                    "${foundBook.title}"
                </strong>

                by ${foundBook.author}

                <br>

                ₹${foundBook.price}
                × ${foundBook.quantity}
                = ₹${(
                    foundBook.price *
                    foundBook.quantity
                ).toFixed(2)}

            `;

        }

        else {

            result.textContent =
                "No book found with this ID.";

        }

    });


bookForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            document.getElementById("title")
                .value.trim();

        const author =
            document.getElementById("author")
                .value.trim();

        const price =
            parseFloat(
                document.getElementById("price").value
            );

        const quantity =
            parseInt(
                document.getElementById("quantity").value
            );


        if (
            title === "" ||
            author === "" ||
            isNaN(price) ||
            isNaN(quantity) ||
            price <= 0 ||
            quantity <= 0
        ) {

            alert("Please enter valid book details.");

            return;
        }



        const newBook = {

            id: getNextId(),

            title: title,

            author: author,

            price: price,

            quantity: quantity

        };




        books.push(newBook);




        refreshUI();


        bookForm.reset();

        document.getElementById("quantity").value = 1;

    }
);



function getNextId() {

    if (books.length === 0) {
        return 1;
    }

    return Math.max(
        ...books.map(function(book) {

            return book.id;

        })
    ) + 1;
}



function removeBook(index) {

    if (
        confirm("Are you sure you want to remove this book?")
    ) {



        books.splice(index, 1);


        refreshUI();
    }
}



function changeQuantity(index, change) {



    books[index].quantity += change;




    if (books[index].quantity < 1) {

        books[index].quantity = 1;
    }


    refreshUI();
}



function updatePriceAnalysis() {

    if (books.length === 0) {

        document.getElementById("maxBook")
            .textContent = "No books";

        document.getElementById("maxPrice")
            .textContent = "₹0";

        document.getElementById("minBook")
            .textContent = "No books";

        document.getElementById("minPrice")
            .textContent = "₹0";

        return;
    }



    let maxBook = books[0];

    let minBook = books[0];




    for (let i = 1; i < books.length; i++) {

        if (books[i].price > maxBook.price) {

            maxBook = books[i];
        }


        if (books[i].price < minBook.price) {

            minBook = books[i];
        }

    }


    document.getElementById("maxBook")
        .textContent = maxBook.title;

    document.getElementById("maxPrice")
        .textContent = `₹${maxBook.price}`;



    document.getElementById("minBook")
        .textContent = minBook.title;

    document.getElementById("minPrice")
        .textContent = `₹${minBook.price}`;
}



document.getElementById("analyzeBtn")
    .addEventListener("click", function() {

        const input =
            document.getElementById("arrayInput")
                .value.trim();


        if (input === "") {

            alert("Please enter numbers.");

            return;
        }



        const numbers =
            input.split(",").map(function(value) {

                return Number(value.trim());

            });



        if (
            numbers.some(function(number) {

                return isNaN(number);

            })
        ) {

            alert(
                "Please enter only valid numbers separated by commas."
            );

            return;
        }



        const maximum =
            Math.max(...numbers);

        const minimum =
            Math.min(...numbers);


        document.getElementById("arrayOutput")
            .textContent = numbers.join(", ");

        document.getElementById("maximumValue")
            .textContent = maximum;

        document.getElementById("minimumValue")
            .textContent = minimum;

    });



function refreshUI() {

    displayBooks();

    updateSummary();

    updatePriceAnalysis();

}



refreshUI();