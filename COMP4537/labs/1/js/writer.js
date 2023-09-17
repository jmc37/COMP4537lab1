const addNoteButton = document.getElementById("add");
const container = document.querySelector(".grid-container");
const timestampElement = document.getElementById('timestamp');

const NOTES_KEY = 'notes'
const NOTES_INDEX_KEY = 'note_index'

 class Note{
    constructor(id, text){
        this.id = id
        this.text = text
    }

    createElement() {
        const componentContainer = document.createElement("div");
        const newTextbox = document.createElement("input");

        newTextbox.type = "text";
        newTextbox.className = "note-input";
        newTextbox.value = this.text || ""
        newTextbox.id = this.id;

        const removeButton = document.createElement("button");
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
    }

    createNote(){
        const note = new Note("note#" + this.noteIndex, "");
        this.noteIndex += 1;
        this.notes.push(note)
        localStorage.setItem(NOTES_KEY, JSON.stringify(this.notes)); // Store relevant info
        localStorage.setItem(NOTES_INDEX_KEY, this.noteIndex)
        container.appendChild(note.createElement());
    }

    removeNote(id) {
        // Find the index of the note by matching id
        const index = this.notes.findIndex(note => note.id === id);

        this.notes.splice(index, 1); // Remove the note from the array

        // Update localStorage
        localStorage.setItem(NOTES_KEY, JSON.stringify(this.notes));

        const elementToRemove = document.getElementById(id);
        elementToRemove.parentElement.remove(); // Remove the entire componentContainer
        this.noteIndex -= 1;
        localStorage.setItem(NOTES_INDEX_KEY, this.noteIndex);
    }

    displayNotes(){
        this.updateTime()
        this.notes.forEach(noteData => {
            const note = new Note(noteData.id, noteData.text);
            container.appendChild(note.createElement(noteData.id, noteData.text));
        });
    }
    updateTime(){
        const currentTime = new Date();
        timestampElement.textContent = `stored at: ${currentTime.toLocaleTimeString()}`;
    }
    updateNotes(){
        const inputElements = document.querySelectorAll('.note-input');
        const notes_list = JSON.parse(localStorage.getItem(NOTES_KEY));
        let index = 0
        inputElements.forEach(input => {    
            notes_list[index].text = input.value 
            index++
        });
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes_list));
        this.updateTime()
    }
}

const noteManager = new NoteManager()
addNoteButton.addEventListener("click", () => {
    noteManager.createNote()
  });
noteManager.displayNotes(); // Display existing notes
setInterval(noteManager.updateNotes.bind(noteManager), 2000); // Update every 2 secs
