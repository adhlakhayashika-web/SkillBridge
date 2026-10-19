import { useEffect, useState } from "react";
import { Check, Compass, Sparkles } from "lucide-react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Alert, Button, Card, PageTitle, SelectField } from "../components/UI.jsx";

const interests = [
  { name: "Frontend Development", description: "Build accessible, interactive web experiences", icon: "✳" },
  { name: "Backend Development", description: "Design APIs, systems and reliable services", icon: "⌘" },
  { name: "Data Analytics", description: "Turn data into useful insights and decisions", icon: "▥" },
  { name: "AI / Machine Learning", description: "Build intelligent models and AI-powered tools", icon: "✧" },
  { name: "UI/UX Design", description: "Research user needs and design useful products", icon: "◈" }
];
export default function Assessment() {
  const { user, setUser } = useAuth();
  const [selected, setSelected] = useState(user?.assessment?.interests || []);
  const [experience, setExperience] = useState(user?.assessment?.experience || "Beginner");
  const [goal, setGoal] = useState(user?.assessment?.goal || "Get job-ready");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (user?.assessment?.interests?.length) setSelected(user.assessment.interests); }, [user]);
  function toggle(name) { setSelected(old => old.includes(name) ? old.filter(x => x !== name) : [...old, name]); }
  async function submit(e) {
    e.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try {
      const data = await api("/assessment", { method: "POST", body: JSON.stringify({ interests: selected, experience, goal }) });
      setMessage(`${data.message} Your suggested direction is ${data.targetRole}.`);
      setUser(old => ({ ...old, targetRole: data.targetRole, assessment: data.assessment }));
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div><PageTitle eyebrow="Know your direction" title="Career assessment" subtitle="Tell us what energizes you. We'll save your interests and suggest a starting career direction."/>
    <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[1.4fr_.7fr]">
      <Card><div className="mb-5"><h2 className="font-extrabold text-slate-900">What would you like to explore?</h2><p className="mt-1 text-sm text-slate-500">Select one or more areas that interest you.</p></div><div className="grid gap-3 sm:grid-cols-2">{interests.map(item => { const active = selected.includes(item.name); return <button type="button" key={item.name} onClick={() => toggle(item.name)} aria-pressed={active} className={`relative rounded-2xl border p-4 text-left transition ${active ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100" : "border-slate-200 hover:border-violet-200 hover:bg-slate-50"}`}><div className="mb-4 flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl text-violet-600 shadow-sm">{item.icon}</span>{active && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white"><Check size={14}/></span>}</div><p className="text-sm font-extrabold text-slate-800">{item.name}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p></button>;})}</div></Card>
      <div className="space-y-5"><Card><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><Compass size={22}/></div><h2 className="font-extrabold text-slate-900">Your starting point</h2><p className="mb-5 mt-1 text-sm text-slate-500">No wrong answers. This helps us personalize your direction.</p><div className="space-y-4"><SelectField label="Current experience" value={experience} onChange={e => setExperience(e.target.value)}><option>Beginner</option><option>Some experience</option><option>Intermediate</option><option>Advanced</option></SelectField><SelectField label="Main goal" value={goal} onChange={e => setGoal(e.target.value)}><option>Get job-ready</option><option>Switch careers</option><option>Build a portfolio</option><option>Explore my interests</option></SelectField></div></Card>
      <Card className="bg-[#191532] text-white"><Sparkles className="mb-3 text-violet-300" size={22}/><h3 className="font-extrabold">Your next step starts with clarity.</h3><p className="mt-2 text-sm leading-6 text-slate-300">Your first selected interest will be used as your suggested role. You can change your choices anytime.</p><Alert type="success">{message}</Alert><Alert>{error}</Alert><Button className="mt-4 w-full" disabled={busy || selected.length === 0}>{busy ? "Saving profile…" : "Save my career profile"}</Button></Card></div>
    </form>
  </div>;
}
