# Room Schedule Display

A single-file, self-contained room booking display board designed to run on any screen — conference room TV, lobby monitor, ops dashboard. No server, no build step, no dependencies to install. Drop one file into GitHub Pages and you're done.

---

## Live demo / deployment

1. Fork or create a new repository on GitHub
2. Add `index.html` to the repository root
3. Go to **Settings → Pages → Source** and select your main branch
4. Your board is live at `https://<your-username>.github.io/<repo-name>/`

That's it. The page loads the schedule from a local Excel file each time — nothing is ever uploaded anywhere.

---

## Excel file format

The board reads a standard `.xlsx`, `.xls`, or `.csv` file. Layout:

| A (Time) | B (Room 1) | C (Room 2) | D (Room 3) |
|----------|------------|------------|------------|
| 08:00    | Morning Briefing | | |
| 09:00    | Project Kickoff | Design Review | |
| 10:00    | | UX Workshop | Budget Meeting |
| 11:00    | Stakeholder Sync | | Sprint Planning |

- **Row 1** — headers: first cell is ignored, the rest become room names
- **Column A** — slot start times in `HH:MM` format
- **Columns B onward** — one column per room; fill in the event name, leave blank if the room is free
- **Sensitive data** — anything after the first comma in a cell is stripped before display (e.g. `Workshop, John Smith` shows as `Workshop`)
- Up to **4 rooms** are supported in the grid layout

---

## Features

### Display
- **Large live clock** — hours, minutes, seconds, full date
- **Room cards** — one per room column, with a green accent bar when occupied
- **Current event** — shown in green; "FREE" when the room is empty
- **Progress bar** — fills left-to-right across the current time slot; turns yellow then red near the end
- **Remaining time** — live countdown in minutes and seconds
- **Next up** — shows the next booking and its start time

### States
| Condition | Behaviour |
|-----------|-----------|
| Before first slot | Cards show **UPCOMING** with a dimmed preview and a countdown to start |
| During schedule | Cards show **CURRENT** event and remaining time |
| Last slot | Progress bar hidden; shows "Last slot" |
| Room is free | Card shows **FREE** in dark text, no green accent |

### Controls

| Control | Action |
|---------|--------|
| **LOAD FILE** button | Open file picker to load a new schedule |
| **NEXT SLOT ›** button | Manually advance displayed bookings one row forward |
| **RESET** button | Return to clock-driven slot |
| **FULLSCREEN** button | Enter/exit fullscreen |
| **SCANLINES** button | Toggle CRT scanline overlay (off by default) |
| `Space` or `→` | Advance one slot |
| `Backspace` or `←` | Reset to clock |

**Manual slot advance** shifts which row's bookings are shown without affecting the clock or progress bar — useful when a session ends early and you want to preview what's next.

When the mouse is idle for 3 seconds, the cursor and all control buttons disappear automatically. Move the mouse to bring them back.

---

## Configuration

Open `index.html` in any text editor and find the CONFIG block near the top of the `<script>` section:

```js
const WARN_SECONDS   = 45;   // → yellow bar
const DANGER_SECONDS = 20;   // → red bar
```

Change these two numbers to set when the progress bar switches colour. No other changes are needed.

---

## Privacy

- The Excel file is read entirely in the browser — no data is sent to any server
- Anything after the first comma in an event name is hidden on screen (the source file is unchanged)
- No cookies, no tracking, no analytics

---

## Browser support

Requires a modern browser with the [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) for screensaver suppression (Chrome/Edge 84+, Safari 16.4+). The board works in Firefox too, but Firefox does not support Wake Lock, so the OS screensaver may still activate.

For kiosk use, Chrome in fullscreen mode is recommended.

---

## File structure

```
/
└── index.html   ← entire application, single file
└── README.md    ← this file
```

The only external dependency is the [SheetJS](https://sheetjs.com/) library loaded from a CDN, used to parse Excel files. No internet connection is required after the page has loaded once (the CDN script is cached by the browser).
