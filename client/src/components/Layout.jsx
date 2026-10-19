import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LayoutDashboard, Route, BriefcaseBusiness, ClipboardCheck, GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/assessment", label: "Career assessment", icon: ClipboardCheck },
  { to: "/roadmap", label: "My roadmap", icon: Route },
  { to: "/jobs", label: "Job tracker", icon: BriefcaseBusiness }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const signOut = () => { logout(); navigate("/login"); };
  const nav = <nav className="space-y-1">{links.map(({ to, label, icon: Icon, end }) => (
    <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}
      className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}>
      <Icon size={18}/>{label}
    </NavLink>
  ))}</nav>;

  return <div className="min-h-screen bg-[#f7f8fc] lg:flex">
    <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white p-5 lg:flex lg:flex-col">
      <Brand/>
      <p className="mb-3 mt-10 px-3 text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-400">Workspace</p>
      {nav}
      <div className="mt-auto rounded-2xl bg-violet-50 p-4">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600"><GraduationCap size={20}/></div>
        <p className="text-sm font-bold text-slate-800">Small steps add up.</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">Keep your roadmap moving and celebrate every milestone.</p>
      </div>
    </aside>
    {mobileOpen && <div className="fixed inset-0 z-50 bg-slate-950/30 lg:hidden" onClick={() => setMobileOpen(false)}>
      <aside className="h-full w-72 bg-white p-5" onClick={(e) => e.stopPropagation()}><div className="mb-8 flex items-center justify-between"><Brand/><button onClick={() => setMobileOpen(false)}><X/></button></div>{nav}</aside>
    </div>}
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-8">
        <div className="flex items-center gap-3"><button className="text-slate-500 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu/></button><div><p className="text-xs text-slate-400">Your personal workspace</p><p className="text-sm font-bold text-slate-800">Career growth hub</p></div></div>
        <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-bold text-slate-800">{user?.name}</p><p className="text-xs text-slate-400">{user?.targetRole || "Career explorer"}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">{user?.name?.slice(0,1)?.toUpperCase() || "S"}</div><button onClick={signOut} title="Log out" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800"><LogOut size={18}/></button></div>
      </header>
      <main className="mx-auto max-w-[1440px] p-4 md:p-8"><Outlet/></main>
    </div>
  </div>;
}
function Brand() { return <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200"><Route size={22}/></div><div><p className="text-lg font-black tracking-tight text-slate-900">SkillBridge<span className="text-violet-600">.</span></p><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Career, connected</p></div></div>; }
