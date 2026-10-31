import heroPhoto from '../assets/featured/hero-photo.jpg'
import openclawBanner from '../assets/featured/openclaw-banner-light.png'
import shopeeInteraction from '../assets/featured/shopee-interaction.png'
import shopeeCart from '../assets/featured/shopee-cart.png'
import chineseDaily from '../assets/featured/chinese-daily.png'

export const profilePortrait = {
  src: heroPhoto,
  alt: 'Ha Thu outdoors with a camera',
  width: 2100,
  height: 3000,
}

export const featuredProjects = [
  {
    id: 'openclaw',
    title: 'My OpenClaw Lab',
    category: 'AI & bots',
    featured: true,
    image: openclawBanner,
    imageAlt: 'OpenClaw brand banner showing its lobster mascot and wordmark, with the line “Your personal AI assistant, running on your own devices.”',
    imageWidth: 1280,
    imageHeight: 358,
    summary: 'A personal agent lab for connecting real tools and building an assistant that remembers useful context about how I work.',
    skills: ['OpenClaw', 'Telegram', 'OpenAI API', 'LanceDB', 'Hybrid retrieval', 'Playwright MCP'],
    links: [
      { label: 'OpenClaw docs', href: 'https://docs.openclaw.ai/' },
      { label: 'OpenAI API', href: 'https://developers.openai.com/api/docs/' },
      { label: 'Playwright MCP', href: 'https://github.com/microsoft/playwright-mcp' },
      { label: 'memory-lancedb-pro', href: 'https://github.com/CortexReach/memory-lancedb-pro' },
      { label: 'OpenAI Decisions (future exploration)', href: 'https://developers.openai.com/api/docs/guides/decisions' },
    ],
    caseStudy: {
      eyebrow: 'Personal AI agent experiment',
      lead: 'I wanted an assistant that could build a useful, deep understanding of how I work and what I prefer, so I would not have to reintroduce that context in every conversation. My OpenClaw lab grew from that idea: a place to experiment with real tools, connect them to Telegram, and see a conversation become a practical action.',
      motivation: [
        'The part I enjoy most is joining up tools that usually sit apart: a chat, a memory store and a browser. Connecting them gave me a way to explore how an agent can build continuity over time and help with a concrete task, not just answer one prompt at a time.',
        'I started with memory and browser access as separate capabilities, checked what each one could do, then brought them together in an everyday shopping workflow. That hands-on process helped me understand both the possibilities and the points where I want to remain in control.',
      ],
      capabilities: [
        {
          title: 'Persistent, searchable context',
          text: 'I configured memory-lancedb-pro to capture and recall useful context from a local LanceDB store with hybrid vector and BM25 retrieval. When capture did not run, I traced it to a threshold expecting two messages while the agent supplied one eligible user message per turn, adjusted the setting, and verified recall in a fresh session. Memory records are stored locally, while text for embedding and extraction is processed by OpenAI.',
        },
        {
          title: 'A dedicated signed-in browser',
          text: 'I connected the official Playwright MCP server to a persistent browser profile. After I signed in, I verified that OpenClaw could reuse the session to read authenticated pages through my existing account.',
        },
        {
          title: 'A bounded shopping action',
          text: 'I asked the agent to compare reputable gaming mice, choose one, and add a single Tecware EX2 to my Shopee cart. It completed that task and stopped before checkout, leaving the purchase decision with me.',
        },
      ],
      architecture: {
        summary: 'Telegram is the conversation surface for a local OpenClaw gateway. The agent calls OpenAI for model and memory processing, retrieves records from local LanceDB, and uses Playwright MCP as a separate browser tool.',
        steps: [
          { title: 'Telegram', text: 'I send a request in Telegram and receive the agent response in the same conversation.' },
          { title: 'OpenClaw gateway and agent', text: 'The locally run gateway coordinates the conversation, available tools and memory hooks.' },
          { title: 'Memory and browser tools', text: 'The memory plugin searches LanceDB with vector and BM25 retrieval; Playwright controls a dedicated browser session after I sign in.' },
        { title: 'OpenAI', text: 'The configured OpenAI model powers the agent responses.' },
        ],
      },
      examples: [
        {
          title: 'From request to cart',
          text: 'The conversation and cart images show the agent recommendation alongside the item it added to my Shopee cart.',
          images: [
            {
              src: shopeeInteraction,
              alt: 'OpenClaw conversation about comparing gaming mice and adding a Tecware EX2 to the cart.',
              caption: 'The conversation shows the product comparison and request to add one mouse to the cart.',
              width: 608,
              height: 726,
            },
            {
              src: shopeeCart,
              alt: 'Shopee cart showing one Tecware EX2 mouse.',
              caption: 'The resulting cart contains one Tecware EX2 item.',
              width: 1230,
              height: 636,
            },
          ],
        },
      ],
      deployment: [
        { title: 'Local workstation', text: 'I run the gateway in Windows WSL, connected to Telegram, OpenAI and the dedicated Playwright browser.' },
        { title: 'Hosting research', text: 'I have explored what always-on hosting could look like. The agent currently runs locally while I continue experimenting with its tools and workflows.' },
      ],
      futurePlans: [
        'I want to explore decision APIs such as Jev and OpenAI Decisions, then build toward more involved workflows such as a Singpass login that I explicitly authorize. Authentication and consequential actions will remain under my direct approval.',
      ],
    },
  },
  {
    id: 'chinese-learning',
    title: 'Chinese Learning Toolkit',
    category: 'AI & bots',
    featured: true,
    image: chineseDaily,
    imageAlt: 'A daily Telegram message with a sample of collected Chinese vocabulary.',
    imageWidth: 533,
    imageHeight: 257,
    summary: 'A local-first Chinese vocabulary workflow that turns reviewed lesson words into a daily Telegram recall message.',
    skills: ['Go', 'React', 'TypeScript', 'Wails', 'Swift', 'SQLite', 'Supabase', 'PostgreSQL', 'Google Cloud Run', 'Cloud Scheduler', 'Telegram'],
    links: [
      { label: 'Desktop app', href: 'https://github.com/oeggy03/call_analyzer' },
      { label: 'Shared database', href: 'https://github.com/oeggy03/call_analyzer_lesson_db' },
      { label: 'Daily recall service', href: 'https://github.com/oeggy03/call_analyzer_active_recall' },
    ],
    caseStudy: {
      eyebrow: 'Language learning workflow',
      lead: 'I built a practical way to keep Chinese words from a lesson or an everyday reading moment alive after I move on. The toolkit turns those discoveries into a practice loop: capture vocabulary, review it at my desk, then meet a small selection again in Telegram the next morning.',
      motivation: [
        'I love learning Chinese, and this project grew from wanting to make that learning feel connected from one day to the next. Building the full loop lets me experiment with language tools while making each useful word easier to return to in my own routine.',
        'I also wanted the computer to help me notice vocabulary without deciding what I have learned. Transcribed or recognized terms begin as drafts, so I can confirm, edit, merge or reject them before they join the words I revisit.',
      ],
      capabilities: [
        {
          title: 'Capture and review on the desktop',
          text: 'The macOS app captures consented lesson audio with Swift and ScreenCaptureKit, with optional microphone audio. OpenRouter handles short-utterance transcription, selected-text lookups and photo recognition. The app turns transcription and image results into evidence-backed vocabulary candidates for my review, and I can add a word manually as well. Transcribed and recognized terms stay as drafts until I confirm, edit, merge or reject them. The interface uses React and TypeScript in Wails, with Go orchestration and SQLite storage.',
        },
        {
          title: 'Sync only reviewed vocabulary',
          text: 'The desktop app sends confirmed or manually saved vocabulary through an outbox after ten minutes without changes and pulls confirmed rows at launch. A separate repository defines the Supabase PostgreSQL schema shared by the app and service. The Supabase sync includes vocabulary rows and excludes lesson audio, transcripts and review events.',
        },
        {
          title: 'Revisit words in Telegram',
          text: 'A Go service randomly selects up to ten confirmed words and formats each with simplified and traditional Chinese, tone-marked pinyin and a gloss. Cloud Scheduler invokes it at 09:00 Asia/Singapore, and it sends the daily message through Telegram to bring vocabulary back into my day.',
        },
      ],
      architecture: {
        summary: 'The workflow starts with local capture and human review, syncs confirmed vocabulary through a shared Supabase contract, then uses a scheduled Go service to deliver a daily Telegram recall message.',
        steps: [
          { title: 'Capture locally', text: 'The macOS desktop app stores transcripts and vocabulary drafts in SQLite while I review the evidence.' },
          { title: 'Confirm and sync', text: 'Confirmed or manually saved vocabulary is queued by the desktop app and synchronized as rows through the shared Supabase schema.' },
          { title: 'Select a daily set', text: 'The Go recall service reads confirmed words and prepares up to ten entries with Chinese text, pinyin and glosses.' },
          { title: 'Deliver on schedule', text: 'Cloud Scheduler calls the service, which sends a morning message to Telegram.' },
        ],
      },
      examples: [
        {
          title: 'A small daily vocabulary sample',
          text: 'The message brings a selection of reviewed words into a familiar chat, making it easy to encounter them again during the day.',
          images: [
            {
              src: chineseDaily,
              alt: 'Telegram message showing a sample of daily Chinese vocabulary with readings and meanings.',
              caption: 'A sample of the daily vocabulary message; the image shows a subset of the words delivered by the service.',
              width: 533,
              height: 257,
            },
          ],
        },
      ],
      deployment: [
        { title: 'Desktop app', text: 'Lesson capture, draft vocabulary and review live in the local macOS app and SQLite database.' },
        { title: 'Shared vocabulary contract', text: 'Supabase PostgreSQL stores the confirmed vocabulary rows used by the desktop app and recall service.' },
        { title: 'Scheduled cloud delivery', text: 'The Go service runs privately on Google Cloud Run in Singapore. Cloud Scheduler invokes it with OIDC; deployment uses Secret Manager, a distroless container and GitHub Actions.' },
      ],
      futurePlans: [
        'I plan to extend the daily message into a reply and review-state loop, so my answers can shape which words I revisit next. That foundation can later support more adaptive spacing between practice sessions.',
      ],
    },
  },
]
