import type { Dictionary } from "../types";

export const en: Dictionary = {
  nav: {
    howItWorks: "How it works",
    faq: "FAQ",
    forEntrepreneurs: "For Entrepreneurs",
    registerInterest: "Register interest",
    home: "ChesState home",
    mainLabel: "Main",
    footerLabel: "Footer",
  },
  language: {
    label: "Language",
  },
  hero: {
    badge: "Early access · UAE",
    title: "Own a slice of real estate for the price of your morning coffee.",
    subtitle:
      "ChesState is building fractional access to vetted property projects in the UAE — starting from $9.99, with no crypto wallet, no jargon, and no six-figure minimum.",
    ctaPrimary: "Register your interest",
    ctaSecondary: "See how it'll work",
    microcopy:
      "Joining the list doesn't invest any money or commit you to anything.",
  },
  example: {
    eyebrow: "Illustrative example",
    tag: "Residential",
    title: "Marina District Residences",
    location: "Dubai, UAE",
    yourStake: "Your stake",
    invested: "Invested",
    stakeRecorded: "Digital stake recorded",
    projectFunding: "Project funding",
    progressLabel: "Project funding progress",
    caption: "Sample interface — not a live listing or an available investment.",
  },
  trust: {
    sectionLabel: "What ChesState is planning",
    minimum: "Planned minimum from $9.99",
    noWallet: "No crypto wallet required",
    vara: "Built for the UAE's VARA framework",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "Tired of the old real estate game.",
    subtitle:
      "the bureaucracy, the middlemen, and the millions it takes just to “get on the board”?",
    body: "ChesState is changing the way the world invests in real estate. Through smart contracts and fractional investing, gain access to income-generating properties in the world's hottest markets.",
    highlight: "starting at just 9.99$!",
    statement: "Think ahead. Make your move. Change the game.",
  },
  faq: {
    title: "Questions",
    items: [
      {
        question: "Is ChesState regulated?",
        answer: `This page is for registering public interest only and is lawful to operate. Nothing on this page constitutes an offer or solicitation to purchase securities.

The investment product itself will only be launched through the required licensing and offering frameworks in the United Arab Emirates. The relevant approvals are currently in progress and nearing completion.

For your protection, we will not accept a single dollar of investment until all required approvals and licenses are in place.`,
      },
      {
        question: "How would my money be protected?",
        answer: `Investor funds are held in smart-contract escrow and released only when predefined project milestones are met, not handed to developers upfront.

Your ownership is recorded on chain, creating a transparent, auditable record, while reducing certain counterparty risks.

Real estate values can rise and fall, and projects can face delays or failure. If a project fails to meet its defined milestones, eligible investor funds are designed to be returned.`,
      },
      {
        question: "What kind of returns should I expect?",
        answer: `Returns will depend entirely on the specific project, market conditions, timing, and costs. There is always a real possibility of losing money.

For each project, we will disclose its assumptions, fees, and key risks so you can evaluate it on its own merits.

Nothing here is a forecast, target, or guarantee.`,
      },
      {
        question: "Can I sell my stake or take my money out early?",
        answer: `Plan on the answer being no. Real estate is a long-term, illiquid asset, and your stake should be treated the same way — money you can leave in place for the full life of the project.

We intend to allow stakes to be transferred, and recording ownership on-chain is what makes that technically possible. But no secondary market exists today, and even once one does, there is no guarantee a buyer will be there at the time or the price you want.`,
      },
      {
        question: "What fees will ChesState charge?",
        answer: `The fee schedule is not finalised.

Our current expectation is that our platform fee will be around 1%, but this figure has not yet been finalised and may change.

Every project will publish its fees in full before you commit anything, so you can judge whether the terms are worth it.`,
      },
      {
        question: "Do I need to understand crypto?",
        answer: `No. That's the whole point. You'd sign up with an email address and pay with a card or bank transfer, the same as any savings or investing app. Smart contracts run underneath to handle escrow and record ownership, but you'll never need a wallet, a seed phrase, or an exchange account to use ChesState.`,
      },
    ],
  },
  footer: {
    tagline: "Fractional access to vetted property projects in the UAE.",
    platform: "Preview the platform",
    terms: "Terms of use",
    privacy: "Privacy",
    cookies: "Cookies",
    refunds: "Refunds",
  },
  modal: {
    title: "Register your interest",
    description:
      "Add your email and mobile number, with your country code, and we'll let you know when ChesState opens to early access in the UAE.",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    phoneLabel: "Mobile number",
    phonePlaceholder: "50 123 4567",
    countryLabel: "Country code",
    submit: "Join the list",
    submitting: "Joining…",
    reassurance:
      "Joining the list doesn't invest any money or commit you to anything.",
    error: "Something went wrong. Please try again.",
    successTitle: "You're on the list.",
    successBody:
      "You can look around the platform now. Nothing has been charged and nothing has been invested.",
    enterPlatform: "Enter the platform",
    done: "Done",
    close: "Close",
    consent:
      "I agree to the Terms of use and Privacy policy, and I consent to ChesState storing my contact details for the waitlist.",
  },
  entrepreneurs: {
    metaTitle: "For Entrepreneurs — ChesState",
    metaDescription:
      "Bring a property project to ChesState. Tell us the asset type, the raise you need, and where it is, then create your entrepreneur account.",
    eyebrow: "For Entrepreneurs",
    title: "Bring your project to ChesState.",
    intro:
      "Tell us what you're building and how much you need to raise. Every question below is optional — answer what you can now and fill in the rest later from your dashboard.",
    optional: "optional",
    required: "required",
    projectSectionTitle: "Your project",
    propertyTypeLabel: "Property type",
    propertyTypePlaceholder: "Select a property type",
    propertyTypes: {
      residential_apartment: "Residential apartment",
      residential_building: "Residential building",
      villa: "Villa",
      office: "Office space",
      retail: "Retail",
      hospitality: "Hotel & hospitality",
      industrial_logistics: "Industrial & logistics",
      mixed_use: "Mixed use",
      land: "Land / development plot",
      other: "Other",
    },
    fundingLabel: "Funding required",
    fundingHelp:
      "Type an amount or drag the slider — whichever you use, the other follows.",
    fundingSliderLabel: "Funding required, in US dollars",
    locationSectionTitle: "Location",
    cityLabel: "City",
    cityPlaceholder: "Select a city",
    neighborhoodLabel: "Neighbourhood",
    neighborhoodPlaceholder: "Select a neighbourhood",
    neighborhoodPickCityFirst: "Choose a city first",
    accountSectionTitle: "Your account",
    accountHelp:
      "This creates your entrepreneur account, which is kept entirely separate from the investor waiting list.",
    emailLabel: "Email address",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 8 characters",
    passwordHelp: "Use at least 8 characters.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submit: "Create account",
    submitting: "Creating account…",
    successTitle: "Check your inbox.",
    successBody:
      "We've sent a confirmation link to your email. Open it to activate your account, then sign in to review or update your project details.",
    errorGeneric: "Something went wrong. Please try again.",
    errorEmail: "Enter a valid email address.",
    errorPassword: "Your password must be at least 8 characters.",
    errorTaken: "An account already exists for this email. Try signing in.",
    errorNotConfigured:
      "Sign-ups aren't connected yet. Add your Supabase keys to .env.local to enable them.",
    haveAccount: "Already have an account?",
    signIn: "Sign in",
    backHome: "Back to home",
    consent:
      "I agree to the Terms of use and Privacy policy, and I consent to ChesState processing this application.",
  },
  auth: {
    loginTitle: "Entrepreneur sign in",
    loginIntro: "Sign in to review or update your project details.",
    emailLabel: "Email address",
    passwordLabel: "Password",
    signIn: "Sign in",
    signingIn: "Signing in…",
    noAccount: "Don't have an account yet?",
    applyHere: "Submit your project",
    invalidCredentials: "That email and password don't match an account.",
    notConfigured:
      "Sign-in isn't connected yet. Add your Supabase keys to .env.local to enable it.",
    dashboardTitle: "Your project",
    dashboardWelcome: "Signed in as",
    signOut: "Sign out",
    yourApplication: "Submitted details",
    propertyType: "Property type",
    fundingTarget: "Funding required",
    city: "City",
    neighborhood: "Neighbourhood",
    notProvided: "Not provided",
    submittedOn: "Submitted on",
    noApplication:
      "We don't have any project details for this account yet.",
    emailUnconfirmed:
      "Please confirm your email address using the link we sent you.",
  },
  platform: {
    nav: {
      overview: "Overview",
      project: "Project",
      milestones: "Milestones",
      settings: "Settings",
      backToSite: "Back to site",
      sectionLabel: "Platform",
    },
    preview: {
      title: "Preview mode",
      body: "Supabase isn't connected yet, so this is sample data and nothing you change will be saved. Add your keys to .env.local to switch to real data.",
    },
    statusLabel: "Status",
    status: {
      draft: "Draft",
      in_review: "In review",
      approved: "Approved",
      live: "Live",
    },
    statusHint: {
      draft: "Only you can see this. Fill in the details below, then submit it for review.",
      in_review: "Our team is reviewing your project. We'll be in touch if anything is missing.",
      approved: "Approved, pending the licensing work described in our FAQ before it can be listed.",
      live: "Open to investors.",
    },
    overview: {
      title: "Overview",
      subtitle: "Where your project stands today.",
      fundingTarget: "Funding required",
      propertyType: "Property type",
      location: "Location",
      totalValue: "Asset value",
      timeline: "Timeline",
      timelineUnit: "months",
      notSet: "Not set",
      readiness: "Project readiness",
      readinessHelp:
        "Projects need all of this before they can go to review.",
      checklist: {
        name: "Name your project",
        propertyType: "Choose a property type",
        funding: "Set the funding you need",
        location: "Add a city and neighbourhood",
        description: "Describe the project",
        milestones: "Define at least two milestones",
      },
      allocated: "Funds allocated to milestones",
      allocatedHelp:
        "Escrow releases each slice only when that milestone is met.",
      reviewNote:
        "Nothing here is published. ChesState cannot accept investment until the approvals described in our FAQ are in place.",
    },
    project: {
      title: "Project",
      subtitle: "The details investors will see once your project is listed.",
      nameLabel: "Project name",
      namePlaceholder: "Marina District Residences",
      descriptionLabel: "Description",
      descriptionPlaceholder:
        "What is being built, who it is for, and how it earns income.",
      descriptionHelp:
        "Write it for someone investing $9.99 who has never bought property.",
      totalValueLabel: "Total asset value",
      totalValueHelp:
        "The full value of the asset, not just the portion you are raising.",
      timelineLabel: "Expected timeline",
      timelineHelp: "In months, from funding to completion.",
    },
    milestones: {
      title: "Milestones",
      subtitle:
        "Funds sit in escrow and are released as each milestone is met, rather than paid to you upfront.",
      add: "Add milestone",
      empty: "No milestones yet. Add the first one to describe how funds get released.",
      milestoneNumber: "Milestone",
      titleLabel: "Title",
      titlePlaceholder: "Foundation complete",
      descriptionLabel: "What proves it is done",
      descriptionPlaceholder: "Engineer's sign-off and site photos.",
      dateLabel: "Target date",
      releaseLabel: "Release",
      remove: "Remove",
      allocated: "Allocated",
      over100: "Milestones release more than 100% of the raise.",
      unallocated: "unallocated",
    },
    settings: {
      title: "Settings",
      subtitle: "Your account and preferences.",
      emailLabel: "Email address",
      emailHelp:
        "This is your entrepreneur account, separate from the investor list.",
      languageLabel: "Language",
      languageHelp: "Applies across the site and the platform.",
      passwordTitle: "Password",
      passwordBody:
        "We'll email you a link to choose a new one.",
      sendReset: "Send reset link",
      sendingReset: "Sending…",
      resetSent: "Check your inbox for the reset link.",
      signOutTitle: "Sign out",
      signOutBody: "End this session on this device.",
    },
    save: "Save changes",
    saving: "Saving…",
    saved: "Saved",
    saveError: "Could not save. Please try again.",
    readOnlyInPreview: "Connect Supabase to save changes.",
  },
  invest: {
    metaTitle: "Projects — ChesState",
    metaDescription:
      "Browse sample UAE property projects on ChesState. Registering a stake does not invest money.",
    nav: {
      projects: "Projects",
      portfolio: "Your stakes",
      sectionLabel: "Platform",
      backToSite: "Back to site",
    },
    gate: {
      eyebrow: "Early access",
      title: "Enter with the email you registered.",
      body: "The platform is open to people on the interest list. Joining still doesn't invest any money or commit you to anything.",
      submit: "Continue",
      submitting: "Continuing…",
    },
    browse: {
      eyebrow: "UAE · sample projects",
      title: "A slice of a building, not the whole thing.",
      subtitle:
        "These listings show how a project would look once ChesState is licensed. They are not live raises, and the planned minimum is $9.99.",
      caption: "Sample interface — not a live listing or an available investment.",
      minStake: "From",
      funded: "funded",
      view: "View project",
    },
    detail: {
      back: "All projects",
      about: "About this project",
      milestones: "How funds would be released",
      minLabel: "Planned minimum",
      registerStake: "Register a $9.99 stake",
      registering: "Recording…",
      recordedTitle: "Stake noted — not invested.",
      recordedBody:
        "We've recorded your interest at $9.99. No card was charged. ChesState will not accept a dollar of investment until the approvals in our FAQ are in place.",
      cannotInvest:
        "This is a sample listing. Registering a stake records interest only.",
      sampleCaption:
        "Sample interface — not a live listing or an available investment.",
    },
    portfolio: {
      title: "Your stakes",
      subtitle:
        "Interest you've recorded. None of this is an investment, and none of it can be sold today.",
      empty: "You haven't recorded a stake yet.",
      emptyCta: "Browse projects",
      amount: "Noted amount",
      project: "Project",
      date: "Recorded",
      sampleNote:
        "Real estate is illiquid. Plan on leaving a stake in place for the full life of the project.",
    },
    listings: {
      "marina-district-residences": {
        summary: "Residential building two streets back from Dubai Marina.",
        about:
          "A 48-unit residential block bought at shell stage and finished for long-let tenancy. Income would come from rent once the building is handed over. This is the same project shown as an illustrative example on the public site.",
        milestoneOne: "Purchase completed and title registered.",
        milestoneTwo: "Handover and first signed lease.",
      },
      "al-reem-office-yards": {
        summary: "Floor of Grade-A offices on Al Reem Island.",
        about:
          "A slice of an existing office building with tenants already in place. The raise would refinance a floor, not start a construction site, so the main risk is vacancy and rent rather than build delay.",
        milestoneOne: "Lease review and title check complete.",
        milestoneTwo: "Refinance closed and rents assigned to escrow.",
      },
      "dubai-hills-courtyard": {
        summary: "A courtyard of family villas in Dubai Hills Estate.",
        about:
          "Four villas on one plot, let to families on two-year contracts. The raise is for the remaining construction and fit-out, not for land. Designed as a long hold, not a flip.",
        milestoneOne: "Structure signed off by the engineer.",
        milestoneTwo: "First tenancy on each villa.",
      },
      "yas-harbour-suites": {
        summary: "Serviced suites next to the Yas Island waterfront.",
        about:
          "A hospitality asset that earns from short stays rather than annual leases. Nightly rates move with tourism, so returns would vary more than a residential let — that is the point of showing it here, not a promise.",
        milestoneOne: "Operator agreement signed.",
        milestoneTwo: "First 90 days of occupancy reported.",
      },
    },
  },
};
