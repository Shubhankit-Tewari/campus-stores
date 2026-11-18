# Campus Stores

## My submission: AI handover draft + label scanning

**Try it live:** https://shubhankit-tewari.github.io/campus-stores/ (click **Restart sample shift** to start fresh).

**Where to look:** Desk book → **Draft handover with AI** (Friday 7:30 pm onward), then Loan register on Saturday morning. Try the scan bar by typing `AD-12`, `AD-15` or `PR-06`. The code is in `app.js` (`draftHandover`, `handoverFor`, and the `data-handover` form, plus `scanView` and `issue`), the scan bar in `index.html`, and the `.aidraft` and `.scan*` styles in `styles.css`.

### What the product handles well: the partial return

At pickup I issued the Film Society kit as three slips: PR-04 projector, SP-02 speaker and AD-12 adapter. The Epson projector, PR-06, wasn't offered in the unit list because it's in repair, so I couldn't hand out a broken unit. At 7:30 pm Kabir brought back only the projector and speaker. Because the register keeps one slip per physical unit, I closed L-402 and L-403, and L-404 for the adapter stayed open. The record matched the counter exactly, with no "partially returned" state to interpret.

### The moment I'd change: the Saturday morning handover

On Saturday at 9 am the new shift sees one open slip: L-404 · AD-12, issued to Kabir Sen, due Fri 8 pm. Leela Das walks in with an adapter. The register doesn't say that:

- Leela, not Kabir, has the adapter. That fact is only in a free-text desk-book message.
- She was expected at 9 am.
- There are two USB-C → HDMI adapters, AD-12 and AD-15, both kept in bin C4. Closing the wrong slip would silently corrupt stock.

The person on the morning shift has to rebuild Friday's story from messages before they can close the right slip. Friday's handover note is free text that isn't linked to anything, so it depends on whoever writes it remembering every detail.

### My change

At the end of a shift, **Draft handover with AI** reads the open slips, the desk book and the inventory, and drafts a handover note for the next shift. For L-404 it says:

> AD-12 adapter for Film Society is still out. Signed out to Kabir Sen, due Fri 8 pm. Leela Das has it now. Expected back Sat 9 am. The rest of this kit is back (PR-04, SP-02). AD-15 is the same kind of unit. Check the label reads AD-12 before closing the slip.

- Each line shows the sources it came from (Slip L-404, Desk book · Friday 7:30 pm, Inventory), so staff can check it instead of trusting it blindly.
- The draft is editable, and nothing is saved until a person clicks **Save as handover note**.
- Once saved, the note is **linked to the slip**. On Saturday, L-404 in the Loan register shows "Handover: with Leela Das, expected Sat 9 am" and a **Check label: AD-12** tag.
- It also flags approved items that were never issued, for example if the adapter had been forgotten at pickup.

**The same job with the change:** On Friday at 7:30 pm I record the two returns, click Draft handover, read the draft against what Kabir told me, and save it. On Saturday at 9 am, Leela arrives. I open the Loan register, see that L-404 is expected from her, check that the label reads AD-12, and record the return. I don't need to open the desk book.

**Scanning a label closes the loop.** A scan bar sits above every screen. It works with a USB or Bluetooth scanner, which types the label and presses Enter, or you can type a unit ID like `AD-12` yourself. The app decides what the scan means:

- **Unit on loan:** shows its slip, plus who has it according to the handover note, with one **Record return** button.
- **Unit on the shelf and an approved request needs it:** offers to issue it on a new slip, with the collector taken from the desk book (Kabir) and the request's return time. Scanning PR-04, SP-02 and AD-12 in turn issues the whole Film Society kit.
- **Wrong unit:** scanning AD-15 on Saturday says it's on the shelf and that the open adapter slip is for AD-12.
- **In repair or unknown:** blocked, with the reason shown.

Every scan needs a confirming click, and a repeat of the same code within 1.5 seconds is ignored. The "Check label" step from the handover becomes a physical check rather than something staff have to remember.

**Note on the "AI":** this prototype uses a scripted stand-in. Simple rules pull holders, times and same-type units out of the slips and messages, with a short delay to mimic a model call. In production the same interface would call a language model. The AI only drafts. The hard rules (approved equipment type, approved quantity, repair status) stay deterministic, and a person confirms every change to the register.

### What I kept

One slip per physical unit, the approval checks on the issue form, the desk book as the record of what clubs said, and the existing free-text note for anything the draft misses.

### What I'd watch at a real counter

When someone other than the borrower returns an item the next morning, does the person on shift close the correct unit's slip **without opening the desk book or asking a colleague**? I'd also count how often the AI draft is edited before saving. Frequent edits would mean the draft is missing what staff actually need.

---

Campus Stores is a Product Engineer work sample set at a fictional campus media equipment desk. Work through a club’s screening, from equipment pickup to a partial return and the next morning’s handover. Open **Candidate brief** in the app for the assignment.

## Run the app

Open `index.html` in a modern browser. The app includes its scripts, styles, and icons and can run offline.

To serve it over local HTTP, run this from the repository folder and visit `http://localhost:8000`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Each browser stores its own sample shift locally when browser storage is available. **Restart sample shift** restores the fictional starting records.

## Source

- `index.html` contains the desk layout, candidate brief, and bundled icons.
- `app.js` contains the sample records and interactions.
- `styles.css` defines the desktop and mobile layouts.

Icon license notices are in [third-party/lucide-LICENSE.txt](third-party/lucide-LICENSE.txt).


## Submit your work

1. [Fork Campus Stores](https://github.com/virinchi-healthcare/campus-stores/fork) into your GitHub account. Complete the candidate brief and push your changes to your public fork. In your README, point reviewers to your work and explain the decision you made.
2. In your fork, open **Commits**, select the final commit you want reviewed, and copy the page URL. It should look like `https://github.com/YOUR-USERNAME/campus-stores/commit/COMMIT-SHA`.
3. [Submit your work through the Google Form](https://docs.google.com/forms/d/e/1FAIpQLScvzoh1R4WS-SkiwAVBQbMvniieJYSoOEfLMyVo5CyjOvYUgQ/viewform). Your **roll number**, **email ID**, and **final commit link from your public fork** are required. Enter your roll number and email ID in the form only.
