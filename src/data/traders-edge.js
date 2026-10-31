import multiplayerLobby from '../assets/traders-edge/multiplayer-room-lobby.png'
import multiplayerFakeNews from '../assets/traders-edge/multiplayer-fake-news.png'
import revisedLevelSchema from '../assets/traders-edge/revised-level-schema.png'
import newsEventSchema from '../assets/traders-edge/news-event-schema.jpeg'
import marketWorkspace from '../assets/traders-edge/market-workspace.jpeg'

const tradersEdgeProject = {
  id: 'traders-edge',
  title: 'Trader’s Edge',
  category: 'Backend',
  image: marketWorkspace,
  imageAlt: 'Trader’s Edge trading workspace with a candlestick chart, moving-average overlays, portfolio metrics, trading actions and a bid-and-ask summary.',
  imageWidth: 1919,
  imageHeight: 909,
  summary: 'A trading education game where learners practice market orders, read price signals and test strategies in guided, historical and multiplayer scenarios.',
  description: 'National University of Singapore final-year project',
  implementation: [
    { label: 'Frontend', value: 'React · TypeScript · Vite · Tailwind CSS' },
    { label: 'Database', value: 'Relational schema · JSONB' },
    { label: 'Live sessions', value: 'HTTP API · WebSockets' },
  ],
  links: [
    { label: 'Source code', href: 'https://github.com/Traders-Edge/traders_edge' },
  ],
  skills: ['Database design', 'SQL', 'WebSockets', 'React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  caseStudy: {
    eyebrow: 'Final-year project · National University of Singapore',
    lead: 'Trader’s Edge makes the moving parts of trading something people can practice. Players progress from simple buy and sell decisions into price charts, a ticking bid-and-ask market, order types, short selling and portfolio analysis, with missions and market scenarios that teach along the way.',
    motivationTitle: 'Practice the market, one decision at a time',
    motivation: [
      'The game pairs a realistic trading workspace with a guided learning path, so new traders can meet complex ideas in manageable steps. Missions, quizzes, achievements and streaks encourage repeated practice while the available tools grow with each module.',
      'Adventure Mode teaches the core mechanics. Puzzle Mode gives players longer scenarios inspired by the Asian Financial Crisis and the Coronavirus Crash. Multiplayer places players in a shared market, where results reflect both trading choices and other people’s reactions.',
    ],
    capabilities: [
      {
        title: 'Learn the mechanics of a live market',
        text: 'Practice market, limit and stop orders as prices tick forward. The trading workspace shows candles, bid and ask prices, the spread and trade history. As levels introduce more advanced ideas, players can use moving averages, exponential moving averages, portfolio allocation and risk measures such as drawdown and volatility. Short selling follows a full sell-short and buy-to-cover cycle.',
      },
      {
        title: 'Work through changing market conditions',
        text: 'Guided levels introduce one concept at a time before later lessons combine several tools. Puzzle Mode expands practice into longer, less predictable scenarios, including historical crises. A player has to interpret new information, choose a response and watch how it plays out across subsequent market ticks.',
      },
      {
        title: 'Author news that moves a scenario market',
        text: 'Level authors can attach a fictional company headline or macroeconomic event to selected tickers, then define positive or negative price multipliers across separate tick windows. The impact can fade, change direction or continue over time, so a single story can create a more realistic trend or reversal. The database relates the event, its effect windows and its target instruments, and checks that those tickers belong to the same level.',
      },
      {
        title: 'Configure a shared multiplayer market',
        text: 'Players’ buy and sell orders are matched across the shared room through the bid-and-ask order book. Hosts can enable optional NPC orders to add bids and asks, and choose the order types and analysis tools available in the match. Private chat and fictional player-submitted headlines add social pressure. These multiplayer headlines surface in the shared news feed to influence player decisions; scenario-authored event effects are the mechanism that directly changes simulated prices.',
      },
    ],
    architectureTitle: 'How the simulation is modelled',
    architecture: {
      summary: 'The trading interface, shared game session and level database each represent a different part of the learning loop: what players see, how each market tick unfolds, and what a scenario contains.',
      steps: [
        {
          title: 'Relational levels and instruments',
          text: 'A unified levels table describes tutorial and puzzle levels. Child tables connect a level with its tickers, simulator type, starting positions and other market setup. Typed fields, enums, indexes and database constraints keep scenario rules and ordering explicit.',
        },
        {
          title: 'News, effects and ticker targets',
          text: 'level_news_events holds the article and its starting tick. Separate level_news_event_effects rows hold signed multipliers with start and end ticks, while level_news_event_tickers associates the event with its instruments. Multiple windows make a story’s influence unfold over time. More variable mission parameters can remain in JSONB while key relationships stay queryable.',
        },
        {
          title: 'Missions, tools and progression',
          text: 'Level missions use typed groups and mission types, with specific parameters stored in JSONB. A shared tool catalogue links tools to tutorials, while level availability and unlock records make progression explicit. These relationships let each level reveal analysis features as players advance.',
        },
        {
          title: 'A shared session for single-player and multiplayer',
          text: 'The React and TypeScript trading workspace receives game state through backend API and WebSocket messages. Single-player and multiplayer reuse the trading session’s portfolio, tick, order and fill processing, news aggregation and chart rendering, while multiplayer supplies its room context. That keeps the bid-and-ask trading loop consistent across both modes.',
        },
      ],
    },
    examplesTitle: 'Inside the game and its data model',
    examples: [
      {
        title: 'Read the market and manage a position',
        text: 'The final Adventure Mode workspace brings the candlestick chart, MA and EMA indicators, portfolio summary, trade actions and bid-and-ask view together for multi-ticker analysis.',
        images: [
          {
            src: marketWorkspace,
            alt: 'Dark trading screen with six ticker cards, a candlestick chart and two moving-average lines, portfolio analysis panels, buy, sell and short actions, and an expandable bid-and-ask summary.',
            caption: 'Final Adventure Mode trading workspace showing chart indicators, portfolio context and order-book prices.',
            width: 1919,
            height: 909,
          },
        ],
      },
      {
        title: 'Set up a multiplayer market',
        text: 'The room setup screen lets the host enable NPC orders and choose which trading tools are available to the group. Once the game starts, players meet in the same market.',
        images: [
          {
            src: multiplayerLobby,
            alt: 'Multiplayer room interface with separate create-room and join-room panels, plus settings for NPC orders, market and limit orders, short selling and analysis tools.',
            caption: 'A host can create a room, admit players with a room code and choose the features available in the match.',
            width: 1311,
            height: 873,
          },
          {
            src: multiplayerFakeNews,
            alt: 'A fictional headline composer with a selected AAPL ticker, delivery delay and message field above the market chart.',
            caption: 'Player-submitted headlines target a ticker and a delay to shape opponents’ interpretation of the shared market.',
            width: 637,
            height: 353,
          },
        ],
      },
      {
        title: 'Make level rules explicit',
        text: 'Tutorial and puzzle levels share one levels table with typed fields for level type, module order, tick mode, starting cash and pass criteria. Database checks enforce valid combinations before a level is used.',
        images: [
          {
            src: revisedLevelSchema,
            alt: 'Database diagram of the unified levels table, showing level type, module and level order, tick mode, starting cash and pass criteria.',
            caption: 'The level schema stores scenario settings in explicit fields instead of hiding them inside one metadata document.',
            width: 497,
            height: 632,
          },
        ],
      },
      {
        title: 'Give each scenario event a timeline',
        text: 'The event schema links each headline to its narrative, target tickers and one or more signed price-impact windows. This separates what the news says from where and for how long its simulated market impact applies.',
        images: [
          {
            src: newsEventSchema,
            alt: 'Relational database diagram linking levels and tickers to news headlines, ticker targets and separate price multiplier windows.',
            caption: 'The report’s schema for configuring news and macro events as ticker-specific effects across start and end ticks.',
            width: 1592,
            height: 694,
          },
        ],
      },
    ],
    deployment: [],
    futurePlans: [],
  },
}

export { tradersEdgeProject }
