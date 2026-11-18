(() => {
  const storageKey = "campus-stores.shift.v1";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];
  const original = () => ({
    version: 1,
    tab: "Requests",
    phase: 0,
    selected: "",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        back: false,
      },
    ],
    notes: [],
    draft: null,
    drafting: false,
    scan: "",
    scanDone: "",
    editing: false,
    onlyOpen: true,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  let lastScan = { code: "", at: 0 };
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list) =>
    list
      .map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + "</option>")
      .join("");
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, good = false) =>
    '<span class="tag' + (good ? " good" : "") + '">' + esc(t) + "</span>";
  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · 3 approved forms",
    );
    if (s.selected) {
      const r = getReq(s.selected);
      html +=
        btn("Back to list", "close") +
        '<div class="record"><small>' +
        r.id +
        " · Approved</small><h3>" +
        r.event +
        "</h3><p>" +
        r.club +
        " · Filed by " +
        r.owner +
        "</p><p><b>Return by</b> " +
        r.due +
        "</p><p><b>Approved equipment</b></p><ul>" +
        r.items.map((x) => "<li>" + x + "</li>").join("") +
        "</ul><p>" +
        r.note +
        "</p></div>";
    } else
      html += requests
        .map((r) =>
          row(
            r.event,
            r.id + " · " + r.club,
            btn("View form", "request", r.id),
          ),
        )
        .join("");
    return html;
  }
  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const status = a.repair
        ? "In repair"
        : out(a.id)
          ? "On loan"
          : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        a.id + " · " + a.type,
        a.model + " · " + a.bin,
        badge(status, status === "On shelf"),
      );
    }
    return html;
  }
  function register() {
    let html = head(
      "Loan register",
      "One slip per physical unit",
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      const select = (label, key, options) =>
        "<label><span>" +
        label +
        '</span><select name="' +
        key +
        '" required><option value="">Select…</option>' +
        opts(options) +
        "</select></label>";
      return (
        html +
        '<form data-issue><div class="form">' +
        select(
          "Approved request",
          "req",
          requests.map((r) => [r.id, r.id + " · " + r.club]),
        ) +
        select(
          "Unit leaving the desk",
          "asset",
          available.map((a) => [a.id, a.id + " · " + a.type]),
        ) +
        select(
          "Collected by",
          "who",
          people.map((p) => [p, p]),
        ) +
        select(
          "Return by",
          "due",
          ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"].map((d) => [d, d]),
        ) +
        '</div><button type="submit" class="primary">Save issue slip</button></form>'
      );
    }
    html +=
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";
    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .slice()
      .reverse();
    if (!shown.length) html += "<p>No outstanding slips.</p>";
    for (const l of shown) {
      const h = !l.back && handoverFor(l.num);
      html += row(
        "L-" + l.num + " · " + l.asset + " · " + getAsset(l.asset).type,
        l.req +
          " · " +
          l.who +
          " · Due " +
          l.due +
          (h ? " · Handover: with " + h.holder + ", expected " + h.expect : ""),
        l.back
          ? badge("Returned")
          : (h ? badge("Check label: " + l.asset) + " " : "") +
              btn("Record return", "return", String(l.num)),
      );
    }
    return html;
  }
  function issue(req, asset, who, due) {
    const unit = getAsset(asset),
      r = getReq(req);
    if (!r || !unit || unit.repair || out(asset) || !people.includes(who))
      return "This unit can’t be issued right now.";
    if (!r.items.includes(unit.type))
      return "This equipment type is outside the approved request. Choose an approved unit.";
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    )
      return "The approved quantity of this equipment type is already on loan.";
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({ num, req, asset, who, due, back: false });
    return { num };
  }
  const norm = (x) => String(x).toUpperCase().replace(/[^A-Z0-9]/g, "");
  function collectorFor(r) {
    const m = messages().find(
      ([, author, body]) => author.includes(r.club) && /pick/i.test(body),
    );
    return (m && people.find((p) => m[2].includes(p))) || r.owner;
  }
  function scanView() {
    if (s.scanDone)
      return '<div class="scancard ok"><p>' + esc(s.scanDone) + "</p></div>";
    if (!s.scan) return "";
    const a = assets.find((x) => norm(x.id) === norm(s.scan));
    const card = (tone, title, body) =>
      '<div class="scancard ' + tone + '"><small>Scanned · ' + esc(s.scan) +
      "</small><h3>" + esc(title) + "</h3>" + body +
      '<div class="buttons">' + btn("Clear", "scanclear") + "</div></div>";
    if (!a)
      return card("warn", "Unknown label", "<p>No unit in Inventory has this ID. Check the label or type it again.</p>");
    const name = a.id + " · " + a.type + " · " + a.model;
    if (a.repair)
      return card("warn", name, "<p>This unit is in repair (" + esc(a.bin) + "). It can’t be issued.</p>");
    const l = out(a.id);
    if (l) {
      const h = handoverFor(l.num);
      return card(
        "",
        name,
        "<p>On loan on slip <b>L-" + l.num + "</b> · " + esc(l.req) + " · issued to " +
          esc(l.who) + " · due " + esc(l.due) + "</p>" +
          (h ? "<p>Handover note: with <b>" + esc(h.holder) + "</b>, expected " + esc(h.expect) + ". Label matches the slip.</p>" : "") +
          '<div class="buttons">' + btn("Record return of " + a.id, "scanreturn", String(l.num), "primary") + "</div>",
      );
    }
    // On the shelf
    let body = "<p>On the shelf · bin " + esc(a.bin) + "</p>";
    const twin = s.loans.find(
      (x) => !x.back && x.asset !== a.id && getAsset(x.asset).type === a.type,
    );
    let tone = "";
    if (twin) {
      tone = "warn";
      body +=
        "<p><b>Not on loan.</b> The open " + esc(a.type) + " slip is L-" + twin.num +
        " for <b>" + esc(twin.asset) + "</b>. If someone is returning one, check the label.</p>";
    }
    const needs = requests.filter(
      (r) =>
        r.items.includes(a.type) &&
        !s.loans.some((x) => x.req === r.id && getAsset(x.asset).type === a.type),
    );
    if (!needs.length)
      body += "<p>No approved request is waiting for a " + esc(a.type) + ".</p>";
    for (const r of needs)
      body +=
        '<form data-scanissue class="scanissue"><input type="hidden" name="req" value="' + esc(r.id) +
        '"><input type="hidden" name="asset" value="' + esc(a.id) + '"><p>Approved on <b>' + esc(r.id) +
        "</b> · " + esc(r.club) + " · return by " + esc(r.due) +
        '</p><label>Collected by <select name="who">' +
        opts(people.map((p) => [p, p])).replace(
          'value="' + esc(collectorFor(r)) + '"',
          'value="' + esc(collectorFor(r)) + '" selected',
        ) +
        '</select></label> <button type="submit" class="primary">Issue ' + esc(a.id) + " on a new slip</button></form>";
    return card(tone, name, body);
  }
  function messages() {
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    return entries;
  }
  // Scripted stand-in for an AI model: reads the open slips and the desk book,
  // and drafts a handover note. Staff review and edit it before it is saved.
  const timeRe = /\b(\d{1,2}(?::\d{2})?\s?(?:am|pm)|noon)\b/i;
  function draftHandover() {
    const items = [];
    const links = [];
    const msgs = messages();
    for (const l of s.loans.filter((x) => !x.back)) {
      const a = getAsset(l.asset);
      const r = getReq(l.req);
      const word = a.type.split(" ").pop().toLowerCase();
      const sources = ["Slip L-" + l.num];
      let holder = l.who;
      let expect = l.due;
      for (const [t, , body] of msgs)
        for (const sentence of body.split(/(?<=[.!?])\s+/)) {
          if (!sentence.toLowerCase().includes(word)) continue;
          const other = people.find((p) => p !== l.who && sentence.includes(p));
          if (!other) continue;
          holder = other;
          const rest = body.slice(body.indexOf(sentence));
          const m = rest.match(timeRe);
          if (m) expect = (/tomorrow/i.test(rest) ? "Sat " : "") + m[1];
          sources.push("Desk book · " + t);
        }
      let text =
        "L-" + l.num + " · " + a.id + " " + a.type + " for " + r.club +
        " is still out. Signed out to " + l.who + ", due " + l.due + ".";
      if (holder !== l.who)
        text += " " + holder + " has it now. Expected back " + expect + ".";
      const back = s.loans
        .filter((x) => x.req === l.req && x.back)
        .map((x) => x.asset);
      if (back.length)
        text += " The rest of this kit is back (" + back.join(", ") + ").";
      const twins = assets.filter((x) => x.type === a.type && x.id !== a.id);
      if (twins.length) {
        text +=
          " " + twins.map((x) => x.id).join(", ") +
          " is the same kind of unit. Check the label reads " + a.id +
          " before closing the slip.";
        sources.push("Inventory");
      }
      items.push({ text, sources: [...new Set(sources)] });
      if (holder !== l.who) links.push({ num: l.num, holder, expect });
    }
    for (const r of requests) {
      const issued = s.loans
        .filter((l) => l.req === r.id)
        .map((l) => getAsset(l.asset).type);
      const missing = r.items.filter((x) => !issued.includes(x));
      if (issued.length && missing.length)
        items.push({
          text:
            r.id + " (" + r.club + ") was approved for " + missing.join(", ") +
            " but no slip was issued. Confirm whether it left the desk.",
          sources: ["Request " + r.id, "Loan register"],
        });
    }
    if (!items.length)
      items.push({ text: "No open slips. Nothing to hand over.", sources: ["Loan register"] });
    return { items, links, text: items.map((i) => "• " + i.text).join("\n") };
  }
  function handoverFor(num) {
    for (let i = s.notes.length - 1; i >= 0; i--) {
      const k = (s.notes[i].links || []).find((x) => x.num === num);
      if (k && k.holder) return k;
    }
  }
  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
      s.drafting || s.draft ? "" : btn("Draft handover with AI", "draft", "", "primary"),
    );
    if (s.drafting)
      html +=
        '<div class="record aidraft"><small>AI handover draft</small><p>Reading open slips and the desk book…</p></div>';
    else if (s.draft)
      html +=
        '<form data-handover class="record aidraft"><small>AI handover draft · check it before saving</small><ul>' +
        s.draft.items
          .map(
            (i) =>
              "<li>" + esc(i.text) + '<div class="sources">' +
              i.sources.map((x) => badge(x)).join(" ") + "</div></li>",
          )
          .join("") +
        '</ul><label class="full"><span>Edit the note before saving</span><textarea name="note" rows="6" maxlength="1500" required>' +
        esc(s.draft.text) +
        '</textarea></label><div class="buttons"><button type="submit" class="primary">Save as handover note</button>' +
        btn("Discard", "discard") +
        "</div></form>";
    const entries = messages();
    for (const n of s.notes)
      entries.push([shifts[n.phase].time, "Counter handover", n.text]);
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>'
    );
  }
  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    q("[data-status]").textContent = s.notice;
    q("[data-scanresult]").innerHTML = scanView();
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        s.editing = false;
        break;
      case "close":
        s.selected = "";
        break;
      case "request":
        s.selected = v;
        break;
      case "new":
        s.editing = true;
        break;
      case "draft":
        s.drafting = true;
        s.draft = null;
        setTimeout(() => {
          s.drafting = false;
          s.draft = draftHandover();
          commit("AI draft ready. Check it against the counter before saving.");
        }, 700);
        break;
      case "scanclear":
        s.scan = "";
        s.scanDone = "";
        q("[data-scaninput]").focus();
        break;
      case "scanreturn": {
        const l = s.loans.find((l) => l.num === Number(v));
        if (!l || l.back) return;
        l.back = true;
        const left = s.loans.filter((x) => x.req === l.req && !x.back);
        s.scan = "";
        s.scanDone =
          "Returned " + l.asset + ". Slip L-" + l.num + " closed." +
          (left.length
            ? " " + l.req + " still has " + left.map((x) => x.asset + " (L-" + x.num + ")").join(", ") +
              " out. Note who has it in the handover."
            : "");
        s.notice = l.asset + " returned to stock. Slip L-" + l.num + " closed.";
        q("[data-scaninput]").focus();
        break;
      }
      case "discard":
        s.draft = null;
        s.notice = "AI draft discarded.";
        break;
      case "cancel":
        s.editing = false;
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "return": {
        const l = s.loans.find((l) => l.num === Number(v));
        if (!l || l.back) return;
        l.back = true;
        s.notice = l.asset + " returned to stock. Slip L-" + l.num + " closed.";
        break;
      }
    }
    commit();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
  });
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-scan]")) {
      const input = q("[data-scaninput]");
      const code = input.value.trim();
      input.value = "";
      if (!code) return;
      const now = Date.now();
      if (norm(code) === norm(lastScan.code) && now - lastScan.at < 1500) return;
      lastScan = { code, at: now };
      s.scan = code;
      s.scanDone = "";
      commit();
      return;
    }
    if (f.matches("[data-scanissue]")) {
      const [req, asset, who] = ["req", "asset", "who"].map((k) => form.get(k));
      const res = issue(req, asset, who, getReq(req) && getReq(req).due);
      if (typeof res === "string") {
        q("[data-status]").textContent = res;
        return;
      }
      s.scan = "";
      s.scanDone = "Issued " + asset + " to " + who + " on slip L-" + res.num + ". Scan the next unit.";
      commit("Issued " + asset + " to " + who + " on slip L-" + res.num + ".");
      q("[data-scaninput]").focus();
      return;
    }
    if (f.matches("[data-handover]")) {
      const text = String(form.get("note")).trim();
      if (!text || !s.draft) return;
      s.notes.push({ phase: s.phase, text, links: s.draft.links });
      s.draft = null;
      commit("Handover note saved and linked to the open slips.");
      return;
    }
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const res = issue(req, asset, who, due);
    if (typeof res === "string") {
      if (!res.startsWith("This unit")) q("[data-status]").textContent = res;
      return;
    }
    const num = res.num;
    s.editing = false;
    commit("Issued " + asset + " to " + who + " on slip L-" + num + ".");
  });
  function restore(d) {
    if (
      !d ||
      d.version !== 1 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) => n && shifts[n.phase] && typeof n.text === "string",
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l && getReq(l.req) && getAsset(l.asset) && Number.isInteger(l.num),
      )
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l })),
      notes: d.notes.map((n) => ({
        ...n,
        links: Array.isArray(n.links) ? n.links : [],
      })),
      drafting: false,
      scan: "",
      scanDone: "",
      draft:
        d.draft && Array.isArray(d.draft.items) && Array.isArray(d.draft.links)
          ? d.draft
          : null,
    };
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep the fresh shift when storage is unavailable or the saved data is invalid.
  }
})();
