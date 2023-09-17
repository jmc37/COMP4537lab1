const notesListElement = document.getElementById('notes-list');
const lastUpdatedElement = document.getElementById('last-updated');

class NoteManager{
    constructor(){
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.noteIndex = parseInt(localStorage.getItem('note_index')) || 0;
    }
    displayNotesInReader() {
        const notes = JSON.parse(localStorage.getItem("notes"))
        notesListElement.innerHTML = ""
        
        notes.forEach(noteData => {
            const noteElement = document.createElement('div');
            noteElement.id = 'text-display'
            noteElement.textContent = noteData.text;
            notesListElement.appendChild(noteElement);
        });

        const currentTime = new Date();
        let formattedTime = `${currentTime.toLocaleTimeString()}`
        lastUpdatedElement.textContent = `updated at: ${formattedTime || 'N/A'}`;
    }
    
}
let noteManager = new NoteManager()
setInterval(noteManager.displayNotesInReader.bind(noteManager), 2000); // Update every 2 secs
