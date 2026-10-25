/**
 * Every word on the homepage.
 *
 * Source: the approved one-page copy in ~/Downloads/sonder-redesign/index.html
 * (October 23, 2026), used verbatim. The one change is the third process step, which
 * is titled "Build" to match the Discover → Design → Build → Refine sequence Chase
 * specified; its description is the approved one.
 *
 * The short interface strings in INTERFACES are also taken from that file's
 * illustrative-interface panels. Nothing here is a case study, a metric or a client
 * name. Do not add any without Chase's approval.
 */

export const CTA = "Book a Discovery Call";

export const SEO = {
  /** ≤ 62 characters; names the services and the city. */
  title: "Sonder Digital Co. | Custom AI, Automation & Software, Atlanta",
  /** ≤ 160 characters; names the lanes an owner would search for. */
  description:
    "Custom AI agents, quote follow-up and lead reactivation, workflow automation, custom CRMs and websites for established businesses. Atlanta, Georgia.",
  ogTitle: "We build technology that makes your business work better.",
  keywords: [
    "custom AI automation for small business",
    "AI implementation Atlanta",
    "quote follow-up automation",
    "lead reactivation service",
    "AI receptionist",
    "voice AI receptionist",
    "custom CRM development",
    "workflow automation",
    "custom software development",
    "web design Atlanta",
    "HOTMA ACOP update",
  ],
} as const;

export const HERO = {
  label: "Independent technology studio",
  location: "Atlanta, GA · Working everywhere",
  /** Rendered as three lines; the last is the gold italic accent. */
  headline: ["We build technology", "that makes your business", "work better."],
  lede: "Custom AI, automation, software, and websites designed to help you capture more opportunities, save time, and run a more efficient business.",
  support:
    "From a single workflow to a complete operational overhaul, we build solutions around what your business actually needs.",
  scroll: "Scroll to explore",
  figure: "Form / Function",
} as const;

/** The marquee under the hero and the footer list. */
export const DISCIPLINES = ["AI implementation", "Business automation", "Custom software", "Web development"] as const;

export const PERSPECTIVE = {
  label: "Our perspective",
  kicker: "Thoughtful technology. Practical impact.",
  heading: "Your business has potential. We help you do more with it.",
  body: [
    "Every business has opportunities to work faster, serve customers better, and get more out of its existing resources.",
    "We look at how your business operates, identify where technology can make the biggest impact, and build solutions that turn those opportunities into real improvements.",
  ],
  signoff: ["More than the tools", "It's how everything works together"],
} as const;

export const EXPERTISE = {
  label: "Our expertise",
  heading: ["What we build.", "What it makes possible."],
  sub: "Four connected capabilities. One thoughtful approach to better business.",
  items: [
    {
      id: "ai",
      tag: "AI systems",
      title: "AI Agents & Intelligent Systems",
      lead: "Handle more conversations without adding more work to your team's day.",
      body: "AI receptionists, virtual assistants, customer support agents, and intelligent systems that answer questions, qualify leads, book appointments, and support your operations.",
      pills: ["AI receptionists", "Virtual assistants", "Customer support agents", "Answer questions", "Qualify leads", "Book appointments"],
      flow: ["Inquiry understood", "Appointment scheduling"],
      output: "Inquiry understood → Appointment scheduling",
    },
    {
      id: "automation",
      tag: "Automation",
      title: "Workflow Automation & Integrations",
      lead: "Get more done without doing everything manually.",
      body: "We connect your tools, automate repetitive tasks, and create workflows that keep information moving and your team focused on higher-value work.",
      pills: ["Connect your tools", "Automate repetitive tasks", "Create workflows", "Keep information moving"],
      flow: ["New inquiry", "Qualification", "CRM + follow-up"],
      output: "Connected workflows · No manual handoff",
    },
    {
      id: "software",
      tag: "Development",
      title: "Custom Software & Development",
      lead: "Software designed for the way your business actually works.",
      body: "From custom CRMs and internal dashboards to client portals, business applications, and websites, we build technology tailored to your processes and goals.",
      pills: ["Custom CRMs", "Internal dashboards", "Client portals", "Business applications", "Websites"],
      flow: ["Website launch", "Onboarding flow", "Client portal"],
      output: "Software, your way",
    },
    {
      id: "sales",
      tag: "Sales systems",
      title: "Sales & Customer Systems",
      lead: "Make every opportunity count.",
      body: "We build systems that respond to new inquiries, follow up on open quotes, reconnect with past leads, and help your team turn more conversations into customers.",
      pills: ["Respond to new inquiries", "Follow up on open quotes", "Reconnect with past leads"],
      flow: ["Quote received", "Follow-up ready", "Reply captured"],
      output: "Relevant context, real conversations",
    },
  ],
} as const;

