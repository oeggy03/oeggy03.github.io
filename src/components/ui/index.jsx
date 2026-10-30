import PropTypes from 'prop-types'
import { ArrowUpRight } from 'lucide-react'

const badgeTones = {
  neutral: 'bg-surface text-ink',
  accent: 'bg-accent/10 text-accent-ink',
  sage: 'bg-surface text-ink',
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span className={`inline-flex min-h-8 items-center rounded-full px-3 py-1 text-sm font-medium leading-5 ${badgeTones[tone]} ${className}`}>
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
  primary: 'border-action bg-action text-action-foreground hover:opacity-90',
  secondary: 'border-line bg-paper text-ink hover:bg-surface',
  subtle: 'border-transparent bg-transparent text-accent-ink hover:bg-surface',
}

export function ActionLink({
  href,
  children,
  variant = 'primary',
  className = '',
  showArrow = true,
  ...linkProps
}) {
  return (
    <a
      href={href}
      className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent motion-reduce:transition-none ${actionVariants[variant]} ${className}`}
      {...linkProps}
    >
      <span>{children}</span>
      {showArrow ? <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /> : null}
    </a>
  )
}

ActionLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'subtle']),
  className: PropTypes.string,
  showArrow: PropTypes.bool,
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
    <div className={`flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-7 ${className}`}>
      <div className="max-w-3xl">
        {eyebrow ? <p className="mb-2 text-base font-medium text-muted">{eyebrow}</p> : null}
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-4xl">{title}</h2>
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
    <div className={`rounded-2xl bg-paper p-5 ring-1 ring-line/70 sm:p-7 ${className}`} {...panelProps}>
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
