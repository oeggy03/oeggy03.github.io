import PropTypes from 'prop-types'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Badge } from '../ui/index.jsx'
import { projectPathFor } from '../../navigation/routes.js'

export default function ProjectCaseStudy({ project }) {
  const study = project.caseStudy
  const componentArchitecture = ['openclaw', 'traders-edge'].includes(project.id)

  return (
    <article id={`project-${project.id}`} aria-labelledby={`project-heading-${project.id}`} tabIndex={-1} className="min-w-0 scroll-mt-36 lg:scroll-mt-28">
      <a href={projectPathFor(project.id)} className="inline-flex min-h-11 min-w-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-accent-ink underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        <ArrowLeft aria-hidden="true" className="size-4" /> Back to {project.id === 'traders-edge' ? 'Trader’s Edge' : 'project overview'}
      </a>

      <header className="mt-5 max-w-4xl">
        <p className="text-sm font-semibold text-accent-ink">{study.eyebrow}</p>
        <p className="mt-2 text-sm font-medium text-muted">{project.category}</p>
        <h2 id={`project-heading-${project.id}`} tabIndex={-1} className="mt-2 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{project.title}</h2>
        <p className="mt-5 text-lg leading-8 text-ink sm:text-xl sm:leading-9">{study.lead}</p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={`${project.title} technologies`}>
          {project.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}
        </div>
      </header>

      <figure className="mt-8 flex max-h-[min(70vh,36rem)] items-center justify-center overflow-hidden rounded-2xl bg-surface p-3 sm:p-6">
        <a href={project.image} target="_blank" rel="noreferrer noopener" aria-label={`View full image: ${project.imageAlt}`} className="flex min-h-11 max-w-full items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          <img src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} className="max-h-[min(64vh,32rem)] max-w-full object-contain" decoding="async" />
        </a>
      </figure>

      <div className="mt-12 max-w-4xl space-y-12 sm:mt-16 sm:space-y-16">
        {study.motivation.length > 0 && <section aria-labelledby={`motivation-${project.id}`}>
          <h3 id={`motivation-${project.id}`} className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{study.motivationTitle || 'Why I started'}</h3>
          <div className="mt-4 space-y-4 text-base leading-8 text-muted sm:text-lg">
            {study.motivation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>}

        <section aria-labelledby={`capabilities-${project.id}`}>
          <h3 id={`capabilities-${project.id}`} className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">What it does</h3>
          <div className="mt-5 space-y-8">
            {study.capabilities.map((capability) => (
              <article key={capability.title} className="border-t border-line pt-5">
                <h4 className="text-xl font-semibold tracking-tight text-ink">{capability.title}</h4>
                <p className="mt-2 text-base leading-8 text-muted sm:text-lg">{capability.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby={`architecture-${project.id}`}>
          <h3 id={`architecture-${project.id}`} className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{study.architectureTitle || (componentArchitecture ? 'Architecture and components' : 'How it works')}</h3>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{study.architecture.summary}</p>
          {componentArchitecture ? (
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {study.architecture.steps.map((step) => (
                <li key={step.title} className="grid min-w-0 gap-2 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5">
                  <span aria-hidden="true" className="size-2 self-center rounded-full bg-accent" />
                  <div className="min-w-0">
                    <h4 className="text-lg font-semibold text-ink">{step.title}</h4>
                    <p className="mt-1 text-base leading-7 text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ol className="mt-6 divide-y divide-line border-y border-line">
            {study.architecture.steps.map((step, index) => (
              <li key={step.title} className="grid min-w-0 gap-2 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5">
                <span aria-hidden="true" className="text-sm font-semibold text-accent-ink">{String(index + 1).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <h4 className="text-lg font-semibold text-ink">{step.title}</h4>
                  <p className="mt-1 text-base leading-7 text-muted">{step.text}</p>
                </div>
              </li>
            ))}
            </ol>
          )}
        </section>

        <section aria-labelledby={`examples-${project.id}`}>
          <h3 id={`examples-${project.id}`} className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{study.examplesTitle || 'Examples'}</h3>
          <div className="mt-6 space-y-10">
            {study.examples.map((example) => (
              <article key={example.title} className="min-w-0">
                <h4 className="text-xl font-semibold tracking-tight text-ink">{example.title}</h4>
                <p className="mt-2 max-w-3xl text-base leading-8 text-muted">{example.text}</p>
                {example.images.length > 0 && (
                  <div className={`mt-5 grid min-w-0 gap-5 ${project.id === 'traders-edge' ? 'lg:grid-cols-1' : 'xl:grid-cols-2'}`}>
                    {example.images.map((image) => (
                      <figure key={image.src} className="min-w-0 rounded-2xl bg-paper p-3 ring-1 ring-line/70 sm:p-4">
                        <a href={image.src} target="_blank" rel="noreferrer noopener" aria-label={`View full screenshot: ${image.alt}`} className="flex min-h-11 items-center justify-center rounded-xl bg-surface p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                          <img src={image.src} alt={image.alt} width={image.width} height={image.height} className="max-h-[34rem] max-w-full object-contain" loading="lazy" decoding="async" />
                        </a>
                        <figcaption className="mt-3 text-sm leading-6 text-muted">{image.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {study.deployment.length > 0 && <section aria-labelledby={`deployment-${project.id}`}>
          <h3 id={`deployment-${project.id}`} className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Deployment</h3>
          <dl className="mt-5 divide-y divide-line border-y border-line">
            {study.deployment.map((item) => (
              <div key={item.title} className="py-5">
                <dt className="text-lg font-semibold text-ink">{item.title}</dt>
                <dd className="mt-2 text-base leading-8 text-muted">{item.text}</dd>
              </div>
            ))}
          </dl>
        </section>}

        {study.futurePlans.length > 0 && <section aria-labelledby={`future-${project.id}`}>
          <h3 id={`future-${project.id}`} className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Currently working on and future plans</h3>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-8 text-muted marker:text-accent-ink sm:text-lg">
            {study.futurePlans.map((plan) => <li key={plan} className="pl-1">{plan}</li>)}
          </ul>
        </section>}

        <section aria-labelledby={`resources-${project.id}`} className="border-t border-line pt-7">
          <h3 id={`resources-${project.id}`} className="text-xl font-semibold text-ink">Project resources</h3>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {project.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 min-w-11 items-center gap-1 text-sm font-semibold text-accent-ink underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  {link.label}<ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}

ProjectCaseStudy.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageAlt: PropTypes.string.isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
    summary: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string.isRequired })).isRequired,
    caseStudy: PropTypes.shape({
      eyebrow: PropTypes.string.isRequired,
      lead: PropTypes.string.isRequired,
      motivationTitle: PropTypes.string,
      motivation: PropTypes.arrayOf(PropTypes.string).isRequired,
      capabilities: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string.isRequired, text: PropTypes.string.isRequired })).isRequired,
      architecture: PropTypes.shape({
        summary: PropTypes.string.isRequired,
        steps: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string.isRequired, text: PropTypes.string.isRequired })).isRequired,
      }).isRequired,
      architectureTitle: PropTypes.string,
      examplesTitle: PropTypes.string,
      examples: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.shape({
          src: PropTypes.string.isRequired,
          alt: PropTypes.string.isRequired,
          caption: PropTypes.string.isRequired,
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired,
        })).isRequired,
      })).isRequired,
      deployment: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string.isRequired, text: PropTypes.string.isRequired })).isRequired,
      futurePlans: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
}
