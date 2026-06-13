import { useState, useMemo } from "react";
import {
  LayoutDashboard, BookOpen, BarChart3, CalendarCheck, IndianRupee, Bell,
  Sparkles, Send, CheckCircle2, Clock, ChevronRight, Phone
} from "lucide-react";

// ---------- Brand tokens (same school world: ink navy, ledger green, red pen, marigold) ----------
const C = {
  ink: "#1C2B4A",
  inkDeep: "#14213A",
  paper: "#F5F6F2",
  green: "#1E7F4F",
  greenSoft: "#E5F2EB",
  red: "#C2403C",
  redSoft: "#F9E9E8",
  gold: "#DD9A2B",
  goldSoft: "#FBF1DE",
};

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

// ---------- One student: Ravi Teja, Class 6-A ----------
const STUDENT = {
  name: "Ravi Teja",
  cls: "Class 6 - A",
  roll: 14,
  father: "Prasad Rao",
  presentToday: true,
  daysPresent: 44,
  workingDays: 48,
};

const TIMETABLE = [
  { period: "1", time: "9:30",  subject: "Telugu",  teacher: "K. Saraswathi" },
  { period: "2", time: "10:20", subject: "English", teacher: "M. Joseph" },
  { period: "3", time: "11:10", subject: "Maths",   teacher: "B. Ramana" },
  { period: "4", time: "12:00", subject: "Science", teacher: "P. Aruna" },
  { period: "5", time: "1:40",  subject: "Social",  teacher: "D. Kiran" },
  { period: "6", time: "2:30",  subject: "Games",   teacher: "—" },
];

const initialHomework = [
  { id: 1, subject: "Telugu",  title: "Essay: \u0C2E\u0C28 \u0C0A\u0C30\u0C41 (My Village)", due: "Today",        status: "pending" },
  { id: 2, subject: "Maths",   title: "Worksheet 12: Fractions",                              due: "Tomorrow",     status: "pending" },
  { id: 3, subject: "Science", title: "Diagram: Parts of a flower",                           due: "Mon, 15 Jun",  status: "pending" },
  { id: 4, subject: "English", title: "Reading log: Chapter 4",                               due: "Submitted yesterday", status: "submitted" },
];

const MARKS = [
  { sub: "Telugu",  score: 16, avg: 13 },
  { sub: "English", score: 14, avg: 12 },
  { sub: "Maths",   score: 18, avg: 13 },
  { sub: "Science", score: 15, avg: 12 },
  { sub: "Social",  score: 17, avg: 14 },
];

const initialFees = [
  { id: 1, term: "Term 1", months: "Jun \u2013 Sep", gross: 5000, discount: 1000, discountLabel: "Sibling concession", status: "due", dueDate: "Due 15 Jun", date: null, rcpt: null },
  { id: 2, term: "Term 2", months: "Oct \u2013 Jan", gross: 4500, discount: 500, discountLabel: "Early-bird (pay by 30 Sep)", status: "upcoming", dueDate: "Due 15 Oct", date: null, rcpt: null },
  { id: 3, term: "Term 3", months: "Feb \u2013 Apr", gross: 4000, discount: 0, discountLabel: null, status: "upcoming", dueDate: "Due 15 Feb", date: null, rcpt: null },
];

const NOTICES = [
  { id: 1, text: "Quarterly exam timetable has been shared. Exams begin 22 June.", time: "2 days ago" },
  { id: 2, text: "School closed on 16 June for the local festival. Classes resume Wednesday.", time: "3 days ago" },
];

const initialThread = [
  { id: 1, from: "teacher", text: "Ravi is attentive in Maths. Please ensure the Telugu essay is submitted by tomorrow.", time: "Yesterday" },
];

// June 2026: 30 days, 1 Jun = Monday. Absent on 5 Jun. Sundays are holidays. Today = 12 Jun.
const JUNE = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1;
  const isSunday = d % 7 === 0; // 7, 14, 21, 28
  if (isSunday) return { d, s: "holiday" };
  if (d > 12) return { d, s: "future" };
  if (d === 5) return { d, s: "absent" };
  return { d, s: "present" };
});

