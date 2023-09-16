class Note {
    constructor(id) {
        this.id = id;
        this.element = this.createElement();
        this.attachEvents();
    }

    createElement() {
        var componentContainer = document.createElement("div");
        var newTextbox = document.createElement("input");
        newTextbox.type = "text";
        newTextbox.className = "note-input";
        newTextbox.placeholder = "Type your note here...";
        newTextbox.id = this.id;
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => {
            this.remove();
        };
        componentContainer.appendChild(newTextbox);
        componentContainer.appendChild(removeButton);
        return componentContainer;
    }

    attachEvents() {
        this.element.querySelector('button').addEventListener('click', () => {
            this.remove();
        });
    }

    remove() {
        var container = document.querySelector(".grid-container");
        var index = notes.findIndex(item => item.id === this.id);
        notes.splice(index, 1);
        container.removeChild(this.element);

        // Remove from local storage
        localStorage.removeItem(this.id);
    }
    getElement() {
        return this.element;
    }
}

class NoteManager {
    constructor() {
        this.noteIndex = parseInt(localStorage.getItem('note_index')) || 0;
    }

    add() {
        var container = document.querySelector(".grid-container");
        var note = new Note("index" + this.noteIndex);
        this.noteIndex += 1;
        localStorage.setItem('note_index', this.noteIndex);
        container.appendChild(note.getElement());
        notes.push(note);
    }

    retrieveNotes() {
        const noteIndex = localStorage.getItem('note_index');
        for (let i = 0; i < noteIndex; i++) {
            console.log("called");
            const key = "index" + i;
            const value = localStorage.getItem(key);
            console.log("Retrieved:" + key, value);
        }
    }
    displayNotes() {
        var notesContainer = document.getElementById("notesContainer");
    
        // Retrieve notes from local storage
        const noteIndex = localStorage.getItem('note_index');
        for (let i = 0; i < noteIndex; i++) {
            const key = "index" + i;
            const value = JSON.parse(localStorage.getItem(key));
    
            // Create a note element
            var noteElement = document.createElement("div");
            noteElement.className = "note";
    
            var textElement = document.createElement("p");
            textElement.textContent = value.description;
    
            var timeElement = document.createElement("p");
            timeElement.textContent = value.time;
    
            noteElement.appendChild(textElement);
            noteElement.appendChild(timeElement);
    
            notesContainer.appendChild(noteElement);
        }
    }
    
    remove(id) {
        var index = notes.findIndex(item => item.id === id);
        notes.splice(index, 1);

        // Remove from local storage
        localStorage.removeItem(id);
    }

    gatherInput() {
        const msg_notSupported = "Sorry web Storage is not supported!";
        const msg_written = "A piece of data was written in local storage for the key:";
        const inputElements = document.querySelectorAll('.note-input');
        if (typeof(Storage) === "undefined") {
            console.log(msg_notSupported);
            return; // Stop execution
        }
        inputElements.forEach(input => {
            var note = {
                description: input.value,
                id: input.id,
            };
            console.log(note);
            localStorage.setItem(note.id, JSON.stringify(note));
            console.log(msg_written + note.id);
        });
    }

    start() {
        setInterval(this.gatherInput, 5000);
        setInterval(this.retrieveNotes, 6000);
        document.querySelector('.grid-container').addEventListener('click', (event) => {
            if (event.target && event.target.nodeName === "BUTTON") {
                const id = event.target.previousElementSibling.id;
                this.remove(id);
            }
        });
    }
    
}

const notes = [];
const noteManager = new NoteManager();
noteManager.start();
