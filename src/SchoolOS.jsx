import { useState, useMemo } from "react";
import {
  LayoutDashboard, IndianRupee, CalendarCheck, Users, UserPlus,
  MessageSquare, Sparkles, Search, Phone, Send, CheckCircle2,
  AlertTriangle, ChevronRight, GraduationCap, TrendingUp, Bell
} from "lucide-react";

// ---------- Brand tokens (school letterhead world: ink navy, ledger green, red pen, marigold) ----------
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

// ---------- Sample data: 28 students, Classes 6–10 ----------
const initialStudents = [
  { id: 1,  name: "Anjali Reddy",      cls: 6,  father: "Suresh Reddy",     phone: "98481 23410", total: 12000, paid: 12000, present: true,  overdue: false },
  { id: 2,  name: "Ravi Teja",         cls: 6,  father: "Prasad Rao",       phone: "98481 23411", total: 12000, paid: 8000,  present: true,  overdue: false },
  { id: 3,  name: "Sai Kumar",         cls: 6,  father: "Venkata Rao",      phone: "98481 23412", total: 12000, paid: 12000, present: true,  overdue: false },
  { id: 4,  name: "Pavani Naidu",      cls: 6,  father: "Appala Naidu",     phone: "98481 23413", total: 12000, paid: 4000,  present: false, overdue: true  },
  { id: 5,  name: "Harsha Vardhan",    cls: 6,  father: "Mohan Krishna",    phone: "98481 23414", total: 12000, paid: 12000, present: true,  overdue: false },
  { id: 6,  name: "Lakshmi Prasanna",  cls: 6,  father: "Srinivasa Rao",    phone: "98481 23415", total: 12000, paid: 8000,  present: true,  overdue: false },
  { id: 7,  name: "Karthik Varma",     cls: 7,  father: "Ranga Varma",      phone: "98481 23416", total: 12000, paid: 12000, present: true,  overdue: false },
  { id: 8,  name: "Divya Sri",         cls: 7,  father: "Ramesh Babu",      phone: "98481 23417", total: 12000, paid: 12000, present: true,  overdue: false },
  { id: 9,  name: "Nikhil Rao",        cls: 7,  father: "Krishna Rao",      phone: "98481 23418", total: 12000, paid: 6000,  present: true,  overdue: true  },
  { id: 10, name: "Sravani Devi",      cls: 7,  father: "Durga Prasad",     phone: "98481 23419", total: 12000, paid: 12000, present: false, overdue: false },
  { id: 11, name: "Manikanta",         cls: 7,  father: "Simhachalam",      phone: "98481 23420", total: 12000, paid: 8000,  present: true,  overdue: false },
  { id: 12, name: "Bhavana Reddy",     cls: 8,  father: "Janardhan Reddy",  phone: "98481 23421", total: 14000, paid: 14000, present: true,  overdue: false },
  { id: 13, name: "Charan Naidu",      cls: 8,  father: "Gopala Naidu",     phone: "98481 23422", total: 14000, paid: 9000,  present: true,  overdue: false },
  { id: 14, name: "Mounika",           cls: 8,  father: "Satyanarayana",    phone: "98481 23423", total: 14000, paid: 14000, present: true,  overdue: false },
  { id: 15, name: "Vamsi Krishna",     cls: 8,  father: "Siva Kumar",       phone: "98481 23424", total: 14000, paid: 5000,  present: false, overdue: true  },
  { id: 16, name: "Tejaswini",         cls: 8,  father: "Ravi Shankar",     phone: "98481 23425", total: 14000, paid: 14000, present: true,  overdue: false },
  { id: 17, name: "Aditya Varma",      cls: 8,  father: "Surya Rao",        phone: "98481 23426", total: 14000, paid: 14000, present: true,  overdue: false },
  { id: 18, name: "Akhil Kumar",       cls: 9,  father: "Anand Kumar",      phone: "98481 23427", total: 14000, paid: 14000, present: true,  overdue: false },
  { id: 19, name: "Sindhu Priya",      cls: 9,  father: "Veera Raju",       phone: "98481 23428", total: 14000, paid: 9500,  present: true,  overdue: false },
  { id: 20, name: "Rohith Naidu",      cls: 9,  father: "Bangaru Naidu",    phone: "98481 23429", total: 14000, paid: 14000, present: true,  overdue: false },
  { id: 21, name: "Keerthana",         cls: 9,  father: "Subba Rao",        phone: "98481 23430", total: 14000, paid: 14000, present: true,  overdue: false },
  { id: 22, name: "Surya Prakash",     cls: 9,  father: "Eswara Rao",       phone: "98481 23431", total: 14000, paid: 7000,  present: true,  overdue: true  },
  { id: 23, name: "Swathi Rani",       cls: 9,  father: "Naga Raju",        phone: "98481 23432", total: 14000, paid: 14000, present: false, overdue: false },
  { id: 24, name: "Hemanth Reddy",     cls: 10, father: "Bhaskar Reddy",    phone: "98481 23433", total: 16000, paid: 16000, present: true,  overdue: false },
  { id: 25, name: "Niharika",          cls: 10, father: "Trinadha Rao",     phone: "98481 23434", total: 16000, paid: 11000, present: true,  overdue: false },
  { id: 26, name: "Praveen Kumar",     cls: 10, father: "Yerra Naidu",      phone: "98481 23435", total: 16000, paid: 16000, present: true,  overdue: false },
  { id: 27, name: "Sahithi",           cls: 10, father: "Chandra Sekhar",   phone: "98481 23436", total: 16000, paid: 16000, present: true,  overdue: false },
  { id: 28, name: "Yashwanth",         cls: 10, father: "Dharma Rao",       phone: "98481 23437", total: 16000, paid: 10000, present: true,  overdue: true  },
];

