import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { X } from 'lucide-react'
import { usePortfolioNavigation } from '../../navigation/NavigationContext.jsx'

export default function ExpandableImage({
  src,
  alt,
  width,
  height,
  caption,
  linkClassName = '',
  imageClassName = '',
  loading,
  decoding = 'async',
}) {
  const { fragment } = usePortfolioNavigation()
  const [open, setOpen] = useState(false)
  const linkRef = useRef(null)
  const dialogRef = useRef(null)
  const currentFragmentRef = useRef(fragment)
  const openedFragmentRef = useRef(fragment)
  const navigationDismissRef = useRef(false)
  const restoreFocusRef = useRef(true)

  const close = useCallback((restoreFocus = true) => {
    restoreFocusRef.current = restoreFocus
    if (dialogRef.current?.open) dialogRef.current.close()
    else {
      setOpen(false)
      if (restoreFocus) requestAnimationFrame(() => linkRef.current?.focus({ preventScroll: true }))
    }
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && dialog && !dialog.open) dialog.showModal()
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const { body, documentElement } = document
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const previousStyles = {
      bodyOverflow: body.style.overflow,
      rootOverflow: documentElement.style.overflow,
      scrollbarGutter: documentElement.style.scrollbarGutter,
    }

    navigationDismissRef.current = false
    openedFragmentRef.current = currentFragmentRef.current
    if (documentElement.clientWidth < window.innerWidth) documentElement.style.scrollbarGutter = 'stable'
    documentElement.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousStyles.bodyOverflow
      documentElement.style.overflow = previousStyles.rootOverflow
      documentElement.style.scrollbarGutter = previousStyles.scrollbarGutter
      if (!navigationDismissRef.current && currentFragmentRef.current === openedFragmentRef.current) {
        window.scrollTo(scrollX, scrollY)
      }
    }
  }, [open])

  useEffect(() => {
    if (currentFragmentRef.current === fragment) return
    currentFragmentRef.current = fragment
    if (open) {
      navigationDismissRef.current = true
      close(false)
    }
  }, [close, fragment, open])

  useEffect(() => {
    if (!open) return undefined

    function handlePopState() {
      navigationDismissRef.current = true
      close(false)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [close, open])

  function handleClick(event) {
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) return

    event.preventDefault()
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    if (restoreFocusRef.current) requestAnimationFrame(() => linkRef.current?.focus({ preventScroll: true }))
    restoreFocusRef.current = true
  }

  function handleDialogKeyDown(event) {
    if (event.key !== 'Tab') return

    const focusable = [...dialogRef.current.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )].filter((element) => element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0)
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (active === last || !dialogRef.current.contains(active))) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      <a
        ref={linkRef}
        data-expandable-image
        href={src}
        target="_blank"
        rel="noreferrer noopener"
        title="Expand image"
        aria-label={`Expand image: ${alt}`}
        onClick={handleClick}
        className={`cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${linkClassName}`}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={imageClassName}
          loading={loading}
          decoding={decoding}
        />
      </a>
      {open && typeof document !== 'undefined' && createPortal(
        <dialog
          ref={dialogRef}
          data-expanded-image-dialog
          aria-label={`Expanded image: ${alt}`}
          onKeyDown={handleDialogKeyDown}
          onClose={handleClose}
          onClick={(event) => {
            if (event.target === event.currentTarget) close()
          }}
          className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] max-w-[min(96vw,90rem)] overflow-auto rounded-2xl border border-line bg-paper p-4 text-ink shadow-2xl backdrop:bg-black/80 sm:p-6"
        >
          <div className="flex min-w-0 flex-col items-center gap-3">
            <div className="flex w-full justify-end">
              <button
                type="button"
                data-expanded-image-close
                autoFocus
                onClick={close}
                aria-label="Close expanded image"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-ink hover:bg-line/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="max-h-[calc(100dvh-8rem)] max-w-full object-contain"
              decoding="async"
            />
            {caption && <p className="max-w-3xl text-center text-sm leading-6 text-muted">{caption}</p>}
            <a
              href={src}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-accent-ink underline decoration-line underline-offset-4 hover:text-ink hover:decoration-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Open original image
            </a>
          </div>
        </dialog>,
        document.body,
      )}
    </>
  )
}

ExpandableImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  caption: PropTypes.string,
  linkClassName: PropTypes.string,
  imageClassName: PropTypes.string,
  loading: PropTypes.oneOf(['eager', 'lazy']),
  decoding: PropTypes.oneOf(['async', 'auto', 'sync']),
}
