// Task 40.1 - Initial variable to be used for the creation of a session storage and to be used for all necessary functions. 
let books = [];

// When the html is first loaded it checks to see if there is a session storage available and sets them up for use.
function myLoad() {

    // If there isn't a storage session of this name it means that this is the first time that it has been run.
    // It will then proceed to set the session storage items and hide the table as no information will be present yet
    // by setting the style visibility to hidden..
    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
        sessionStorage.setItem("bookCollection", JSON.stringify(books));

        // Creates a storage session to show that this is not the first time it has been run.
        sessionStorage.setItem("hasCodeRunBefore", true);
        document.getElementById("table").style.display = "none";
    }

    // If the indicated session storage is present the books variable is restored by retrieving the session storage assigned to it.
    // Once set it only needs to be set again to store the information that has been added/removed from the array. 
    else {
        books = JSON.parse(sessionStorage.getItem("bookCollection"));

        // Used to hide the table headers when there is no information to be displayed and show it when there is.
        if (books.length > 0) {
            document.getElementById("table").style.visibility = "visible";
        }
        else {
            document.getElementById("table").style.visibility = "hidden";
        }
        
        // Goes through the restored books array and creates table information from each object.
        for (let i = 0; i < books.length; i++) {
            createEntry(i);
        };
    }
}

// Creates the book objects taking information from each of the fields on the index page.
class Book {

    constructor(title, author, publisher, year, genre, review) {

        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.year = year;
        this.genre = genre;
        this.review = review;

    }
}

// Once the create new entry button has been pressed the text values are retrieved from the fields/options and added to the table. 
function addBook() {

    // The text values are retrieved and a book object is created.
    let newBook = new Book(
        document.getElementById("bookTitle").value,
        document.getElementById("author").value,
        document.getElementById("publisher").value,
        document.getElementById("pubDate").value,

        // As this form is an option the correct texis taken from the selected option instead.
        document.getElementById("genre").selectedOptions[0].text,
        document.getElementById("reviews").value
    );

    // The book object is inserted into the books array.
    books.push(newBook);

    // The session storage is set to the array again to save the altered array.
    sessionStorage.setItem(`bookCollection`, JSON.stringify(books));
}

// The function that creates the table row on the table using the iteration from the onLoad function to 
// get each object in succession.
function createEntry(key) {

    // This array contains the object key names that will be used to identify the correct value.
    let coloumnName = ["title", "author", "publisher", "year", "genre", "review"];

    // Using the elements Id this variables contains the location of where the rows will be created. 
    let entries = document.getElementById("entries");

    // Creates a new row element.
    let newEntry = document.createElement('tr');

    // Adds classes that apply styles to the row.
    newEntry.classList.add("text-center", "align-middle");

    // Attaches the row to the entries element.
    entries.appendChild(newEntry);

    // Used as an index to retrieve the correct object key name.
    let counter = 0;

    // Retrieves the specified object and for each value creates a cell for a column. This is then given
    // a name attribute, the text value, an event listener and added to the row created above.
    // The counter is increased after each cell is created to give each cell the correct name.
    Object.values(books[key]).forEach(text => {
        let newColumn = document.createElement('td');
        newColumn.name = coloumnName[counter];
        newColumn.innerHTML = text;
        newColumn.onclick = getEntry;
        newEntry.appendChild(newColumn);
        counter++;
    });
    
    // A button is created for the end of the row.
    let buttonColumn = document.createElement('td');
    newEntry.appendChild(buttonColumn);

    // The button is given text to indicate it's function and a value that corresponds 
    // to its index within the array. It is also given an event listener and added to the final row/column.
    let btn = document.createElement("button");
    btn.innerHTML = "Delete";
    btn.value = key;
    btn.onclick = deleteEntry;
    buttonColumn.appendChild(btn);
}

// When a cell/entry is clicked its position within the array is saved and text sent to a textarea element to be edited. 
function getEntry (event) {

    // Information from the event is retrieved, using the cell name and the button value to be used to identify the 
    // correct object and the key to the text. The index path goes from the cell clicked, to the row element,
    // to the last cell on the row and finally the button value located within the cell.
    let valueLocation = {key: event.target.name, index: event.target.parentElement.lastElementChild.lastElementChild.value};

    // The location to the value is then saved in a session storage to be used when the user has altered the text.
    sessionStorage.setItem("selectedColumn", JSON.stringify(valueLocation));

    // Due to using an offscreen bootstrap element it needs to be called by clicking on the element.
    document.getElementById("editItem").click();

    // The textarea is then located and the value of the cell is inserted into the field.
    let editor = document.getElementById("editor");
    editor.value = event.target.textContent;
}

// Once the value has been altered, the new value is retrieved and altered in the array.
function editEntry() {

    // The session storage containing the location of the value to be altered is retrieved.
    // Each time the session is retrieved it must be converted back to an object using the 
    // JSON.parse function in order to use it.
    let arrayLocation = JSON.parse(sessionStorage.getItem("selectedColumn"));

    // The new value is retrieved.
    let newValue = document.getElementById("editor").value;
   
    // As long as the value is not an empty string the object value is altered in the array and 
    // the session storage is set to the altered array. If it is an empty string the value is unaltered.
    if (newValue !== "") {
        books[arrayLocation["index"]][arrayLocation["key"]] = newValue;
        sessionStorage.setItem(`bookCollection`, JSON.stringify(books));
    }
}

// When the delete function is pressed the button value is used to delete the object from the array.
function deleteEntry (event) {

    // Using splice and the index key from the buttons value the object in the array is deleted.
    books.splice(event.target.value, 1);

    // The altered session storage is then set saving the altered array.
    sessionStorage.setItem(`bookCollection`, JSON.stringify(books));

    // The path goes to the buttons parent which is the cell td to the row parent which is tr. 
    // The row is then deleted from the HTML page using the remove function. 
    event.target.parentElement.parentElement.remove();

    // An error was noticed that depending on how the rows are deleted it sometimes removes all rows but leaves
    // an object in the array stopping the table from being hidden and returning the last object when the screen
    // is refreshed. This is presumably down to using the button value as an index and no longer corresponding
    // correctly when items have been deleted. To solve this the screen is reloaded using the following function
    // to recreate the table after a row has been deleted and ensuring that the button values match the array.  
    document.location.reload();
}

// Used the masteringjs website to get information on how to iterate through objects: 
// https://masteringjs.io/tutorials/fundamentals/foreach-object
// Used the stackoverflow website to get information on how to retrieve the text from a option box and how to add multiple classes:
// https://stackoverflow.com/questions/610336/retrieving-the-text-of-the-selected-option-in-select-element
// https://stackoverflow.com/questions/1988514/javascript-css-how-to-add-and-remove-multiple-css-classes-to-an-element
// Used dev.to and javascripttutorial.net to get further information on session storage:
// https://dev.to/arikaturika/javascript-session-storage-beginner-s-guide-1i5e
// https://www.javascripttutorial.net/web-apis/javascript-sessionstorage/
// Used the freecodecamp.org to get information on how to refresh the page using javascript:
// https://www.freecodecamp.org/news/refresh-the-page-in-javascript-js-reload-window-tutorial/