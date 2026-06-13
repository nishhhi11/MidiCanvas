# 🎹 MidiCanvas – MIDI File Parser & Visual Piano Roll

## Overview

MidiCanvas is a frontend-only ReactJS application that parses MIDI (.mid) files and visualizes musical note data through an interactive Piano Roll interface.

Unlike audio files, MIDI files contain binary event information such as note events, pitch values, velocity data, tempo information, and timestamps. MidiCanvas decodes this data entirely within the browser and transforms it into a structured timeline that can be visualized, edited, stored locally, and played back in real time.

The application follows a client-side architecture and does not require any backend server or database. All processing, storage, and playback operations are performed directly in the browser.

---

## Problem Statement

The objective of this project is to develop a frontend-only ReactJS application capable of parsing MIDI (.mid) files and visualizing musical note data through an interactive Piano Roll interface.

The system should decode binary MIDI data, extract note events and timing information, render them on a timeline-based piano roll, and provide playback functionality using browser-based audio technologies. The application should also support local storage, track management, note interaction, and efficient state handling without relying on backend services.

---

## Objectives

* Parse MIDI files directly in the browser.
* Decode note events, pitch values, velocity information, and timestamps.
* Visualize notes on a timeline-based Piano Roll interface.
* Provide playback controls for MIDI compositions.
* Enable note interaction and editing.
* Store projects locally using IndexedDB.
* Manage application state efficiently using Zustand.
* Generate audio playback using the Web Audio API.
* Deliver a responsive Digital Audio Workstation (DAW)-inspired experience.

---

## Live Demo

https://midi-canvas.vercel.app

## GitHub Repository

https://github.com/nishhhi11/MidiCanvas

---

## Features

### MIDI File Upload

* Upload local MIDI (.mid) files directly from the browser.
* Client-side file processing using the browser's native File API.

### Binary MIDI Parsing

* Reads uploaded MIDI files using `File.prototype.arrayBuffer()`.
* Transfers binary data to a Web Worker for parsing.
* Decodes MIDI tracks and events.

### Piano Roll Visualization

* Displays note events on an interactive timeline.
* Vertical piano keyboard layout.
* Scrollable and editable note grid.

### Playback Controls

* Play
* Pause
* Resume
* Stop
* Loop Playback

### Note Editing

* Select notes
* Move notes
* Resize notes
* Delete notes
* Real-time state updates

### Track Management

* Track organization and inspection.
* Instrument channel handling.
* Event grouping by track.

### Local Storage

* Save parsed MIDI projects locally.
* IndexedDB integration through Dexie.js.

### Performance Monitoring

* Timeline position tracking.
* Playback telemetry.
* Active note monitoring.

### Quantization Support

* Grid-based alignment of note events.
* Timeline snapping functionality.

---

## System Architecture

```text
User Uploads MIDI File
          │
          ▼
  File.arrayBuffer()
          │
          ▼
      Web Worker
          │
          ▼
      MIDI Parser
          │
          ▼
     Zustand Store
          │
          ▼
     Piano Roll UI
          │
          ▼
   Playback Engine
          │
          ▼
    Web Audio API
```

---

## Technology Stack

| Technology             | Purpose                  |
| ---------------------- | ------------------------ |
| React.js               | Frontend Framework       |
| JavaScript             | Application Logic        |
| Zustand                | State Management         |
| Dexie.js               | IndexedDB Wrapper        |
| IndexedDB              | Local Storage            |
| Web Workers            | Background MIDI Parsing  |
| Web Audio API          | Audio Playback           |
| File API (arrayBuffer) | Binary MIDI File Reading |
| Vite                   | Build Tool               |
| React DOM Elements     | Piano Roll Rendering     |

---

## Project Structure

```text
src/
│
├── components/
│   ├── common/
│   ├── editor/
│   ├── landing/
│   └── library/
│
├── hooks/
├── pages/
├── stores/
├── styles/
├── types/
├── utils/
└── workers/
```

---

## Installation

### Clone Repository

git clone https://github.com/nishhhi11/MidiCanvas.git

### Navigate to Project

cd MidiCanvas

### Install Dependencies

npm install

### Run Development Server

npm run dev

### Build Production Version

npm run build

---

## Screenshots

### Landing Page

(Add Screenshot)

### MIDI Upload Interface

(Add Screenshot)

### Piano Roll Editor

(Add Screenshot)

### Playback Controls

(Add Screenshot)

### Track Management

(Add Screenshot)

### Library & Storage

(Add Screenshot)

---

## Working Flow

1. User uploads a MIDI file.
2. Binary MIDI data is read using `arrayBuffer()`.
3. Data is transferred to a Web Worker.
4. MIDI events are decoded and structured.
5. Parsed notes are stored in Zustand state.
6. Notes are rendered on the Piano Roll interface.
7. Playback events are scheduled through the Web Audio API.
8. Telemetry updates playback information in real time.

---

## Learning Outcomes

This project provided practical experience in:

* MIDI File Structure and Parsing
* Binary Data Processing
* React Component Architecture
* Zustand State Management
* IndexedDB Integration
* Web Workers
* Audio Scheduling
* Interactive UI Design
* Browser-Based Audio Systems

---

## Future Enhancements

* MIDI Export Functionality
* Advanced Track Editing
* Additional Instrument Presets
* Tempo Editing Tools
* MIDI Recording Improvements
* AI-Assisted Music Learning Features
* Real-Time Collaboration

---

## Conclusion

MidiCanvas successfully demonstrates a complete client-side MIDI File Parser and Visual Piano Roll system built using React.js. The application processes MIDI files entirely within the browser, converts binary event data into structured musical information, visualizes notes on an interactive timeline, and provides playback functionality using the Web Audio API.

The project showcases frontend engineering concepts including binary file processing, state management, local storage, background processing with Web Workers, and interactive music visualization while remaining fully client-side.

---

## Author

**Nishi Chopda**

ReactJS Project Evaluation Submission