/** Text inside the illustrative interfaces, from the approved file. */
export const INTERFACES = {
  assistant: {
    title: "Assistant workspace",
    sub: "Customer inquiry handling",
    status: "Active",
    user: "I'd like to book a consultation next week.",
    reply: "Of course. Which day works best for you?",
    steps: ["Inquiry understood", "Appointment scheduling"],
  },
  architecture: [
    { k: "01 · Input", v: "New inquiry", s: "Form received" },
    { k: "02 · Intelligence", v: "Qualification", s: "Context analyzed" },
    { k: "03 · Action", v: "CRM + follow-up", s: "Record updated" },
  ],
  connected: ["Connected workflows", "No manual handoff"],
  workspace: {
    nav: ["Overview", "Projects", "Contacts", "Activity"],
    crumb: "Operations / Projects",
    title: "Everything, in one place.",
    tabs: ["Overview", "Activity", "Documents"],
    rows: [
      ["Website launch", "In review"],
      ["Onboarding flow", "In progress"],
      ["Client portal", "Ready"],
    ],
  },
  followUp: {
    stages: ["Quote received", "Follow-up ready", "Reply captured"],
    label: "Personalized follow-up",
    greeting: "Hi Jordan,",
    body: "Just checking in on the options we discussed. Happy to answer any questions about the materials or next steps.",
    context: "Relevant context",
  },
  crm: {
    nav: ["Overview", "Clients", "Projects", "Documents", "Settings"],
    crumb: "Workspace / Projects",
    title: "Good morning.",
    sub: "Here's what's happening across your work.",
    cols: ["Project", "Stage", "Last update"],
    rows: [
      ["New website", "In progress", "Today"],
      ["Client onboarding", "Review", "Yesterday"],
      ["Brand assets", "Complete", "This week"],
    ],
  },
  quote: {
    time: "02:14 PM",
    label: "Project context",
    context: ["Material options reviewed.", "Installation questions pending."],
    messageLabel: "Personalized message",
    message: "Following up on the options we discussed for your project…",
    caption: "Relevant context, real conversations",
  },
} as const;

export const WORK = {
  /**
   * Section renamed Oct 23 (evening) at Chase's request: the approved "Selected work /
   * Real businesses. Real solutions. Real work." duplicated the capabilities section.
   * It is now an index of three recent builds showing which capabilities each combined.
   * Oct 23: builds 02 and 03 replaced at Chase's request (Voice AI & AI Receptionist,
   * Lead Reactivation); their descriptions are new copy in the approved voice.
   */
  label: "In practice",
  heading: ["Where it all", "comes together."],
  sub: "Explore a selection of the custom technology, websites, and intelligent systems we've developed.",
  items: [
    {
      id: "crm",
      title: "Custom CRM & Website Development",
      body: "A redesigned agency website paired with a custom client management system built to support everyday operations and simplify internal workflows.",
      caps: ["Development", "Sales systems", "Automation"],
      status: "Live",
    },
    {
      id: "voice",
      title: "Voice AI & AI Receptionist",
      body: "A branded phone agent that answers every call, routes it where it belongs, and books appointments around the clock, with the rules you set.",
      caps: ["AI systems", "Automation"],
      status: "Live",
    },
    {
      id: "reactivation",
      title: "Lead Reactivation",
      body: "Personal follow-up on quotes that went quiet and clients who stopped booking, with every reply routed to the right person. Shown here as an interactive demonstration.",
      caps: ["Sales systems", "Automation", "AI systems"],
      status: "Interactive demonstration",
    },
  ],
  demoNote: "Interactive demonstration · plays as you scroll, click to replay",
  footnote: "Selected capabilities & project types",
} as const;

export const APPROACH = {
  label: "Our approach",
  heading: "From idea to implementation.",
  sub: "We don't just recommend technology. We design it, build it, and make it work for your business.",
  steps: [
    { title: "Discover", body: "We get to know your business, your goals, and the processes behind your day-to-day operations." },
    { title: "Design", body: "We develop a practical solution that fits your existing tools, workflows, and priorities." },
    { title: "Build", body: "We build, test, and deploy your system, making sure it works where and how you need it." },
    { title: "Refine", body: "We improve the system based on real usage and help it continue delivering value as your business evolves." },
  ],
} as const;

export const TALK = {
  label: "Let's talk",
  kicker: "Good projects start with a conversation.",
  heading: ["Let's build", "something better."],
  body: [
    "Whether you have a specific project in mind or want to explore what AI and automation could do for your business, we'd love to hear about it.",
    "Tell us what you're trying to accomplish. We'll help you figure out the best way to make it happen.",
  ],
} as const;

export const FOOTER = {
  backToTop: "Back to top",
} as const;
