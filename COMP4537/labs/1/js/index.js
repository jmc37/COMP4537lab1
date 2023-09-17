 class Note{
    constructor(id, text){
        this.id = id
        this.text = text
    }

    createElement(id, text) {
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
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.noteIndex = parseInt(localStorage.getItem('note_index')) || 0;
        this.currentPage = window.location.pathname.includes('reader.html') ? 'reader' : 'writer';
        this.container = document.querySelector(".grid-container");
    }

    createNote(){
        let note = new Note("note#" + this.noteIndex, "");
        this.noteIndex += 1;
        this.notes.push(note)
        localStorage.setItem('notes', JSON.stringify(this.notes)); // Store relevant info
        localStorage.setItem('note_index', this.noteIndex)
        this.container.appendChild(note.createElement());
    }

    removeNote(id) {
        console.log(id);
        console.log(this.notes);

        // Find the index of the note by matching id
        let index = this.notes.findIndex(note => note.id === id);
        console.log(index);

        if (index !== -1) { // Check if note with given id was found
            this.notes.splice(index, 1); // Remove the note from the array

            // Update localStorage
            localStorage.setItem('notes', JSON.stringify(this.notes));

            let elementToRemove = document.getElementById(id);
            if (elementToRemove) {
                elementToRemove.parentElement.remove(); // Remove the entire componentContainer
            }

            this.noteIndex -= 1;
            localStorage.setItem('note_index', this.noteIndex);

            // Log notes after removal for debugging
            console.log(this.notes);
        } else {
            console.error(`Note with id ${id} not found.`);
        }
    }
    

    displayNotes(){
        let timestampElement = document.getElementById('timestamp');
        let lastUpdatedTime = localStorage.getItem('time')
        if(lastUpdatedTime){
            timestampElement.textContent = `Last updated: ${lastUpdatedTime || 'N/A'}`;
        }
        this.notes.forEach(noteData => {
            var note = new Note(noteData.id, noteData.text);
            this.container.appendChild(note.createElement(noteData.id, noteData.text));
        });
    }
    displayNotesInReader() {
        const notesListElement = document.getElementById('notes-list');
        const lastUpdatedElement = document.getElementById('last-updated');
        let notes = JSON.parse(localStorage.getItem("notes"))
        notesListElement.innerHTML = ""
        console.log(notesListElement)
        console.log(this.notes)
        notes.forEach(noteData => {
            const noteElement = document.createElement('div');
            noteElement.textContent = noteData.text;
            notesListElement.appendChild(noteElement);
        });

        const lastUpdatedTime = localStorage.getItem('time');
        lastUpdatedElement.textContent = `Last updated: ${lastUpdatedTime || 'N/A'}`;
    }
    updateNotes(){
        const inputElements = document.querySelectorAll('.note-input');
        let notes_list = JSON.parse(localStorage.getItem('notes'));
        let index = 0
        inputElements.forEach(input => {    
            console.log(input.value) 
            notes_list[index].text = input.value 
            index++
        });
        localStorage.setItem('notes', JSON.stringify(notes_list));
        const currentTime = new Date();
        localStorage.setItem('time', `Stored at: ${currentTime.toLocaleTimeString()}`)
        let timestampElement = document.getElementById('timestamp');
        timestampElement.textContent = formattedTime
    }
}

function clearLocalStorage() {
    localStorage.clear();
}
// clearLocalStorage()
let noteManager = new NoteManager()
if (noteManager.currentPage === 'reader') {
    setInterval(noteManager.displayNotesInReader.bind(noteManager), 2000); // Update every 2 secs
} else {
    noteManager.displayNotes(); // Display existing notes
    setInterval(noteManager.updateNotes.bind(noteManager), 2000); // Update every 2 secs
}
