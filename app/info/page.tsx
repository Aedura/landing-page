"use client";
import Navbar from "../../components/Navbar";

const pillars = [
	{
		title: "School Operations",
		description:
			"Attendance, timetables, fee management, and community communication unified in a single control pane for administrators.",
		highlights: ["Unified attendance + fee engine", "Smart timetable orchestration", "Family communication hub"],
	},
	{
		title: "Teacher Productivity",
		description:
			"AI assistance for lesson plans, assessments, and grading so educators reclaim time for instruction and mentorship.",
		highlights: ["Automatic question & paper creation", "Grading automation workflows", "Reusable lesson plan templates"],
	},
	{
		title: "Student Learning & Analytics",
		description:
			"Adaptive learning loops with AI tutors, revision tools, and actionable performance insights for every learner.",
		highlights: ["Personal AI tutor & revision aids", "Skill mastery dashboards", "Predictive performance alerts"],
	},
];

const statusRows = [
	{ label: "Product Build", value: "In development" },
	{ label: "Early Pilots", value: "Planned" },
	{ label: "Revenue", value: "None yet" },
	{ label: "Target Market", value: "CBSE / ICSE / IB private schools (1500+ students)" },
	{ label: "Location Focus", value: "Madhya Pradesh, Maharashtra, Chhattisgarh" },
];

const competitors = [
	"Teachmint / TeachStack",
	"LEAD School",
	"Entab / CampusCare",
	"Next Education",
	"Google Classroom / Microsoft Teams",
];

export default function InfoPage() {
	return (
		<div className="flex min-h-screen flex-col bg-black text-white">
			<Navbar />
			<main className="flex-1">
				<section className="relative overflow-hidden bg-linear-to-b from-black via-blue-950/20 to-black px-4 pb-24 pt-24 sm:px-6 lg:px-12">
					<div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />
					<div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
					<div className="relative mx-auto flex max-w-5xl flex-col gap-10">
						<div className="space-y-4 text-center">
							<span className="inline-flex items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
								Company Overview
							</span>
							<h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
								The Operating System for India&apos;s Private Schools
							</h1>
							<p className="mx-auto max-w-3xl text-sm text-gray-300 sm:text-base">
								Aedura is a cloud-first, AI-enabled school operating system designed exclusively for CBSE, ICSE, and IB institutions. We bring academic excellence and operational execution under one intelligent roof.
							</p>
						</div>

						<div className="grid gap-6 sm:grid-cols-3">
							{pillars.map((pillar) => (
								<article
									key={pillar.title}
									className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-900/30 backdrop-blur-xl"
								>
									<div className="absolute -top-16 right-0 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
									<div className="relative space-y-4">
										<h2 className="text-xl font-semibold text-white">{pillar.title}</h2>
										<p className="text-sm text-gray-300">{pillar.description}</p>
										<ul className="space-y-2 text-sm text-blue-200/90">
											{pillar.highlights.map((point) => (
												<li key={point} className="flex items-start gap-2">
													<span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-400" />
													<span>{point}</span>
												</li>
											))}
										</ul>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>

				<section className="relative overflow-hidden bg-linear-to-b from-black via-transparent to-gray-950 px-4 py-20 sm:px-6 lg:px-12">
					<div className="absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
					<div className="relative mx-auto flex max-w-5xl flex-col gap-12">
						<article className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-blue-900/20 backdrop-blur-2xl sm:p-10">
							<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<h2 className="text-2xl font-semibold text-white sm:text-3xl">Vision Statement</h2>
								<span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
									Long-Term North Star
								</span>
							</header>
							<p className="mt-6 text-base text-gray-200 sm:text-lg">
								To become the academic infrastructure layer for India&apos;s top private schools by combining AI, community-driven content, and operational efficiency into a single seamless workflow.
							</p>
						</article>

						<div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
							<article className="rounded-3xl border border-white/10 bg-linear-to-br from-white/10 via-white/5 to-transparent p-8 shadow-xl shadow-blue-900/20 backdrop-blur-2xl sm:p-10">
								<h3 className="text-xl font-semibold text-white sm:text-2xl">Current Status — 2025</h3>
								<div className="mt-6 divide-y divide-white/10 text-sm text-gray-200 sm:text-base">
									{statusRows.map((row) => (
										<div key={row.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
											<span className="text-xs font-semibold uppercase tracking-widest text-blue-300 sm:w-48">
												{row.label}
											</span>
											<span className="text-sm text-gray-100 sm:text-base">{row.value}</span>
										</div>
									))}
								</div>
							</article>

							<article className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-8 shadow-lg shadow-blue-900/30 backdrop-blur-2xl sm:p-10">
								<h3 className="text-xl font-semibold text-white sm:text-2xl">Competitive Positioning</h3>
								<p className="mt-4 text-sm text-blue-100/90 sm:text-base">
									Aedura merges administration, teaching, and academic intelligence into one tightly integrated platform. Legacy ERPs cover operations; LMS tools focus on content delivery. We orchestrate the full school lifecycle.
								</p>
							</article>
						</div>
					</div>
				</section>

				<section className="relative overflow-hidden bg-linear-to-b from-gray-950 via-black to-black px-4 py-20 sm:px-6 lg:px-12">
					<div className="absolute left-12 top-12 h-60 w-60 rounded-full bg-purple-600/20 blur-3xl" />
					<div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
					<div className="relative mx-auto flex max-w-5xl flex-col gap-12">
						<header className="space-y-3 text-center">
							<span className="inline-flex items-center justify-center rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-200">
								Market Landscape
							</span>
							<h2 className="text-3xl font-semibold sm:text-4xl">Primary Competitors</h2>
							<p className="mx-auto max-w-3xl text-sm text-gray-300 sm:text-base">
								We benchmark against modern ERPs and LMS solutions across India. Aedura&apos;s roadmap unlocks a data-rich, AI-native experience that current tools cannot deliver.
							</p>
						</header>

						<div className="grid gap-6 sm:grid-cols-2">
							{competitors.map((name) => (
								<div
									key={name}
									className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-200 shadow-lg shadow-purple-900/20 backdrop-blur-xl"
								>
									<span className="text-xs font-semibold uppercase tracking-widest text-purple-300">Competitor</span>
									<p className="mt-2 text-lg font-semibold text-white">{name}</p>
								</div>
							))}
						</div>

						<article className="rounded-3xl border border-teal-400/30 bg-linear-to-r from-teal-500/20 via-transparent to-blue-500/20 p-8 text-white shadow-2xl shadow-teal-900/30 backdrop-blur-2xl sm:p-10">
							<h3 className="text-2xl font-semibold">Aedura&apos;s Unfair Advantage</h3>
							<div className="mt-6 grid gap-6 text-sm text-teal-50/90 sm:grid-cols-2 sm:text-base">
								<p>
									Crowdsourced, AI-generated academic content libraries that keep lesson plans, assessments, and enrichment resources continuously fresh.
								</p>
								<p>
									Predictive academic performance analytics flag risks early and prescribe interventions for teachers, coordinators, and school leadership.
								</p>
								<p>
									Fully integrated admin + academic workflows so attendance, assessments, communication, and insights live in one orchestrated environment.
								</p>
								<p>
									Designed to become the academic and operational backbone for private K–12 institutions scaling beyond 1500 students.
								</p>
							</div>
						</article>
					</div>
				</section>
			</main>
		</div>
	);
}
