import PropTypes from 'prop-types'
import { ArrowUpRight } from 'lucide-react'

const badgeTones = {
  neutral: 'border-line bg-canvas text-muted',
  accent: 'border-accent/20 bg-accent/10 text-accent-ink',
  sage: 'border-sage bg-sage text-ink',
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] ${badgeTones[tone]} ${className}`}>
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(['neutral', 'accent', 'sage']),
  className: PropTypes.string,
}

const actionVariants = {
  primary: 'border-ink bg-ink text-paper hover:border-accent hover:bg-accent',
  secondary: 'border-line bg-paper text-ink hover:border-ink',
  subtle: 'border-transparent bg-transparent text-ink hover:border-line hover:bg-paper',
}

export function ActionLink({
  href,
  children,
  variant = 'primary',
  className = '',
  ...linkProps
}) {
  return (
    <a
      href={href}
      className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent motion-reduce:transition-none ${actionVariants[variant]} ${className}`}
      {...linkProps}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" />
    </a>
  )
}

ActionLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'subtle']),
  className: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
  download: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  title: PropTypes.string,
  onClick: PropTypes.func,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
}

export function SectionHeading({ eyebrow, title, description, aside, className = '' }) {
  return (
    <div className={`flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent-ink">{eyebrow}</p> : null}
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.045em] text-ink sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{description}</p> : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  )
}

SectionHeading.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  aside: PropTypes.node,
  className: PropTypes.string,
}

export function Panel({ children, className = '', ...panelProps }) {
  return (
    <div className={`rounded-2xl border border-line bg-paper p-5 shadow-[0_8px_28px_rgba(23,33,36,0.035)] sm:p-7 ${className}`} {...panelProps}>
      {children}
    </div>
  )
}

Panel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  role: PropTypes.string,
  hidden: PropTypes.bool,
  tabIndex: PropTypes.number,
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string,
}
