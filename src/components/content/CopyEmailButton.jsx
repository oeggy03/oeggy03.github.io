import { useState } from "react"
import { Copy } from "lucide-react"
import { profile } from "../../data/portfolio"

export default function CopyEmailButton() {
  const [message, setMessage] = useState("")

  async function copyEmail() {
    if (!navigator.clipboard?.writeText) {
      setMessage("Copy is unavailable here. Use the email link instead.")
      return
    }

    try {
      await navigator.clipboard.writeText(profile.email)
      setMessage("Email address copied.")
    } catch {
      setMessage("Copy did not work. Use the email link instead.")
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button type="button" onClick={copyEmail} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        <Copy aria-hidden="true" className="size-4" /> Copy email
      </button>
      <p className="min-h-5 text-xs text-muted" aria-live="polite">{message}</p>
    </div>
  )
}
