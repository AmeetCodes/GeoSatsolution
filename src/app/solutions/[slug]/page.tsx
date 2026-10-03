import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ConsultationDialog } from "@/components/solutions/ConsultationDialog";
import { SolutionFaq } from "@/components/solutions/SolutionFaq";
import { SolutionGallery } from "@/components/solutions/SolutionGallery";
import {
  SOLUTIONS_BY_SLUG,
  SOLUTIONS,
  solutionSlug,
  getDynamicSolutionBySlug,
  getDynamicSolutions,
} from "@/lib/solutions";

type SolutionPageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return getDynamicSolutions().map((solution) => ({ slug: solutionSlug(solution.title) }));
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
	const { slug } = await params;
	const solution = getDynamicSolutionBySlug(slug);

	return {
		title: solution ? `${solution.title} | GeoSAT Solutions` : "Solution | GeoSAT Solutions",
		description: solution?.intro,
	};
}

export default async function SolutionPage({ params }: SolutionPageProps) {
	const { slug } = await params;
	const solution = getDynamicSolutionBySlug(slug);

	if (!solution) notFound();

	return (
		<>
			<Navbar />
			<main className="min-h-screen bg-abyss pb-20 pt-[calc(var(--nav-h)+2rem)] sm:pt-[calc(var(--nav-h)+3.5rem)]">
				<div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
					<Link
						href="/#capabilities"
						className="inline-flex items-center gap-2 py-2 text-sm text-ink-3 transition-colors hover:text-aqua"
					>
						<ArrowLeft className="size-4" aria-hidden="true" />
						All solutions
					</Link>

					<div className="mt-8 grid items-center gap-10 lg:mt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
						<div className="max-w-xl py-2">
							<p className="label text-aqua">{solution.group} · GeoSAT capability</p>
							<h1 className="mt-5 font-display text-4xl leading-[1.04] text-ink sm:text-5xl lg:text-[3.75rem]">
								{solution.title}
							</h1>
							<p className="mt-6 font-display text-xl leading-relaxed text-ink-2 sm:text-2xl">
								{solution.intro}
							</p>
							<div className="mt-7 flex flex-wrap items-center gap-4">
								<ConsultationDialog solutionTitle={solution.title} solutionGroup={solution.group} />
								<p className="max-w-60 text-xs leading-relaxed text-ink-3">
									Talk directly with our survey team about this service.
								</p>
							</div>
							<p className="mt-5 max-w-lg text-base leading-7 text-ink-3">
								{solution.description}
							</p>
						</div>

						<SolutionGallery images={solution.images} />
					</div>

					<section className="mt-16 border-t border-line pt-9 sm:mt-20 sm:pt-12" aria-labelledby="deliverables-heading">
						<div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-12">
							<div>
								<p className="label text-aqua">A clear handover</p>
								<h2 id="deliverables-heading" className="mt-4 max-w-sm font-display text-3xl leading-tight text-ink">
									Useful outputs, ready for the next decision.
								</h2>
							</div>
							<ul className="grid gap-3 sm:grid-cols-2">
								{solution.outcomes.map((outcome) => (
									<li key={outcome} className="flex min-h-16 items-start gap-3 border-b border-line py-4 text-sm leading-relaxed text-ink-2">
										<span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/10 text-aqua">
											<Check className="size-3.5" aria-hidden="true" />
										</span>
										{outcome}
									</li>
								))}
							</ul>
						</div>
					</section>

					<SolutionFaq solutionTitle={solution.title} deliverables={solution.outcomes} />
				</div>
			</main>
			<Footer />
		</>
	);
}
