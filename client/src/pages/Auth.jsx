import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Route, Sparkles, Target, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Alert, Button, Field } from "../components/UI.jsx";

export default function Auth({ mode = "login" }) {
  const isRegister = mode === "register";
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace/>;

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
      navigate("/");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_.95fr]">
    <section className="relative hidden overflow-hidden bg-[#17132f] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
      <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full bg-violet-600/40 blur-3xl"/><div className="absolute -bottom-20 -left-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"/>
      <div className="relative flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500"><Route/></div><span className="text-xl font-black">SkillBridge<span className="text-violet-300">.</span></span></div>
      <div className="relative max-w-xl"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-violet-200"><Sparkles size={14}/> Your next chapter starts here</div><h1 className="text-5xl font-black leading-[1.1] tracking-tight xl:text-6xl">Make your next move <span className="text-violet-300">your best move.</span></h1><p className="mt-6 max-w-lg leading-7 text-slate-300">Turn career goals into clear learning steps, build skills that matter, and keep every opportunity in one place.</p>
        <div className="mt-10 grid grid-cols-2 gap-3"><Feature icon={Target} title="A plan that fits" desc="A focused roadmap for your goals"/><Feature icon={TrendingUp} title="Progress you can see" desc="Small wins, real momentum"/></div>
      </div>
      <p className="relative text-xs text-slate-400">A little progress each day adds up to big results.</p>
    </section>
    <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10"><div className="w-full max-w-md">
      <div className="mb-10 flex items-center gap-3 lg:hidden"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white"><Route/></div><span className="text-xl font-black">SkillBridge<span className="text-violet-600">.</span></span></div>
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[.18em] text-violet-600">{isRegister ? "Create your account" : "Welcome back"}</p><h2 className="text-3xl font-black tracking-tight text-slate-900">{isRegister ? "Start building your future." : "Pick up where you left off."}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{isRegister ? "Set up your workspace in less than a minute." : "Sign in to continue your career journey."}</p>
      <form onSubmit={submit} className="mt-8 space-y-5"><Alert>{error}</Alert>{isRegister && <Field label="Full name" placeholder="e.g. Yashika Adhlakha" autoComplete="name" value={name} onChange={e => setName(e.target.value)} required/>}<Field label="Email address" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required/><Field label="Password" type="password" placeholder="At least 8 characters" autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 8 : undefined} value={password} onChange={e => setPassword(e.target.value)} required/><Button className="w-full py-3" disabled={busy}>{busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"} {!busy && <ArrowRight size={17}/>}</Button></form>
      <p className="mt-6 text-center text-sm text-slate-500">{isRegister ? "Already have an account?" : "New to SkillBridge?"} <Link className="font-bold text-violet-600 hover:text-violet-700" to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create account"}</Link></p>
    </div></section>
  </div>;
}
function Feature({ icon: Icon, title, desc }) { return <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><Icon className="mb-4 text-violet-300" size={21}/><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{desc}</p></div>; }