function StampChip({ tone, children }) {
  const styles = {
    green: { background: C.greenSoft, color: C.green, borderColor: "#BFE0CF" },
    red:   { background: C.redSoft,   color: C.red,   borderColor: "#EDC6C4" },
    gold:  { background: C.goldSoft,  color: "#9A6B14", borderColor: "#EBD3A4" },
    ink:   { background: "#E8ECF4",   color: C.ink,   borderColor: "#C9D2E3" },
  }[tone];
  return (
    <span className="text-xs font-semibold px-2 py-1 rounded border uppercase tracking-wide shrink-0" style={styles}>
      {children}
    </span>
  );
}

export default function StudentApp() {
  const [tab, setTab] = useState("home");
  const [homework, setHomework] = useState(initialHomework);
  const [fees, setFees] = useState(initialFees);
  const [thread, setThread] = useState(initialThread);
  const [note, setNote] = useState("");
  const [toast, setToast] = useState(null);

  const ping = (msg) => {
    setToast(msg);
    window.clearTimeout(ping._t);
    ping._t = window.setTimeout(() => setToast(null), 2600);
  };

  // ---------- Live derived state ----------
  const pendingHW = useMemo(() => homework.filter((h) => h.status === "pending"), [homework]);
  const dueToday = pendingHW.find((h) => h.due === "Today");
  const payable = (f) => f.gross - f.discount;
  const feeDue = useMemo(() => fees.filter((f) => f.status === "due").reduce((a, f) => a + payable(f), 0), [fees]);
  const feePaid = useMemo(() => fees.filter((f) => f.status === "paid").reduce((a, f) => a + payable(f), 0), [fees]);
  const grossTotal = fees.reduce((a, f) => a + f.gross, 0);
  const discountTotal = fees.reduce((a, f) => a + f.discount, 0);
  const feeTotal = grossTotal - discountTotal;
  const dueTerm = fees.find((f) => f.status === "due");
  const attendancePct = Math.round((STUDENT.daysPresent / STUDENT.workingDays) * 100);
  const totalMarks = MARKS.reduce((a, m) => a + m.score, 0);

  // ---------- Actions ----------
  const submitHW = (id) => {
    const h = homework.find((x) => x.id === id);
    setHomework((prev) => prev.map((x) => (x.id === id ? { ...x, status: "submitted", due: "Submitted just now" } : x)));
    ping(`${h.subject} homework marked as submitted`);
  };

  const payFee = (id) => {
    const f = fees.find((x) => x.id === id);
    setFees((prev) => prev.map((x) => (x.id === id ? { ...x, status: "paid", date: "Paid just now", rcpt: "SV/" + (1400 + id) } : x)));
    ping(
      f.discount > 0
        ? `${f.term} paid \u2014 ${fmt(f.discount)} discount applied, receipt on WhatsApp`
        : `${f.term} paid via UPI \u2014 receipt sent on WhatsApp`
    );
  };

  const sendNote = () => {
    if (!note.trim()) return ping("Type a note first");
    setThread((prev) => [...prev, { id: Date.now(), from: "parent", text: note.trim(), time: "Just now" }]);
    setNote("");
    ping("Note sent to K. Saraswathi (Class Teacher)");
  };

  // ---------- Signature: AI digest for the parent, recomputes live ----------
  const digest = useMemo(() => {
    const lines = [];
    lines.push(`${STUDENT.name.split(" ")[0]} is present today \u2014 attendance is at ${attendancePct}% this term.`);
    if (pendingHW.length > 0) {
      lines.push(
        dueToday
          ? `${pendingHW.length} homework${pendingHW.length > 1 ? "s" : ""} pending \u2014 the ${dueToday.subject} ${dueToday.title.startsWith("Essay") ? "essay" : "work"} is due today.`
          : `${pendingHW.length} homework${pendingHW.length > 1 ? "s" : ""} pending \u2014 nearest is due ${pendingHW[0].due.toLowerCase()}.`
      );
    } else {
      lines.push("All homework submitted \u2014 nothing pending.");
    }
    lines.push(
      dueTerm
        ? `${dueTerm.term} fee of ${fmt(dueTerm.gross - dueTerm.discount)}${dueTerm.discount > 0 ? " (after discount)" : ""} is due by ${dueTerm.dueDate.replace("Due ", "")}.`
        : "All term fees are settled \u2014 receipts saved in the Fees tab."
    );
    lines.push("Latest result: 18/20 in the Maths slip test, well above the class average of 13.");
    let action = null;
    if (dueToday) action = "Suggested: 20 minutes this evening finishes the Telugu essay.";
    else if (dueTerm) action = `Suggested: clear ${dueTerm.term} via UPI \u2014 it takes a minute.`;
    else if (pendingHW.length > 0) action = "Suggested: a little time on the next homework keeps the week light.";
    else action = "All caught up \u2014 a quick revision of Science before Monday would be a bonus.";
    return { lines, action };
  }, [pendingHW, dueToday, feeDue, dueTerm, attendancePct]);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const tabs = [
    { id: "home",       label: "Home",       icon: LayoutDashboard },
    { id: "homework",   label: "Homework",   icon: BookOpen },
    { id: "marks",      label: "Marks",      icon: BarChart3 },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "fees",       label: "Fees",       icon: IndianRupee },
    { id: "notices",    label: "Notices",    icon: Bell },
  ];

  // ---------- Renderers ----------
  const renderHome = () => (
    <div className="space-y-4">
      {/* AI digest — the differentiator */}
      <div className="rounded-2xl p-4 text-sm leading-relaxed shadow-sm" style={{ background: C.inkDeep, color: "#E9EDF5" }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} style={{ color: C.gold }} />
          <span className="font-semibold tracking-wide text-xs uppercase" style={{ color: C.gold }}>
            Today's digest for {STUDENT.father}
          </span>
        </div>
        {digest.lines.map((l, i) => (
          <p key={i} className="mb-1">{l}</p>
        ))}
        <p className="mt-2 pt-2 text-xs border-t border-slate-600" style={{ color: "#C9D4E8" }}>{digest.action}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => setTab("attendance")} className="bg-white rounded-xl p-3 border border-stone-200 text-left">
          <div className="text-lg font-bold" style={{ color: C.green }}>{attendancePct}%</div>
          <div className="text-xs text-stone-500">Attendance</div>
        </button>
        <button onClick={() => setTab("homework")} className="bg-white rounded-xl p-3 border border-stone-200 text-left">
          <div className="text-lg font-bold" style={{ color: pendingHW.length > 0 ? C.gold : C.green }}>{pendingHW.length}</div>
          <div className="text-xs text-stone-500">HW pending</div>
        </button>
        <button onClick={() => setTab("fees")} className="bg-white rounded-xl p-3 border border-stone-200 text-left">
          <div className="text-lg font-bold" style={{ color: feeDue > 0 ? C.red : C.green }}>{feeDue > 0 ? fmt(feeDue) : "None"}</div>
          <div className="text-xs text-stone-500">Fee due</div>
        </button>
      </div>

      {/* Today's timetable */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-2">
          <Clock size={14} style={{ color: C.ink }} />
          <span className="text-sm font-semibold" style={{ color: C.ink }}>Today's periods</span>
        </div>
        {TIMETABLE.map((p) => (
          <div key={p.period} className="px-4 py-2 flex items-center gap-3 border-b border-stone-100">
            <span className="w-10 text-xs text-stone-400">{p.time}</span>
            <span className="text-sm font-medium flex-1" style={{ color: C.ink }}>{p.subject}</span>
            <span className="text-xs text-stone-400">{p.teacher}</span>
          </div>
        ))}
      </div>

      {/* Teacher note teaser */}
      <button onClick={() => setTab("notices")} className="w-full bg-white rounded-2xl border border-stone-200 px-4 py-3 flex items-center justify-between text-left">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide" style={{ color: C.gold }}>From the class teacher</div>
          <p className="text-sm mt-1 text-stone-600">"{initialThread[0].text}"</p>
        </div>
        <ChevronRight size={16} className="text-stone-400 shrink-0" />
      </button>
    </div>
  );

  const renderHomework = () => (
    <div className="space-y-3">
      {homework.map((h) => (
        <div key={h.id} className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-stone-400">{h.subject}</div>
              <div className="text-sm font-medium mt-1" style={{ color: C.ink }}>{h.title}</div>
              <div className="text-xs mt-1" style={{ color: h.status === "submitted" ? C.green : h.due === "Today" ? C.red : "#9A6B14" }}>
                {h.status === "submitted" ? h.due : `Due ${h.due.toLowerCase()}`}
              </div>
            </div>
            {h.status === "submitted" ? (
              <StampChip tone="green">Done</StampChip>
            ) : (
              <StampChip tone={h.due === "Today" ? "red" : "gold"}>{h.due === "Today" ? "Due today" : "Pending"}</StampChip>
            )}
          </div>
          {h.status === "pending" && (
            <button onClick={() => submitHW(h.id)} className="mt-3 text-xs font-semibold px-3 py-2 rounded-lg text-white" style={{ background: C.green }}>
              Mark as submitted
            </button>
          )}
        </div>
      ))}
      <p className="text-xs text-stone-400 text-center">Submit one — the digest on Home updates instantly.</p>
    </div>
  );

  const renderMarks = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold" style={{ color: C.ink }}>Formative Assessment 1</span>
          <StampChip tone="ink">Rank 4 of 32</StampChip>
        </div>
        <div className="text-2xl font-bold" style={{ color: C.ink }}>{totalMarks}<span className="text-sm font-normal text-stone-400">/100</span></div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-4">
        {MARKS.map((m) => (
          <div key={m.sub}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium" style={{ color: C.ink }}>{m.sub}</span>
              <span className="text-stone-500">{m.score}/20 <span className="text-xs text-stone-400">· class avg {m.avg}</span></span>
            </div>
            <div className="h-2 rounded-full bg-stone-100 overflow-hidden relative">
              <div className="h-full rounded-full" style={{ width: (m.score / 20) * 100 + "%", background: m.score >= m.avg ? C.green : C.gold }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-400 text-center">Mid-term results unlock here on 28 June.</p>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold" style={{ color: C.green }}>{attendancePct}%</div>
          <div className="text-xs text-stone-500">{STUDENT.daysPresent} of {STUDENT.workingDays} working days this term</div>
        </div>
        <StampChip tone="green">Present today</StampChip>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <div className="text-sm font-semibold mb-3" style={{ color: C.ink }}>June 2026</div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-stone-400 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          <div /> {/* 1 Jun 2026 is a Monday — one leading blank for Sunday */}
          {JUNE.map(({ d, s }) => {
            const style =
              s === "present" ? { background: C.greenSoft, color: C.green } :
              s === "absent"  ? { background: C.redSoft, color: C.red } :
              s === "holiday" ? { background: "#EFF1F5", color: "#9AA3B5" } :
                                { background: "white", color: "#C4C9D4", border: "1px solid #ECEEF2" };
            return (
              <div key={d} className="h-9 rounded-lg flex items-center justify-center text-xs font-semibold" style={style}>
                {d}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-stone-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: C.green }} /> Present</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: C.red }} /> Absent</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#9AA3B5" }} /> Holiday</span>
        </div>
      </div>
    </div>
  );

  const renderFees = () => {
    const pct = Math.round((feePaid / feeTotal) * 100);
    const balance = feeTotal - feePaid;
    return (
      <div className="space-y-4">
        {/* Annual summary with discount line */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4">
          <div className="text-sm font-semibold mb-3" style={{ color: C.ink }}>Annual fee · 2026–27</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-stone-500"><span>School fee (3 terms)</span><span>{fmt(grossTotal)}</span></div>
            <div className="flex justify-between" style={{ color: C.green }}><span>Discounts applied</span><span>− {fmt(discountTotal)}</span></div>
            <div className="flex justify-between font-semibold pt-1 border-t border-stone-100" style={{ color: C.ink }}><span>Net payable</span><span>{fmt(feeTotal)}</span></div>
          </div>
          <div className="h-2 rounded-full bg-stone-100 overflow-hidden mt-3">
            <div className="h-full rounded-full" style={{ width: pct + "%", background: C.green }} />
          </div>
          <div className="flex justify-between text-xs text-stone-500 mt-2">
            <span>Paid {fmt(feePaid)}</span>
            <span style={{ color: balance > 0 ? C.red : C.green }}>{balance > 0 ? `Balance ${fmt(balance)}` : "Fully paid"}</span>
          </div>
          <p className="text-xs text-stone-400 mt-2">Sibling concession — Divya (Class 8) studies here too.</p>
        </div>

        {/* Term-wise cards */}
        {fees.map((f) => {
          const net = f.gross - f.discount;
          return (
            <div key={f.id} className="bg-white rounded-2xl border border-stone-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold" style={{ color: C.ink }}>{f.term} <span className="text-stone-400 font-normal">· {f.months}</span></div>
                {f.status === "paid" ? <StampChip tone="green">Paid</StampChip> : f.status === "due" ? <StampChip tone="red">{f.dueDate}</StampChip> : <StampChip tone="ink">Upcoming</StampChip>}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-stone-500"><span>Term fee</span><span>{fmt(f.gross)}</span></div>
                {f.discount > 0 && (
                  <div className="flex justify-between" style={{ color: C.green }}><span>{f.discountLabel}</span><span>− {fmt(f.discount)}</span></div>
                )}
                <div className="flex justify-between font-semibold pt-1 border-t border-stone-100" style={{ color: C.ink }}><span>Payable</span><span>{fmt(net)}</span></div>
              </div>
              {f.status === "paid" && <div className="text-xs mt-2" style={{ color: C.green }}>{f.date} · Receipt {f.rcpt}</div>}
              {f.status === "due" && (
                <button onClick={() => payFee(f.id)} className="mt-3 w-full text-xs font-semibold px-3 py-2 rounded-lg text-white" style={{ background: C.green }}>
                  Pay {fmt(net)} via UPI
                </button>
              )}
              {f.status === "upcoming" && (
                <button onClick={() => payFee(f.id)} className="mt-3 text-xs font-semibold px-3 py-2 rounded-lg border" style={{ color: C.ink, borderColor: "#C9D2E3" }}>
                  Pay in advance{f.discount > 0 ? ` — lock ${fmt(f.discount)} discount` : ""}
                </button>
              )}
            </div>
          );
        })}
        <p className="text-xs text-stone-400 text-center">No office queue — pay from home, receipt lands on WhatsApp.</p>
      </div>
    );
  };

  const renderNotices = () => (
    <div className="space-y-4">
      <div className="text-xs font-bold uppercase tracking-wide text-stone-400">School notices</div>
      <div className="space-y-2">
        {NOTICES.map((n) => (
          <div key={n.id} className="bg-white rounded-2xl border border-stone-200 p-4">
            <p className="text-sm" style={{ color: C.ink }}>{n.text}</p>
            <div className="text-xs text-stone-400 mt-2">{n.time}</div>
          </div>
        ))}
      </div>

      <div className="text-xs font-bold uppercase tracking-wide text-stone-400">Class teacher · K. Saraswathi</div>
      <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
        {thread.map((m) => (
          <div key={m.id} className={m.from === "parent" ? "flex justify-end" : "flex justify-start"}>
            <div
              className="max-w-xs rounded-2xl px-3 py-2 text-sm"
              style={m.from === "parent" ? { background: C.greenSoft, color: C.ink } : { background: "#EFF1F5", color: C.ink }}
            >
              {m.text}
              <div className="text-xs text-stone-400 mt-1">{m.time}</div>
            </div>
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note to the teacher…"
            className="flex-1 text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none"
            style={{ color: C.ink }}
          />
          <button onClick={sendNote} className="px-3 rounded-lg text-white flex items-center" style={{ background: C.green }}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  // ---------- Shell ----------
  return (
    <div className="min-h-screen" style={{ background: C.paper, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* Letterhead with student identity */}
        <header className="px-4 pt-5 pb-4" style={{ background: C.ink }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.gold }}>Parent app</div>
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
                Sri Vidya High School
              </h1>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: C.gold, color: C.inkDeep }}>DEMO</span>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: "#243759" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: C.green }}>
              RT
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{STUDENT.name}</div>
              <div className="text-xs" style={{ color: "#AAB8D4" }}>{STUDENT.cls} · Roll {STUDENT.roll} · {today}</div>
            </div>
          </div>
        </header>

        {/* Tab bar */}
        <nav className="sticky top-0 z-10 bg-white border-b border-stone-200 flex overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium shrink-0 border-b-2"
                style={active ? { color: C.ink, borderColor: C.green } : { color: "#8C94A6", borderColor: "transparent" }}
              >
                <Icon size={18} />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 p-4 pb-16">
          {tab === "home" && renderHome()}
          {tab === "homework" && renderHomework()}
          {tab === "marks" && renderMarks()}
          {tab === "attendance" && renderAttendance()}
          {tab === "fees" && renderFees()}
          {tab === "notices" && renderNotices()}
          <p className="text-center text-xs text-stone-400 mt-8">
            Prototype with sample data — one student's complete world.
          </p>
        </main>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-xs w-auto px-4 py-2 rounded-full shadow-lg text-xs font-medium text-white text-center" style={{ background: C.inkDeep }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
