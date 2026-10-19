import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, CheckCircle2, Circle, Clock3, Route, Sparkles } from "lucide-react";
import { api } from "../lib/api.js";
import { Card, Loading, PageTitle, Alert } from "../components/UI.jsx";

export default function Roadmap() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busyTask, setBusyTask] = useState("");
  useEffect(() => { api("/roadmap").then(setData).catch(e => setError(e.message)); }, []);
  const allTasks = useMemo(() => data?.roadmap?.flatMap(stage => stage.tasks.map((task, i) => ({ id: `${stage.id}-${i}`, task }))) || [], [data]);
  const completedCount = data?.completed?.length || 0;
  const progress = allTasks.length ? Math.round(completedCount / allTasks.length * 100) : 0;
  async function toggle(taskId) {
    if (busyTask) return;
    setBusyTask(taskId); setError("");
    const currentlyDone = data.completed.includes(taskId);
    setData(old => ({ ...old, completed: currentlyDone ? old.completed.filter(id => id !== taskId) : [...old.completed, taskId] }));
    try {
      const result = await api("/roadmap/progress", { method: "PATCH", body: JSON.stringify({ taskId, completed: !currentlyDone }) });
      setData(old => ({ ...old, completed: result.completed }));
    } catch (e) {
      setData(old => ({ ...old, completed: currentlyDone ? [...old.completed, taskId] : old.completed.filter(id => id !== taskId) }));
      setError(e.message);
    } finally { setBusyTask(""); }
  }
  if (!data && !error) return <Loading/>;
  return <div><PageTitle eyebrow="Your learning journey" title="Your skill roadmap" subtitle={`A practical path toward ${data?.targetRole || "your next role"}. Complete each task at your own pace.`}/>
    <Alert>{error}</Alert>
    <Card className="mb-6 overflow-hidden bg-[#191532] text-white"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-violet-200"><Sparkles size={14}/> YOUR PERSONAL PLAN</div><h2 className="text-2xl font-black">One step at a time.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Focus on consistency over speed. Mark tasks complete as you build confidence.</p></div><div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 border-violet-400/40 bg-white/5"><span className="text-2xl font-black">{progress}%</span><span className="text-[10px] font-bold text-slate-300">COMPLETE</span></div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-400 transition-all" style={{width:`${progress}%`}}/></div><p className="mt-2 text-xs text-slate-400">{completedCount} of {allTasks.length} tasks completed</p></Card>
    <div className="space-y-4">{data?.roadmap?.map((stage, index) => { const done = stage.tasks.filter((_, i) => data.completed.includes(`${stage.id}-${i}`)).length; return <Card key={stage.id}><div className="flex flex-col gap-4 sm:flex-row"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><BookOpen size={22}/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-extrabold uppercase tracking-[.15em] text-violet-600">PHASE {String(index+1).padStart(2,"0")} · {stage.category}</span><span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500"><Clock3 size={12}/>{stage.duration}</span></div><h2 className="mt-2 text-lg font-black text-slate-900">{stage.title}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{stage.description}</p><div className="mt-4 space-y-2">{stage.tasks.map((task, i) => { const id = `${stage.id}-${i}`; const checked = data.completed.includes(id); return <button key={id} onClick={() => toggle(id)} disabled={!!busyTask} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${checked ? "border-emerald-100 bg-emerald-50/60" : "border-slate-100 hover:border-violet-200 hover:bg-violet-50/40"}`}><span className={checked ? "text-emerald-600" : "text-slate-300"}>{checked ? <CheckCircle2 size={19}/> : <Circle size={19}/>}</span><span className={`flex-1 text-sm font-medium ${checked ? "text-slate-400 line-through" : "text-slate-700"}`}>{task}</span>{busyTask === id && <span className="text-xs text-slate-400">Saving…</span>}</button>;})}</div><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-xs text-slate-400">{done}/{stage.tasks.length} complete</span><span className="text-xs font-bold text-violet-600">{Math.round(done/stage.tasks.length*100)}%</span></div></div></div></Card>;})}</div>
  </div>;
}
