import { useCallback, useEffect, useRef, useState } from 'react'
import { profilePortrait } from '../../data/featured-projects.js'
import { profile } from '../../data/portfolio.js'
import { usePortfolioNavigation } from '../../navigation/NavigationContext.jsx'

const demoStorageKey = 'experience-profile-card-demo-v1'
let demoSeenInThisPageSession = false

function hasSeenDemo() {
  if (demoSeenInThisPageSession) return true
  try {
    return window.sessionStorage.getItem(demoStorageKey) === 'true'
  } catch {
    return false
  }
}

function rememberDemo() {
  demoSeenInThisPageSession = true
  try {
    window.sessionStorage.setItem(demoStorageKey, 'true')
  } catch {
    // The card remains usable when browser storage is unavailable.
  }
}

export default function ProfileCard() {
  const { fragment } = usePortfolioNavigation()
  const [showingProfileId, setShowingProfileId] = useState(false)
  const cardRef = useRef(null)
  const startTimerRef = useRef(null)
  const returnTimerRef = useRef(null)

  const cancelAutoDemo = useCallback((remember = false) => {
    if (startTimerRef.current !== null) {
      window.clearTimeout(startTimerRef.current)
      startTimerRef.current = null
    }
    if (returnTimerRef.current !== null) {
      window.clearTimeout(returnTimerRef.current)
      returnTimerRef.current = null
    }
    if (remember) rememberDemo()
  }, [])

  useEffect(() => {
    if (fragment !== 'experience') {
      setShowingProfileId(false)
      return undefined
    }

    const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (motionPreference?.matches || hasSeenDemo()) return undefined

    const scheduleDemo = () => {
      if (motionPreference?.matches || startTimerRef.current !== null || hasSeenDemo()) return

      startTimerRef.current = window.setTimeout(() => {
        startTimerRef.current = null
        rememberDemo()
        setShowingProfileId(true)
        returnTimerRef.current = window.setTimeout(() => {
          returnTimerRef.current = null
          setShowingProfileId(false)
        }, 3000)
      }, 900)
    }

    const handleMotionPreferenceChange = (event) => {
      if (event.matches) {
        cancelAutoDemo(true)
        setShowingProfileId(false)
      }
    }
    const handlePageInteraction = () => cancelAutoDemo(true)
    motionPreference?.addEventListener?.('change', handleMotionPreferenceChange)
    document.addEventListener('pointerdown', handlePageInteraction)
    document.addEventListener('keydown', handlePageInteraction)

    const card = cardRef.current
    if (card && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          scheduleDemo()
        } else if (startTimerRef.current !== null) {
          window.clearTimeout(startTimerRef.current)
          startTimerRef.current = null
        }
      }, { threshold: 0.25 })

      observer.observe(card)
      return () => {
        observer.disconnect()
        motionPreference?.removeEventListener?.('change', handleMotionPreferenceChange)
        document.removeEventListener('pointerdown', handlePageInteraction)
        document.removeEventListener('keydown', handlePageInteraction)
        cancelAutoDemo()
        setShowingProfileId(false)
      }
    }

    scheduleDemo()
    return () => {
      motionPreference?.removeEventListener?.('change', handleMotionPreferenceChange)
      document.removeEventListener('pointerdown', handlePageInteraction)
      document.removeEventListener('keydown', handlePageInteraction)
      cancelAutoDemo()
      setShowingProfileId(false)
    }
  }, [cancelAutoDemo, fragment])

  const handleInteraction = () => cancelAutoDemo(true)

  return (
    <figure className="mx-auto w-full min-w-0 max-w-28 sm:max-w-32 md:mx-0 md:max-w-72 md:justify-self-end">
      <div className="relative grid w-full min-w-0 [perspective:1000px]">
        <span className="grid w-full min-w-0">
          <span className={`grid [grid-area:1/1] [transform-style:preserve-3d] transition-transform duration-700 ease-in-out motion-reduce:duration-0 motion-reduce:transition-none ${showingProfileId ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}`}>
            <span aria-hidden={showingProfileId} className="relative grid [grid-area:1/1] overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-line [backface-visibility:hidden]">
              <img src={profilePortrait.src} alt={profilePortrait.alt} width={profilePortrait.width} height={profilePortrait.height}
                className="block aspect-[3/4] w-full object-cover object-[center_28%]" loading="lazy" decoding="async" />
            </span>

            <span id="profile-card-back" aria-hidden={!showingProfileId} className="grid min-h-full [grid-area:1/1] rounded-2xl bg-paper p-2 shadow-sm ring-1 ring-line [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-3 md:p-5">
              <span className="flex h-full min-h-[7rem] min-w-0 flex-col justify-between gap-2 [overflow-wrap:anywhere] md:min-h-[18rem] md:gap-4">
                <span className="grid min-w-0 gap-2 text-xs font-semibold leading-4 text-ink md:hidden">
                  <span>{profile.identity.citizenshipShort}</span>
                  <span>{profile.identity.visaEligibility}</span>
                </span>
                <span className="hidden min-w-0 gap-3 [overflow-wrap:anywhere] md:grid">
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted">Full name</span>
                    <span className="mt-0.5 block text-lg font-semibold leading-6 text-ink">{profile.identity.fullName}</span>
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted">Citizenship</span>
                    <span className="mt-0.5 block text-base leading-6 text-ink">{profile.identity.citizenship}</span>
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted">Visa eligibility</span>
                    <span className="mt-0.5 block text-base leading-6 text-ink">{profile.identity.visaEligibility}</span>
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted">Current role</span>
                    <span className="mt-0.5 block text-base leading-6 text-ink">{profile.identity.currentRole}</span>
                  </span>
                </span>
                <span className="sr-only" id="profile-card-description">
                  <span className="md:hidden">{profile.identity.citizenshipShort}. {profile.identity.visaEligibility}.</span>
                  <span className="hidden md:inline">{profile.identity.fullName}. {profile.identity.citizenship}. {profile.identity.visaEligibility}. {profile.identity.currentRole}.</span>
                </span>
              </span>
            </span>
          </span>
        </span>
        <button
          ref={cardRef}
          type="button"
          data-profile-card
          data-state={showingProfileId ? 'profile-id' : 'photo'}
          aria-label={showingProfileId ? 'Show photo' : 'Flip card to show profile details'}
          aria-pressed={showingProfileId}
          aria-describedby={showingProfileId ? 'profile-card-description' : undefined}
          aria-controls="profile-card-back"
          onFocus={handleInteraction}
          onPointerDown={handleInteraction}
          onKeyDown={handleInteraction}
          onClick={() => {
            cancelAutoDemo(true)
            setShowingProfileId((current) => !current)
          }}
          className="absolute inset-0 z-10 min-h-11 w-full min-w-0 cursor-pointer rounded-2xl text-left active:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span className="absolute bottom-3 right-3 rounded-full bg-canvas/95 px-3 py-1.5 text-sm font-semibold text-ink shadow-sm">
            {showingProfileId ? 'Photo' : 'Flip card'}
          </span>
        </button>
      </div>
      <noscript>
        <p className="mt-3 rounded-xl border border-line bg-paper p-4 text-base leading-6 text-ink">{profile.identity.citizenshipShort}. {profile.identity.visaEligibility}.</p>
      </noscript>
    </figure>
  )
}
