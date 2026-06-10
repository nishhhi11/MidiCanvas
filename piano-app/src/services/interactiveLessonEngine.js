export function createInteractiveLesson(notes) {
  // Sort notes by time just to be absolutely sure they are sequential
  const lessonNotes = [...notes].sort((a, b) => a.time - b.time);
  let currentIndex = 0;
  const totalNotes = lessonNotes.length;

  /* 
    FUTURE KEYBOARD INPUT NOTES:
    - This engine acts as a state machine for "Wait Mode".
    - The UI will render `engine.getCurrentNote()` prominently.
    - When the user presses a key on their physical MIDI keyboard or computer keyboard,
      the UI will check: `if (userInput === engine.getCurrentNote().name)`.
    - If correct, the UI fires `engine.advanceLesson()` to move to the next target.
    - If incorrect, the engine waits (or triggers a mistake sound).
  */

  return {
    // The raw array of notes sorted sequentially
    lessonNotes,
    
    // We use getters so that the consumer always receives the live value 
    // rather than a stale reference from when the object was created.
    get currentIndex() {
      return currentIndex;
    },
    
    get totalNotes() {
      return totalNotes;
    },

    getCurrentNote() {
      if (currentIndex >= totalNotes) return null; // Lesson complete
      return lessonNotes[currentIndex];
    },

    getNextNote() {
      if (currentIndex + 1 >= totalNotes) return null; // No next note
      return lessonNotes[currentIndex + 1];
    },

    advanceLesson() {
      if (currentIndex < totalNotes) {
        currentIndex++;
      }
      return currentIndex;
    },

    resetLesson() {
      currentIndex = 0;
    }
  };
}
