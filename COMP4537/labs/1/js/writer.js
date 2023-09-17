const addNoteButton = document.getElementById("add");
const NOTES_KEY = 'notes'
const NOTES_INDEX_KEY = 'note_index'
const TIME_KEY = 'time'
 class Note{
    constructor(id, text){
        this.id = id
        this.text = text
    }

    createElement() {
        let componentContainer = document.createElement("div");
        let newTextbox = document.createElement("input");

        newTextbox.type = "text";
        newTextbox.className = "note-input";
        newTextbox.value = this.text || ""
        newTextbox.id = this.id;

        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        
        // Add event listener to remove button
        removeButton.addEventListener('click', () => noteManager.removeNote(this.id));

        componentContainer.appendChild(newTextbox);
        componentContainer.appendChild(removeButton);
        return componentContainer;
    }
}

class NoteManager{
    constructor(){
        this.notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
        this.noteIndex = parseInt(localStorage.getItem(NOTES_INDEX_KEY)) || 0;
        this.container = document.querySelector(".grid-container");
    }

    createNote(){
        let note = new Note("note#" + this.noteIndex, "");
        this.noteIndex += 1;
        this.notes.push(note)
        localStorage.setItem(NOTES_KEY, JSON.stringify(this.notes)); // Store relevant info
        localStorage.setItem(NOTES_INDEX_KEY, this.noteIndex)
        this.container.appendChild(note.createElement());
    }

    removeNote(id) {
        // Find the index of the note by matching id
        let index = this.notes.findIndex(note => note.id === id);

        this.notes.splice(index, 1); // Remove the note from the array

        // Update localStorage
        localStorage.setItem(NOTES_KEY, JSON.stringify(this.notes));

        let elementToRemove = document.getElementById(id);
        elementToRemove.parentElement.remove(); // Remove the entire componentContainer
        this.noteIndex -= 1;
        localStorage.setItem(NOTES_INDEX_KEY, this.noteIndex);
    }
    

    displayNotes(){
        let timestampElement = document.getElementById('timestamp');
        let lastUpdatedTime = localStorage.getItem(TIME_KEY)
        timestampElement.textContent = `Last updated: ${lastUpdatedTime || 'N/A'}`;
        this.notes.forEach(noteData => {
            var note = new Note(noteData.id, noteData.text);
            this.container.appendChild(note.createElement(noteData.id, noteData.text));
        });
    }

    updateNotes(){
        const inputElements = document.querySelectorAll('.note-input');
        let notes_list = JSON.parse(localStorage.getItem(NOTES_KEY));
        let index = 0
        inputElements.forEach(input => {    
            notes_list[index].text = input.value 
            index++
        });
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes_list));
        const currentTime = new Date();
        let formattedTime = `${currentTime.toLocaleTimeString()}`
        localStorage.setItem(TIME_KEY, formattedTime)
        let timestampElement = document.getElementById('timestamp');
        timestampElement.textContent = `Stored at ${formattedTime}`
    }
}

function clearLocalStorage() {
    localStorage.clear();
}
// clearLocalStorage()
let noteManager = new NoteManager()
addNoteButton.addEventListener("click", () => {
    noteManager.createNote()
  });
noteManager.displayNotes(); // Display existing notes
setInterval(noteManager.updateNotes.bind(noteManager), 2000); // Update every 2 secs