const initialEnquiries = [
  { id: 1, child: "Jaswanth",  cls: "Class 6", parent: "Ramesh Naidu",  phone: "98661 40021", source: "WhatsApp ad",     stage: "enquiry",  date: "Today" },
  { id: 2, child: "Hansika",   cls: "Class 8", parent: "Padma Lakshmi", phone: "98661 40022", source: "Parent referral", stage: "enquiry",  date: "Yesterday" },
  { id: 3, child: "Dinesh",    cls: "Class 7", parent: "Kondala Rao",   phone: "98661 40023", source: "Walk-in",         stage: "visited",  date: "9 Jun" },
  { id: 4, child: "Akshaya",   cls: "Class 6", parent: "Rama Devi",     phone: "98661 40024", source: "Parent referral", stage: "visited",  date: "8 Jun" },
  { id: 5, child: "Meghana",   cls: "Class 6", parent: "Srinu Babu",    phone: "98661 40025", source: "Parent referral", stage: "admitted", date: "5 Jun" },
  { id: 6, child: "Pawan Sai", cls: "Class 9", parent: "Gangadhar",     phone: "98661 40026", source: "WhatsApp ad",     stage: "admitted", date: "2 Jun" },
];

const initialMessages = [
  { id: 1, text: "Quarterly exam timetable has been shared. Exams begin 22 June. Please ensure regular attendance.", audience: "All parents", count: 28, time: "2 days ago" },
  { id: 2, text: "Gentle reminder: Term 1 fee balance is due by 15 June. Pay at the school office or via UPI.", audience: "Fee-due parents", count: 11, time: "5 days ago" },
];

const CLASSES = [6, 7, 8, 9, 10];

// ---------- Small building blocks ----------
function Avatar({ name }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: C.ink }}>
      {initials}
    </div>
  );
}

function StampChip({ tone, children }) {
  const styles = {
    green: { background: C.greenSoft, color: C.green, borderColor: "#BFE0CF" },
    red:   { background: C.redSoft,   color: C.red,   borderColor: "#EDC6C4" },
    gold:  { background: C.goldSoft,  color: "#9A6B14", borderColor: "#EBD3A4" },
    ink:   { background: "#E8ECF4",   color: C.ink,   borderColor: "#C9D2E3" },
  }[tone];
  return (
    <span className="text-xs font-semibold px-2 py-1 rounded border uppercase tracking-wide" style={styles}>
      {children}
    </span>
  );
}

