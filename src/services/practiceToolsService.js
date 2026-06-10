export function calculateSections(allNotes) {
  if (!allNotes || allNotes.length === 0) return [];

  const sortedNotes = [...allNotes].sort((a, b) => a.startTime - b.startTime);
  const sections = [];
  let currentSectionStart = sortedNotes[0].startTime;
  let sectionIndex = 1;

  for (let i = 1; i < sortedNotes.length; i++) {
    const prevNote = sortedNotes[i - 1];
    const currNote = sortedNotes[i];
    
    // Musical gap detection (>= 2 seconds)
    if (currNote.startTime - (prevNote.startTime + prevNote.duration) >= 2.0) {
      sections.push({
        id: sectionIndex,
        name: `Section ${sectionIndex}`,
        start: Math.max(0, currentSectionStart - 0.5), // slight padding
        end: currNote.startTime - 0.5
      });
      currentSectionStart = currNote.startTime;
      sectionIndex++;
    }
  }

  // Close final section
  const lastNote = sortedNotes[sortedNotes.length - 1];
  sections.push({
    id: sectionIndex,
    name: `Section ${sectionIndex}`,
    start: Math.max(0, currentSectionStart - 0.5),
    end: lastNote.startTime + lastNote.duration + 2.0
  });

  // Fallback to 30s chunks if no natural gaps found (meaning 1 giant section was made)
  if (sections.length === 1 && (lastNote.startTime - sortedNotes[0].startTime) > 45) {
    const fallbackSections = [];
    let start = 0;
    const duration = lastNote.startTime + lastNote.duration;
    let idx = 1;
    while (start < duration) {
      fallbackSections.push({
        id: idx,
        name: `Section ${idx}`,
        start: start,
        end: Math.min(start + 30, duration + 2.0)
      });
      start += 30;
      idx++;
    }
    return fallbackSections;
  }

  return sections;
}

export function filterNotesByHand(lesson, activeHand) {
  if (!lesson) return [];
  if (activeHand === "left") return lesson.leftHandNotes || [];
  if (activeHand === "right") return lesson.rightHandNotes || [];
  
  // Both
  const left = lesson.leftHandNotes || [];
  const right = lesson.rightHandNotes || [];
  return [...left, ...right].sort((a, b) => a.startTime - b.startTime);
}

export function calculateAdaptiveTempo(loopMastery, currentSpeed) {
  if (loopMastery.totalHits === 0) return currentSpeed;
  
  const accuracy = (loopMastery.perfectHits / loopMastery.totalHits) * 100;
  
  let newSpeed = currentSpeed;
  if (accuracy > 90) {
    newSpeed += 0.05;
  } else if (accuracy < 70) {
    newSpeed -= 0.05;
  }

  // Clamp tempo between 50% and 125%
  return Math.min(Math.max(newSpeed, 0.5), 1.25);
}
