import { useEffect, useState } from "react";
import { BriefcaseBusiness, ExternalLink, MapPin, Plus, Search, Trash2, X } from "lucide-react";
import { api } from "../lib/api.js";
import { Alert, Button, Card, Field, PageTitle, SelectField } from "../components/UI.jsx";
import { Status } from "./Dashboard.jsx";

const statuses = ["Wishlist", "Applied", "Interview", "Offer", "Rejected"];
const emptyForm = { company: "", role: "", status: "Wishlist", location: "", link: "", notes: "" };
export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() { try { const data = await api("/jobs"); setJobs(data.jobs); } catch (e) { setError(e.message); } }
  useEffect(() => { load(); }, []);
  const filtered = jobs.filter(job => (filter === "All" || job.status === filter) && `${job.company} ${job.role} ${job.location}`.toLowerCase().includes(search.toLowerCase()));
  function change(e) { setForm(old => ({ ...old, [e.target.name]: e.target.value })); }
  async function add(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { const data = await api("/jobs", { method: "POST", body: JSON.stringify(form) }); setJobs(old => [data.job, ...old]); setForm(emptyForm); setShowForm(false); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function updateStatus(id, status) {
    try { const data = await api(`/jobs/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); setJobs(old => old.map(job => job._id === id ? data.job : job)); }
    catch (e) { setError(e.message); }
  }
  async function remove(id) {
    if (!window.confirm("Delete this job application?")) return;
    try { await api(`/jobs/${id}`, { method: "DELETE" }); setJobs(old => old.filter(job => job._id !== id)); }
    catch (e) { setError(e.message); }
  }
  const counts = statuses.map(status => ({ status, count: jobs.filter(job => job.status === status).length }));
  return <div><PageTitle eyebrow="Stay organized, stay ready" title="Job application tracker" subtitle="Keep all your opportunities in one place, from the first bookmark to the final offer." action={<Button onClick={() => setShowForm(v => !v)}><Plus size={17}/>{showForm ? "Close form" : "Add application"}</Button>}/>
    <Alert>{error}</Alert>
    {showForm && <Card className="mb-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-extrabold text-slate-900">New application</h2><p className="mt-1 text-sm text-slate-500">Add the details you want to remember.</p></div><button onClick={() => setShowForm(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close form"><X size={18}/></button></div><form onSubmit={add} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Company *" name="company" placeholder="e.g. Microsoft" value={form.company} onChange={change} required/><Field label="Job role *" name="role" placeholder="e.g. Software Engineer Intern" value={form.role} onChange={change} required/><SelectField label="Status" name="status" value={form.status} onChange={change}>{statuses.map(s => <option key={s}>{s}</option>)}</SelectField><Field label="Location" name="location" placeholder="Remote / Bengaluru" value={form.location} onChange={change}/><Field label="Job link" name="link" type="url" placeholder="https://…" value={form.link} onChange={change}/><Field label="Notes" name="notes" placeholder="Referral, deadline, contact…" value={form.notes} onChange={change}/><div className="sm:col-span-2 lg:col-span-3"><Button disabled={busy}>{busy ? "Saving…" : "Save application"}</Button></div></form></Card>}
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{counts.map(item => <button key={item.status} onClick={() => setFilter(filter === item.status ? "All" : item.status)} className={`rounded-2xl border p-4 text-left transition ${filter === item.status ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-200"}`}><p className="text-xs font-bold text-slate-500">{item.status}</p><p className="mt-2 text-2xl font-black text-slate-900">{item.count}</p></button>)}</div>
    <Card><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-extrabold text-slate-900">Your opportunities <span className="ml-1 text-sm font-semibold text-slate-400">({filtered.length})</span></h2><p className="mt-1 text-xs text-slate-500">Update statuses as your applications progress.</p></div><div className="relative sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company or role…" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"/></div></div>
      {!filtered.length ? <div className="py-12 text-center"><BriefcaseBusiness className="mx-auto mb-3 text-slate-300" size={30}/><p className="font-bold text-slate-700">{jobs.length ? "No matching applications" : "Your tracker is ready when you are"}</p><p className="mt-1 text-sm text-slate-500">{jobs.length ? "Try another filter or search term." : "Add an application to start organizing your search."}</p>{!jobs.length && <Button className="mt-4" onClick={() => setShowForm(true)}><Plus size={16}/> Add first application</Button>}</div> :
      <div className="space-y-3">{filtered.map(job => <article key={job._id} className="rounded-2xl border border-slate-100 p-4 transition hover:border-violet-100 sm:p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><BriefcaseBusiness size={21}/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold text-slate-900">{job.role}</h3><Status status={job.status}/></div><p className="mt-1 text-sm font-medium text-slate-500">{job.company}</p><div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">{job.location && <span><MapPin className="mr-1 inline" size={13}/>{job.location}</span>}<span>Added {new Date(job.createdAt).toLocaleDateString()}</span>{job.link && <a href={job.link} target="_blank" rel="noreferrer" className="font-bold text-violet-600 hover:underline">Job posting <ExternalLink className="ml-1 inline" size={12}/></a>}</div>{job.notes && <p className="mt-2 text-xs text-slate-500">{job.notes}</p>}</div><div className="flex items-center gap-2"><select aria-label={`Update status for ${job.role}`} value={job.status} onChange={e => updateStatus(job._id, e.target.value)} className="max-w-36 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-violet-400">{statuses.map(s => <option key={s}>{s}</option>)}</select><button onClick={() => remove(job._id)} aria-label={`Delete ${job.role}`} title="Delete application" className="rounded-lg p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={17}/></button></div></div></article>)}</div>}
    </Card>
  </div>;
}