export default function SchoolOS() {
  const [tab, setTab] = useState("home");
  const [students, setStudents] = useState(initialStudents);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [messages, setMessages] = useState(initialMessages);
  const [toast, setToast] = useState(null);
  const [attClass, setAttClass] = useState(6);
  const [feeFilter, setFeeFilter] = useState("pending");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [audience, setAudience] = useState("All parents");

  const ping = (msg) => {
    setToast(msg);
    window.clearTimeout(ping._t);
    ping._t = window.setTimeout(() => setToast(null), 2600);
  };

  // ---------- Live derived numbers (the whole app recomputes from these) ----------
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const presentCount = students.filter((s) => s.present).length;
    const absentees = students.filter((s) => !s.present);
    const totalFees = students.reduce((a, s) => a + s.total, 0);
    const collected = students.reduce((a, s) => a + s.paid, 0);
    const pendingList = students.filter((s) => s.paid < s.total);
    const pendingTotal = pendingList.reduce((a, s) => a + (s.total - s.paid), 0);
    const overdueList = pendingList.filter((s) => s.overdue).sort((a, b) => (b.total - b.paid) - (a.total - a.paid));

    const absentByClass = {};
    absentees.forEach((s) => { absentByClass[s.cls] = (absentByClass[s.cls] || 0) + 1; });
    let topAbsentClass = null, topAbsentN = 0;
    Object.entries(absentByClass).forEach(([k, v]) => { if (v > topAbsentN) { topAbsentN = v; topAbsentClass = k; } });

    const newEnquiries = enquiries.filter((e) => e.stage === "enquiry").length;

    return { totalStudents, presentCount, absentees, totalFees, collected, pendingList, pendingTotal, overdueList, topAbsentClass, newEnquiries };
  }, [students, enquiries]);

  // ---------- Actions ----------
  const toggleAttendance = (id) =>
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s)));

  const collectFee = (id) => {
    const s = students.find((x) => x.id === id);
    const balance = s.total - s.paid;
    setStudents((prev) => prev.map((x) => (x.id === id ? { ...x, paid: x.total, overdue: false } : x)));
    ping(`Recorded ${fmt(balance)} from ${s.name} — receipt sent on WhatsApp`);
  };

  const remind = (s) => ping(`Fee reminder sent to ${s.father} on WhatsApp`);

  const notifyAbsent = () => {
    if (stats.absentees.length === 0) return ping("No absentees today — full house!");
    ping(`Absence alert sent to ${stats.absentees.length} parents on WhatsApp`);
  };

  const advanceEnquiry = (id) => {
    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (e.stage === "enquiry") { ping(`${e.child} marked as visited`); return { ...e, stage: "visited" }; }
        if (e.stage === "visited") { ping(`${e.child} admitted to ${e.cls}`); return { ...e, stage: "admitted" }; }
        return e;
      })
    );
  };

  const audienceCount = (a) => {
    if (a === "All parents") return stats.totalStudents;
    if (a === "Fee-due parents") return stats.pendingList.length;
    const n = parseInt(a.replace("Class ", ""), 10);
    return students.filter((s) => s.cls === n).length;
  };

  const sendMessage = () => {
    if (!draft.trim()) return ping("Type a message first");
    const count = audienceCount(audience);
    setMessages((prev) => [{ id: Date.now(), text: draft.trim(), audience, count, time: "Just now" }, ...prev]);
    setDraft("");
    ping(`Sent to ${count} parents via WhatsApp & SMS`);
  };

  // ---------- Signature element: the live morning briefing ----------
  const briefing = useMemo(() => {
    const lines = [];
    const absentN = stats.absentees.length;
    lines.push(
      absentN === 0
        ? "Full attendance today — all students present."
        : `${absentN} student${absentN > 1 ? "s" : ""} absent today${stats.topAbsentClass ? ` (most in Class ${stats.topAbsentClass})` : ""}.`
    );
    if (stats.pendingTotal > 0) {
      lines.push(`${fmt(stats.pendingTotal)} in fees pending from ${stats.pendingList.length} students — ${stats.overdueList.length} past due.`);
    } else {
      lines.push("All fees collected. Nothing pending.");
    }
    if (stats.newEnquiries > 0) lines.push(`${stats.newEnquiries} new admission enquir${stats.newEnquiries > 1 ? "ies" : "y"} waiting for follow-up.`);
    let action = null;
    if (stats.overdueList.length > 0) action = `Suggested: send reminders to the ${stats.overdueList.length} overdue parents before the weekend.`;
    else if (stats.newEnquiries > 0) action = "Suggested: call the new enquiries today — referrals convert fastest within 48 hours.";
    return { lines, action };
  }, [stats]);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const tabs = [
    { id: "home",       label: "Home",       icon: LayoutDashboard },
    { id: "fees",       label: "Fees",       icon: IndianRupee },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "admissions", label: "Admissions", icon: UserPlus },
    { id: "students",   label: "Students",   icon: Users },
    { id: "messages",   label: "Messages",   icon: MessageSquare },
  ];

  // ---------- Tab renderers ----------
  const renderHome = () => (
    <div className="space-y-4">
      {/* Morning briefing — recomputes live as you act anywhere in the app */}
      <div className="rounded-2xl p-4 text-sm leading-relaxed shadow-sm" style={{ background: C.inkDeep, color: "#E9EDF5" }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} style={{ color: C.gold }} />
          <span className="font-semibold tracking-wide text-xs uppercase" style={{ color: C.gold }}>Morning briefing — auto-generated</span>
        </div>
        {briefing.lines.map((l, i) => (
          <p key={i} className="mb-1">{l}</p>
        ))}
        {briefing.action && (
          <p className="mt-2 pt-2 text-xs border-t border-slate-600" style={{ color: "#C9D4E8" }}>{briefing.action}</p>
        )}
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-stone-200">
          <div className="flex items-center gap-2 text-stone-500 text-xs mb-1"><GraduationCap size={14} /> Students</div>
          <div className="text-2xl font-bold" style={{ color: C.ink }}>{stats.totalStudents}</div>
          <div className="text-xs text-stone-400">Classes 6–10</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200">
          <div className="flex items-center gap-2 text-stone-500 text-xs mb-1"><CalendarCheck size={14} /> Attendance</div>
          <div className="text-2xl font-bold" style={{ color: C.green }}>{Math.round((stats.presentCount / stats.totalStudents) * 100)}%</div>
          <div className="text-xs text-stone-400">{stats.presentCount}/{stats.totalStudents} present</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200">
          <div className="flex items-center gap-2 text-stone-500 text-xs mb-1"><TrendingUp size={14} /> Fees collected</div>
          <div className="text-2xl font-bold" style={{ color: C.ink }}>{Math.round((stats.collected / stats.totalFees) * 100)}%</div>
          <div className="text-xs text-stone-400">{fmt(stats.collected)} of {fmt(stats.totalFees)}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-stone-200">
          <div className="flex items-center gap-2 text-stone-500 text-xs mb-1"><AlertTriangle size={14} /> Pending dues</div>
          <div className="text-2xl font-bold" style={{ color: stats.pendingTotal > 0 ? C.red : C.green }}>{fmt(stats.pendingTotal)}</div>
          <div className="text-xs text-stone-400">{stats.pendingList.length} students</div>
        </div>
      </div>

      {/* Needs attention */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-2">
          <Bell size={14} style={{ color: C.red }} />
          <span className="text-sm font-semibold" style={{ color: C.ink }}>Needs attention</span>
        </div>
        {stats.overdueList.slice(0, 3).map((s) => (
          <div key={s.id} className="px-4 py-3 flex items-center justify-between border-b border-stone-100">
            <div>
              <div className="text-sm font-medium" style={{ color: C.ink }}>{s.name} <span className="text-stone-400 font-normal">· Class {s.cls}</span></div>
              <div className="text-xs font-semibold" style={{ color: C.red }}>{fmt(s.total - s.paid)} overdue</div>
            </div>
            <button onClick={() => remind(s)} className="text-xs font-semibold px-3 py-2 rounded-lg border" style={{ color: C.ink, borderColor: "#C9D2E3" }}>
              Remind
            </button>
          </div>
        ))}
        {stats.overdueList.length === 0 && (
          <div className="px-4 py-4 text-sm text-stone-500">No overdue fees. All clear.</div>
        )}
        <button onClick={() => setTab("attendance")} className="w-full px-4 py-3 flex items-center justify-between text-sm" style={{ color: C.ink }}>
          <span>{stats.absentees.length} absent today — view attendance</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const feeRows = useMemo(() => {
    if (feeFilter === "pending") return students.filter((s) => s.paid < s.total);
    if (feeFilter === "paid") return students.filter((s) => s.paid >= s.total);
    return students;
  }, [students, feeFilter]);

  const renderFees = () => {
    const pct = Math.round((stats.collected / stats.totalFees) * 100);
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold" style={{ color: C.ink }}>Term 1 collection</span>
            <span className="text-stone-500">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: pct + "%", background: C.green }} />
          </div>
          <div className="flex justify-between text-xs text-stone-500 mt-2">
            <span>Collected {fmt(stats.collected)}</span>
            <span style={{ color: C.red }}>Pending {fmt(stats.pendingTotal)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {[
            { id: "pending", label: `Pending (${stats.pendingList.length})` },
            { id: "paid", label: `Paid (${stats.totalStudents - stats.pendingList.length})` },
            { id: "all", label: "All" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFeeFilter(f.id)}
              className="text-xs font-semibold px-3 py-2 rounded-full border"
              style={feeFilter === f.id ? { background: C.ink, color: "white", borderColor: C.ink } : { background: "white", color: C.ink, borderColor: "#D6DAE3" }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          {feeRows.map((s) => {
            const balance = s.total - s.paid;
            const isPaid = balance <= 0;
            return (
              <div key={s.id} className="px-4 py-3 border-b border-stone-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium" style={{ color: C.ink }}>{s.name} <span className="text-stone-400 font-normal">· Class {s.cls}</span></div>
                    <div className="text-xs text-stone-500">{fmt(s.paid)} of {fmt(s.total)} paid</div>
                  </div>
                  {isPaid ? (
                    <StampChip tone="green">Paid</StampChip>
                  ) : (
                    <StampChip tone={s.overdue ? "red" : "gold"}>{s.overdue ? "Overdue" : "Due"}</StampChip>
                  )}
                </div>
                {!isPaid && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => collectFee(s.id)} className="text-xs font-semibold px-3 py-2 rounded-lg text-white" style={{ background: C.green }}>
                      Collect {fmt(balance)}
                    </button>
                    <button onClick={() => remind(s)} className="text-xs font-semibold px-3 py-2 rounded-lg border" style={{ color: C.ink, borderColor: "#C9D2E3" }}>
                      Remind on WhatsApp
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {feeRows.length === 0 && <div className="px-4 py-6 text-sm text-stone-500 text-center">Nothing here.</div>}
        </div>
      </div>
    );
  };

  const renderAttendance = () => {
    const inClass = students.filter((s) => s.cls === attClass);
    const presentN = inClass.filter((s) => s.present).length;
    return (
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => setAttClass(c)}
              className="text-xs font-semibold px-4 py-2 rounded-full border shrink-0"
              style={attClass === c ? { background: C.ink, color: "white", borderColor: C.ink } : { background: "white", color: C.ink, borderColor: "#D6DAE3" }}
            >
              Class {c}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold" style={{ color: C.ink }}>
            {presentN}/{inClass.length} present · {today.split(",")[0]}
          </div>
          <button onClick={notifyAbsent} className="text-xs font-semibold px-3 py-2 rounded-lg border" style={{ color: C.ink, borderColor: "#C9D2E3" }}>
            Alert absent parents
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          {inClass.map((s) => (
            <div key={s.id} className="px-4 py-3 flex items-center justify-between border-b border-stone-100">
              <div className="flex items-center gap-3">
                <Avatar name={s.name} />
                <div>
                  <div className="text-sm font-medium" style={{ color: C.ink }}>{s.name}</div>
                  <div className="text-xs text-stone-400">s/o {s.father}</div>
                </div>
              </div>
              <button
                onClick={() => toggleAttendance(s.id)}
                className="text-xs font-bold px-3 py-2 rounded-lg border w-20"
                style={s.present
                  ? { background: C.greenSoft, color: C.green, borderColor: "#BFE0CF" }
                  : { background: C.redSoft, color: C.red, borderColor: "#EDC6C4" }}
              >
                {s.present ? "Present" : "Absent"}
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 text-center">Tap a student to mark — the briefing on Home updates instantly.</p>
      </div>
    );
  };

  const renderAdmissions = () => {
    const stages = [
      { id: "enquiry", label: "New enquiries", tone: "gold" },
      { id: "visited", label: "Visited school", tone: "ink" },
      { id: "admitted", label: "Admitted", tone: "green" },
    ];
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {stages.map((st) => (
            <div key={st.id} className="bg-white rounded-xl border border-stone-200 p-3 text-center">
              <div className="text-xl font-bold" style={{ color: C.ink }}>{enquiries.filter((e) => e.stage === st.id).length}</div>
              <div className="text-xs text-stone-500 leading-tight">{st.label}</div>
            </div>
          ))}
        </div>

        {stages.map((st) => {
          const list = enquiries.filter((e) => e.stage === st.id);
          if (list.length === 0) return null;
          return (
            <div key={st.id}>
              <div className="text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">{st.label}</div>
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                {list.map((e) => (
                  <div key={e.id} className="px-4 py-3 border-b border-stone-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium" style={{ color: C.ink }}>{e.child} <span className="text-stone-400 font-normal">· seeking {e.cls}</span></div>
                        <div className="text-xs text-stone-500">{e.parent} · {e.phone}</div>
                      </div>
                      <StampChip tone={st.tone}>{e.source === "Parent referral" ? "Referral" : e.source === "WhatsApp ad" ? "WhatsApp" : "Walk-in"}</StampChip>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-stone-400">{e.date}</span>
                      {e.stage !== "admitted" ? (
                        <button onClick={() => advanceEnquiry(e.id)} className="text-xs font-semibold px-3 py-2 rounded-lg text-white" style={{ background: C.ink }}>
                          {e.stage === "enquiry" ? "Mark visited" : "Confirm admission"}
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.green }}>
                          <CheckCircle2 size={14} /> Joined
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <p className="text-xs text-stone-400 text-center">Every enquiry captured — none lost in a notebook.</p>
      </div>
    );
  };

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q) || s.father.toLowerCase().includes(q) || String(s.cls) === q);
  }, [students, query]);

  const renderStudents = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-stone-200 px-3 py-2 flex items-center gap-2">
        <Search size={16} className="text-stone-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, father's name, or class"
          className="w-full text-sm outline-none bg-transparent"
          style={{ color: C.ink }}
        />
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {filteredStudents.map((s) => (
          <div key={s.id} className="px-4 py-3 flex items-center justify-between border-b border-stone-100">
            <div className="flex items-center gap-3">
              <Avatar name={s.name} />
              <div>
                <div className="text-sm font-medium" style={{ color: C.ink }}>{s.name} <span className="text-stone-400 font-normal">· Class {s.cls}</span></div>
                <div className="text-xs text-stone-500 flex items-center gap-1"><Phone size={11} /> {s.father} · {s.phone}</div>
              </div>
            </div>
            {s.paid >= s.total
              ? <span className="w-2 h-2 rounded-full shrink-0" style={{ background: C.green }} />
              : <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.overdue ? C.red : C.gold }} />}
          </div>
        ))}
        {filteredStudents.length === 0 && <div className="px-4 py-6 text-sm text-stone-500 text-center">No student matches "{query}".</div>}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
        <div className="text-sm font-semibold" style={{ color: C.ink }}>Send to parents</div>
        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white"
          style={{ color: C.ink }}
        >
          {["All parents", "Fee-due parents", ...CLASSES.map((c) => `Class ${c}`)].map((a) => (
            <option key={a} value={a}>{a} ({audienceCount(a)})</option>
          ))}
        </select>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="e.g. School closed tomorrow for Bonalu. Classes resume Monday."
          className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 outline-none resize-none"
          style={{ color: C.ink }}
        />
        <button onClick={sendMessage} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white rounded-lg py-3" style={{ background: C.green }}>
          <Send size={15} /> Send via WhatsApp & SMS
        </button>
      </div>

      <div className="text-xs font-bold uppercase tracking-wide text-stone-400">Sent</div>
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-stone-200 p-4">
            <p className="text-sm mb-2" style={{ color: C.ink }}>{m.text}</p>
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>{m.audience} · delivered to {m.count}</span>
              <span>{m.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ---------- Shell ----------
  return (
    <div className="min-h-screen" style={{ background: C.paper, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* Letterhead */}
        <header className="px-4 pt-5 pb-4" style={{ background: C.ink }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
                Sri Vidya High School
              </h1>
              <p className="text-xs" style={{ color: "#AAB8D4" }}>Tagarapuvalasa, Visakhapatnam · Classes 6–10</p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: C.gold, color: C.inkDeep }}>DEMO</span>
          </div>
          <p className="text-xs mt-2" style={{ color: "#AAB8D4" }}>{today}</p>
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
          {tab === "fees" && renderFees()}
          {tab === "attendance" && renderAttendance()}
          {tab === "admissions" && renderAdmissions()}
          {tab === "students" && renderStudents()}
          {tab === "messages" && renderMessages()}
          <p className="text-center text-xs text-stone-400 mt-8">
            Prototype with sample data — every number is live and tappable.
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
