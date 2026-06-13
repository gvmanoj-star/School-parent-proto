import { School, Users, ArrowRight } from "lucide-react";

const C = {
  ink: "#1C2B4A",
  inkDeep: "#14213A",
  paper: "#F5F6F2",
  green: "#1E7F4F",
  gold: "#DD9A2B",
};

export default function Landing({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10" style={{ background: C.paper, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style={{ background: C.ink }}>
            <School size={26} color="white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: C.ink, fontFamily: "ui-serif, Georgia, serif" }}>
            Sri Vidya High School
          </h1>
          <p className="text-sm text-stone-500 mt-1">Tagarapuvalasa, Visakhapatnam</p>
          <span className="inline-block mt-3 text-xs font-bold px-2 py-1 rounded" style={{ background: C.gold, color: C.inkDeep }}>
            PROTOTYPE — choose a view
          </span>
        </div>

        {/* Two cards */}
        <button
          onClick={() => onSelect("os")}
          className="w-full text-left bg-white rounded-2xl border border-stone-200 p-5 mb-4 flex items-center gap-4 transition active:scale-[0.99]"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#E8ECF4" }}>
            <School size={22} style={{ color: C.ink }} />
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold" style={{ color: C.ink }}>School Office</div>
            <div className="text-xs text-stone-500 mt-0.5">The owner's dashboard — fees, attendance, admissions, announcements for the whole school.</div>
          </div>
          <ArrowRight size={18} className="text-stone-400 shrink-0" />
        </button>

        <button
          onClick={() => onSelect("student")}
          className="w-full text-left bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4 transition active:scale-[0.99]"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#E5F2EB" }}>
            <Users size={22} style={{ color: C.green }} />
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold" style={{ color: C.ink }}>Parent App</div>
            <div className="text-xs text-stone-500 mt-0.5">What each parent sees — one child's attendance, homework, marks, fees and teacher notes.</div>
          </div>
          <ArrowRight size={18} className="text-stone-400 shrink-0" />
        </button>

        <p className="text-center text-xs text-stone-400 mt-8">
          Demo with sample data. Tap a card to explore — use the "Views" button to come back.
        </p>
      </div>
    </div>
  );
}
