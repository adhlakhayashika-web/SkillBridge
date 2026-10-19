import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Circle, ClipboardCheck, Compass, Flame, Plus, Route, Target, TrendingUp } from "lucide-react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Alert, Button, Card, Loading, PageTitle } from "../components/UI.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api("/dashboard").then(setData).catch(e => setError(e.message)); }, []);
  if (!data && !error) return <Loading/>;
  const stats = data?.stats;
  return <div>
    <PageTitle eyebrow="Monday mindset, everyday progress" title={`Hey ${user?.name?.split(" ")[0] || "there"}, let's move forward.`} subtitle="Your career journey, organized into achievable next steps." action={<Link to="/assessment"><Button variant="secondary"><ClipboardCheck size={16}/> Career assessment</Button></Link>}/>
    <Alert>{error}</Alert>
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={Target} label="Roadmap progress" value={`${stats?.roadmapProgress ?? 0}%`} detail={`${stats?.completedTasks ?? 0} of ${stats?.totalTasks ?? 0} steps complete`} color="violet"/>
      <Stat icon={BriefcaseBusiness} label="Applications tracked" value={stats?.applications ?? 0} detail="Keep every opportunity organized" color="blue"/>
      <Stat icon={TrendingUp} label="Interviews" value={stats?.interviews ?? 0} detail="Your next opportunity could be close" color="amber"/>
      <Stat icon={CheckCircle2} label="Offers" value={stats?.offers ?? 0} detail="Every step is progress" color="green"/>
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.45fr_.85fr]">
      <Card>
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-violet-600">Your direction</p><h2 className="mt-2 text-xl font-black text-slate-900">{data?.user?.targetRole || "Discover your career path"}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Build momentum with a clear, personalized set of learning milestones.</p></div><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><Compass size={24}/></div></div>
        <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400 transition-all" style={{width:`${stats?.roadmapProgress ?? 0}%`}}/></div><div className="mt-2 flex justify-between text-xs text-slate-400"><span>Roadmap completion</span><span>{stats?.roadmapProgress ?? 0}%</span></div>
        <div className="mt-6 flex flex-wrap gap-3"><Link to="/roadmap"><Button>Continue roadmap <ArrowRight size={16}/></Button></Link><Link to="/assessment"><Button variant="secondary">Review career profile</Button></Link></div>
      </Card>
      <Card><div className="flex items-center justify-between"><h2 className="font-extrabold text-slate-900">Quick actions</h2><Flame className="text-orange-500" size={19}/></div><div className="mt-4 space-y-3"><Quick to="/roadmap" icon={Route} title="Continue learning" desc="Check off your next milestone"/><Quick to="/jobs" icon={Plus} title="Add a job application" desc="Keep your search in one place"/><Quick to="/assessment" icon={ClipboardCheck} title="Explore your strengths" desc="Refine your career direction"/></div></Card>
      <Card className="xl:col-span-2"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-extrabold text-slate-900">Recent applications</h2><p className="mt-1 text-xs text-slate-500">A quick look at your latest opportunities.</p></div><Link to="/jobs" className="text-sm font-bold text-violet-600 hover:text-violet-800">View all <ArrowRight className="ml-1 inline" size={15}/></Link></div>
        {!data?.recentJobs?.length ? <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center"><BriefcaseBusiness className="mx-auto mb-3 text-slate-300" size={26}/><p className="font-bold text-slate-700">Your next opportunity starts here</p><p className="mt-1 text-sm text-slate-500">Add your first application to start tracking your search.</p><Link to="/jobs"><Button className="mt-4"><Plus size={16}/> Add application</Button></Link></div> : <div className="space-y-3">{data.recentJobs.map(job => <div key={job._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div><p className="font-bold text-slate-800">{job.role}</p><p className="mt-1 text-xs text-slate-500">{job.company}</p></div><Status status={job.status}/></div>)}</div>}
      </Card>
    </div>
  </div>;
}
function Stat({icon:Icon,label,value,detail,color}) { const colors={violet:"bg-violet-50 text-violet-600",blue:"bg-blue-50 text-blue-600",amber:"bg-amber-50 text-amber-600",green:"bg-emerald-50 text-emerald-600"};return <Card className="p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">{label}</span><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors[color]}`}><Icon size={18}/></span></div><p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></Card>; }
function Quick({to,icon:Icon,title,desc}) { return <Link to={to} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Icon size={18}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-800">{title}</span><span className="mt-1 block text-xs text-slate-500">{desc}</span></span><ArrowRight className="text-slate-300" size={16}/></Link>; }
export function Status({status}) { const colors={Wishlist:"bg-slate-100 text-slate-600",Applied:"bg-blue-50 text-blue-700",Interview:"bg-violet-50 text-violet-700",Offer:"bg-emerald-50 text-emerald-700",Rejected:"bg-rose-50 text-rose-700"};return <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${colors[status] || colors.Wishlist}`}>{status}</span>; }
