const express = require("express")
const app = express();

app.get("/",(req, res) =>{
    res.sendFile(path.join(__dirname, '/index.html'))
})
app.listen(process.env.PORT || 5500) 
class Note{
    constructor(id, text){
        this.id = id
        this.text = text
    }

    createElement(id, text) {
        var componentContainer = document.createElement("div");
        var newTextbox = document.createElement("input");
        newTextbox.type = "text";
        newTextbox.className = "note-input";
        newTextbox.value = text || ""
        newTextbox.id = id;
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        
        // Add event listener to remove button
        removeButton.addEventListener('click', () => noteManager.removeNote(id));

        componentContainer.appendChild(newTextbox);
        componentContainer.appendChild(removeButton);
        return componentContainer;
    }
}

class NoteManager{
    constructor(){
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.noteIndex = parseInt(localStorage.getItem('note_index')) || 0;
        this.container = document.querySelector(".grid-container");
    }

    createNote(){
        var note = new Note("note#" + this.noteIndex, "");
        this.noteIndex += 1;
        this.notes.push(note)
        localStorage.setItem('notes', JSON.stringify(this.notes)); // Store relevant info
        localStorage.setItem('note_index', this.noteIndex)
        this.container.appendChild(note.createElement());
    }

    removeNote(id) {
        this.noteIndex -=1
        localStorage.setItem('note_index', this.noteIndex)
        console.log(id)
        console.log(this.notes)
        var index = this.notes.indexOf(id)
        this.notes.splice(index, 1)
        console.log(this.notes)
        localStorage.setItem('notes', JSON.stringify(this.notes));
        
        // Remove the element from the DOM
        var elementToRemove = document.getElementById(id);
        if (elementToRemove) {
            elementToRemove.parentElement.remove(); // Remove the entire componentContainer
        }
    }
    

    displayNotes(){
        console.log(this.notes)
        this.notes.forEach(noteData => {
            var note = new Note(noteData.id, noteData.text);
            this.container.appendChild(note.createElement(noteData.id, noteData.text));
        });
    }

    updateNotes(){
        const inputElements = document.querySelectorAll('.note-input');
        var notes_list = JSON.parse(localStorage.getItem('notes'));
        var index = 0
        inputElements.forEach(input => {     
            notes_list[index].text = input.value 
            index++
        });
        localStorage.setItem('notes', JSON.stringify(notes_list));
        const currentTime = new Date();
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const seconds = currentTime.getSeconds().toString().padStart(2, '0');
        const formattedTime = `Last updated on: ${hours}:${minutes}:${seconds}`;
        localStorage.setItem('time', formattedTime)
        var timestampElement = document.getElementById('timestamp');
        timestampElement.textContent = formattedTime
    }
}

function clearLocalStorage() {
    localStorage.clear();
}
// clearLocalStorage()
var noteManager = new NoteManager()
noteManager.displayNotes(); // Display existing notes
setInterval(noteManager.updateNotes.bind(noteManager), 9000); // Update every 2 minutes
