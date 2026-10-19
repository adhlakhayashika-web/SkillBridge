import { LoaderCircle } from "lucide-react";

export function PageTitle({ eyebrow, title, subtitle, action }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div>{eyebrow && <p className="mb-2 text-xs font-extrabold uppercase tracking-[.17em] text-violet-600">{eyebrow}</p>}<h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{title}</h1>{subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p>}</div>{action}</div>;
}
export function Card({ children, className = "" }) { return <section className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 md:p-6 ${className}`}>{children}</section>; }
export function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = variant === "secondary" ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : variant === "danger" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-violet-600 text-white shadow-md shadow-violet-200 hover:bg-violet-700";
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`} {...props}>{children}</button>;
}
export function Field({ label, ...props }) { return <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span><input className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100" {...props}/></label>; }
export function SelectField({ label, children, ...props }) { return <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span><select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" {...props}>{children}</select></label>; }
export function Alert({ children, type = "error" }) { if (!children) return null; return <div role="alert" className={`mb-4 rounded-xl px-4 py-3 text-sm ${type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{children}</div>; }
export function Loading() { return <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={18}/> Loading SkillBridge…</div>; }
