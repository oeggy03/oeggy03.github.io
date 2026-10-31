import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { profile } from '../data/portfolio.js'
import { featuredProjects } from '../data/featured-projects.js'
import nusLogo from '../assets/NUS.png'
import ExperienceTimeline from '../components/content/ExperienceTimeline.jsx'
import FeaturedProjectCard from '../components/content/FeaturedProjectCard.jsx'
import ProfileCard from '../components/content/ProfileCard.jsx'

export default function ExperienceView() {
  return (
    <div className="min-w-0 space-y-16 sm:space-y-24">
      <section aria-labelledby="experience-intro-heading" className="pt-4 sm:pt-8">
        <div className="grid min-w-0 grid-cols-1 gap-y-6 md:grid-cols-[minmax(0,1fr)_min(18rem,32vw)] md:gap-x-[min(3.5rem,4vw)] md:gap-y-4">
          <div className="col-start-1 row-start-1 flex min-w-0 flex-wrap items-center gap-4 md:contents">
            <div className="w-28 max-w-full shrink-0 sm:w-32 md:col-start-2 md:row-span-3 md:row-start-1 md:w-full md:max-w-72 md:justify-self-end">
              <ProfileCard />
            </div>
            <p className="min-w-0 flex-[1_1_9rem] self-center text-sm font-semibold tracking-wide text-accent-ink sm:text-base md:col-start-1 md:row-start-1 md:self-end md:text-base">
              {profile.introEyebrow}
            </p>
          </div>

          <h2 id="experience-intro-heading" className="col-start-1 row-start-2 max-w-3xl text-balance text-[2rem] font-semibold leading-[1.04] tracking-[-0.055em] text-ink min-[360px]:text-[2.25rem] sm:text-5xl md:col-start-1 md:row-start-2 lg:text-[3.5rem]">
            {profile.introHeadline}
          </h2>
          <div className="col-start-1 row-start-3 min-w-0 md:col-start-1 md:row-start-3">
            <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{profile.introduction}</p>
            <nav aria-label="Explore this page" className="mt-6 flex min-w-0 flex-wrap gap-x-6 gap-y-2">
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
          <h2 id="education-heading" tabIndex={-1} className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Education</h2>
          <div className="mt-8 flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:gap-5">
            <a href={profile.education.url} target="_blank" rel="noreferrer noopener" aria-label={`${profile.education.institution} website`} className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-paper p-2 ring-1 ring-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:size-16">
              <img className="max-h-full max-w-full object-contain" src={nusLogo} alt="" width="80" height="80" loading="lazy" decoding="async" />
            </a>
            <div className="min-w-0 max-w-full [overflow-wrap:anywhere]">
              <a href={profile.education.url} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 min-w-11 max-w-full flex-wrap items-center gap-1 text-lg font-semibold leading-snug text-ink underline decoration-line underline-offset-4 hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-xl">
                <span>{profile.education.institution}</span><ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
              </a>
              <p className="mt-2 text-[0.9375rem] leading-7 text-ink">{profile.education.programme}</p>
              <p className="mt-1 text-base font-medium leading-7 text-ink">{profile.education.period}</p>
              <p className="mt-1 text-[0.9375rem] leading-7 text-muted">GPA {profile.education.gpa}</p>
              <p className="mt-5 text-[0.9375rem] leading-7 text-muted">{profile.education.honors}</p>
              <p className="mt-3 text-[0.9375rem] font-semibold leading-7 text-muted">Awards</p>
              <div role="group" aria-label="Awards" className="mt-3 space-y-1 text-[0.9375rem] leading-7 text-muted">
                {profile.education.awards.map((award) => <p key={award}>{award}</p>)}
              </div>
              <ul className="mt-5 space-y-2 border-t border-line pt-5 text-[0.9375rem] leading-7 text-muted">
                {profile.education.activities.map((activity) => <li key={activity}>{activity}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-8 xl:border-l xl:border-t-0 xl:border-line xl:pt-0 xl:pl-8">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Interests</h2>
          <ul className="mt-7 space-y-3 text-[0.9375rem] leading-7 text-ink">
            {profile.interests.map((interest) => <li key={interest}>{interest}</li>)}
          </ul>
          <h3 className="mt-6 text-lg font-semibold leading-6 text-ink">Skills</h3>
          <p className="mt-2 text-[0.9375rem] leading-7 text-muted">{profile.experienceSkills.join(' · ')}</p>
          <h3 className="mt-6 text-lg font-semibold leading-6 text-ink">Previously worked with</h3>
          <p className="mt-2 text-[0.9375rem] leading-7 text-muted">{profile.previouslyWorkedWith.join(' · ')}</p>
        </div>
      </section>

      <section id="what-im-building" aria-labelledby="building-heading" className="scroll-mt-32 border-t border-line pt-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Selected personal work</p>
            <h2 id="building-heading" className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">What I’m building</h2>
          </div>
        </div>
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          {featuredProjects.map((project) => <FeaturedProjectCard key={project.id} project={project} featuredOnExperience />)}
        </div>
      </section>
    </div>
  )
}
