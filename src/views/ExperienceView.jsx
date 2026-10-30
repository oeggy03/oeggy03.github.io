import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { profile } from '../data/portfolio.js'
import { profilePortrait, featuredProjects } from '../data/featured-projects.js'
import nusLogo from '../assets/NUS.png'
import ExperienceTimeline from '../components/content/ExperienceTimeline.jsx'
import FeaturedProjectCard from '../components/content/FeaturedProjectCard.jsx'

export default function ExperienceView() {
  return (
    <div className="min-w-0 space-y-16 sm:space-y-24">
      <section aria-labelledby="experience-intro-heading" className="pt-2 sm:pt-8">
        <div className="grid min-w-0 grid-cols-[min(32vw,7rem)_minmax(0,1fr)] gap-x-4 gap-y-5 md:grid-cols-[minmax(0,1fr)_min(22rem,32vw)] md:gap-x-[min(3.5rem,4vw)] md:gap-y-0">
          <p className="col-start-2 row-start-1 min-w-0 self-center text-sm font-semibold tracking-wide text-accent-ink sm:text-base md:col-start-1 md:self-end md:text-lg">
            {profile.introEyebrow}
          </p>

          <figure className="col-start-1 row-start-1 aspect-[3/4] w-full self-start overflow-hidden rounded-2xl bg-surface md:col-start-2 md:row-span-3 md:row-start-1 md:max-w-[22rem] md:justify-self-end">
            <img src={profilePortrait.src} alt={profilePortrait.alt} width={profilePortrait.width} height={profilePortrait.height}
              className="size-full object-cover object-[center_28%]" loading="lazy" decoding="async" />
          </figure>

          <h2 id="experience-intro-heading" className="col-span-2 row-start-2 max-w-3xl text-balance text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.055em] text-ink min-[360px]:text-[2.75rem] sm:text-6xl md:col-span-1 md:col-start-1 md:row-start-2 lg:text-7xl">
            {profile.introHeadline}
          </h2>
          <div className="col-span-2 row-start-3 min-w-0 md:col-span-1 md:col-start-1 md:row-start-3">
            <p className="max-w-2xl text-[1.0625rem] leading-8 text-muted sm:text-xl sm:leading-9">{profile.introduction}</p>
            <nav aria-label="Explore this page" className="mt-4 flex min-w-0 flex-wrap gap-x-6 gap-y-2">
              <a href="#work-history" className="inline-flex min-h-11 min-w-11 max-w-full flex-wrap items-center gap-1.5 break-normal text-sm font-semibold text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                View experience <ArrowDown aria-hidden="true" className="size-4 shrink-0" />
              </a>
              <a href="#education" className="inline-flex min-h-11 min-w-11 max-w-full flex-wrap items-center gap-1.5 break-normal text-sm font-semibold text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                View education <ArrowDown aria-hidden="true" className="size-4 shrink-0" />
              </a>
              <a href="#what-im-building" className="inline-flex min-h-11 min-w-11 max-w-full flex-wrap items-center gap-1.5 break-normal text-sm font-semibold text-accent-ink underline decoration-line underline-offset-4 hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                What I’m building <ArrowDown aria-hidden="true" className="size-4 shrink-0" />
              </a>
            </nav>
          </div>
        </div>
      </section>

      <ExperienceTimeline />

      <section id="education" tabIndex={-1} aria-labelledby="education-heading" className="scroll-mt-32 grid min-w-0 gap-12 border-t border-line pt-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] xl:gap-16">
        <div>
          <h2 id="education-heading" tabIndex={-1} className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Education</h2>
          <div className="mt-8 flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:gap-5">
            <a href={profile.education.url} target="_blank" rel="noreferrer noopener" aria-label={`${profile.education.institution} website`} className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-paper p-2 ring-1 ring-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:size-16">
              <img className="max-h-full max-w-full object-contain" src={nusLogo} alt="" width="80" height="80" loading="lazy" decoding="async" />
            </a>
            <div className="min-w-0 max-w-full [overflow-wrap:anywhere]">
              <a href={profile.education.url} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 min-w-11 max-w-full flex-wrap items-center gap-1 text-lg font-semibold leading-snug text-ink underline decoration-line underline-offset-4 hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-xl">
                <span>{profile.education.institution}</span><ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
              </a>
              <p className="mt-2 text-base leading-7 text-ink">{profile.education.programme}</p>
              <p className="mt-1 text-lg font-medium leading-7 text-ink">{profile.education.period}</p>
              <p className="mt-1 text-base leading-7 text-muted">GPA {profile.education.gpa}</p>
              <p className="mt-1 text-base leading-7 text-muted">Minors: {profile.education.minors.join(' · ')}</p>
              <ul className="mt-5 space-y-2 text-base leading-7 text-muted">
                {profile.education.honors.map((honor) => <li key={honor}>{honor}</li>)}
              </ul>
              <ul className="mt-5 space-y-2 border-t border-line pt-5 text-base leading-7 text-muted">
                {profile.education.activities.map((activity) => <li key={activity}>{activity}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="xl:border-l xl:border-line xl:pl-8">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Interests</h2>
          <ul className="mt-7 space-y-3 text-base leading-7 text-ink">
            {profile.interests.map((interest) => <li key={interest}>{interest}</li>)}
          </ul>
          <p className="mt-6 border-t border-line pt-6 text-base leading-7 text-muted">{profile.aspiration}</p>
        </div>
      </section>

      <section id="what-im-building" aria-labelledby="building-heading" className="scroll-mt-32 border-t border-line pt-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Selected personal work</p>
            <h2 id="building-heading" className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">What I’m building</h2>
          </div>
        </div>
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          {featuredProjects.map((project) => <FeaturedProjectCard key={project.id} project={project} />)}
        </div>
      </section>
    </div>
  )
}
