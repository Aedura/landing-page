import { redirect } from "next/navigation";

import Navbar from "../../components/Navbar";
import { getTokenFromCookies, verifyAuthToken } from "../../lib/auth";

export default async function DashboardPage() {
  const token = await getTokenFromCookies();
  const payload = token ? verifyAuthToken(token) : null;

  if (!payload) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex flex-col bg-linear-to-b from-black from-5% to-[#0B0048] text-slate-100">
      <Navbar />
      <section className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-3xl border border-white/30 bg-black/20 backdrop-blur-xl shadow-2xl shadow-blue-950/60 p-6 sm:p-8 transition-all duration-700 ease-out">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Welcome back, {payload.name}!
          </h1>
          <p className="text-sm text-slate-300 mb-6">
            You are signed in as a {payload.roleType === "advisory" ? "member of the Advisory Board" : "Contributor"}.
          </p>
          <div className="rounded-2xl border border-white/20 bg-white/5 p-4 space-y-2 text-sm text-slate-200">
            <div className="flex justify-between">
              <span className="font-medium text-slate-100">Name</span>
              <span>{payload.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-100">Email</span>
              <span>{payload.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-100">Role Type</span>
              <span className="capitalize">{payload.roleType}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
