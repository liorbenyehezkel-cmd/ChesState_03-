export const propertyTypeKeys = [
  "residential_apartment",
  "residential_building",
  "villa",
  "office",
  "retail",
  "hospitality",
  "industrial_logistics",
  "mixed_use",
  "land",
  "other",
] as const;

export type PropertyTypeKey = (typeof propertyTypeKeys)[number];

export type FaqItem = {
  question: string;
  /** Paragraphs are separated by a blank line. */
  answer: string;
};

export const projectStatuses = [
  "draft",
  "in_review",
  "approved",
  "live",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export type Dictionary = {
  nav: {
    howItWorks: string;
    faq: string;
    forEntrepreneurs: string;
    registerInterest: string;
    home: string;
    mainLabel: string;
    footerLabel: string;
  };
  language: {
    label: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    microcopy: string;
  };
  example: {
    eyebrow: string;
    tag: string;
    title: string;
    location: string;
    yourStake: string;
    invested: string;
    stakeRecorded: string;
    projectFunding: string;
    progressLabel: string;
    caption: string;
  };
  trust: {
    sectionLabel: string;
    minimum: string;
    noWallet: string;
    vara: string;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    highlight: string;
    statement: string;
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  footer: {
    tagline: string;
    platform: string;
    terms: string;
    privacy: string;
    cookies: string;
    refunds: string;
  };
  modal: {
    title: string;
    description: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    countryLabel: string;
    submit: string;
    submitting: string;
    reassurance: string;
    error: string;
    successTitle: string;
    successBody: string;
    enterPlatform: string;
    done: string;
    close: string;
    consent: string;
  };
  entrepreneurs: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    optional: string;
    required: string;
    projectSectionTitle: string;
    propertyTypeLabel: string;
    propertyTypePlaceholder: string;
    propertyTypes: Record<PropertyTypeKey, string>;
    fundingLabel: string;
    fundingHelp: string;
    fundingSliderLabel: string;
    locationSectionTitle: string;
    cityLabel: string;
    cityPlaceholder: string;
    neighborhoodLabel: string;
    neighborhoodPlaceholder: string;
    neighborhoodPickCityFirst: string;
    accountSectionTitle: string;
    accountHelp: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordHelp: string;
    showPassword: string;
    hidePassword: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorGeneric: string;
    errorEmail: string;
    errorPassword: string;
    errorTaken: string;
    errorNotConfigured: string;
    haveAccount: string;
    signIn: string;
    backHome: string;
    consent: string;
  };
  auth: {
    loginTitle: string;
    loginIntro: string;
    emailLabel: string;
    passwordLabel: string;
    signIn: string;
    signingIn: string;
    noAccount: string;
    applyHere: string;
    invalidCredentials: string;
    notConfigured: string;
    dashboardTitle: string;
    dashboardWelcome: string;
    signOut: string;
    yourApplication: string;
    propertyType: string;
    fundingTarget: string;
    city: string;
    neighborhood: string;
    notProvided: string;
    submittedOn: string;
    noApplication: string;
    emailUnconfirmed: string;
  };
  platform: {
    nav: {
      overview: string;
      project: string;
      milestones: string;
      settings: string;
      backToSite: string;
      sectionLabel: string;
    };
    preview: {
      title: string;
      body: string;
    };
    statusLabel: string;
    status: Record<ProjectStatus, string>;
    statusHint: Record<ProjectStatus, string>;
    overview: {
      title: string;
      subtitle: string;
      fundingTarget: string;
      propertyType: string;
      location: string;
      totalValue: string;
      timeline: string;
      timelineUnit: string;
      notSet: string;
      readiness: string;
      readinessHelp: string;
      checklist: {
        name: string;
        propertyType: string;
        funding: string;
        location: string;
        description: string;
        milestones: string;
      };
      allocated: string;
      allocatedHelp: string;
      reviewNote: string;
    };
    project: {
      title: string;
      subtitle: string;
      nameLabel: string;
      namePlaceholder: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      descriptionHelp: string;
      totalValueLabel: string;
      totalValueHelp: string;
      timelineLabel: string;
      timelineHelp: string;
    };
    milestones: {
      title: string;
      subtitle: string;
      add: string;
      empty: string;
      milestoneNumber: string;
      titleLabel: string;
      titlePlaceholder: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      dateLabel: string;
      releaseLabel: string;
      remove: string;
      allocated: string;
      over100: string;
      unallocated: string;
    };
    settings: {
      title: string;
      subtitle: string;
      emailLabel: string;
      emailHelp: string;
      languageLabel: string;
      languageHelp: string;
      passwordTitle: string;
      passwordBody: string;
      sendReset: string;
      sendingReset: string;
      resetSent: string;
      signOutTitle: string;
      signOutBody: string;
    };
    save: string;
    saving: string;
    saved: string;
    saveError: string;
    readOnlyInPreview: string;
  };
  invest: {
    metaTitle: string;
    metaDescription: string;
    nav: {
      projects: string;
      portfolio: string;
      sectionLabel: string;
      backToSite: string;
    };
    gate: {
      eyebrow: string;
      title: string;
      body: string;
      submit: string;
      submitting: string;
    };
    browse: {
      eyebrow: string;
      title: string;
      subtitle: string;
      caption: string;
      minStake: string;
      funded: string;
      view: string;
    };
    detail: {
      back: string;
      about: string;
      milestones: string;
      minLabel: string;
      registerStake: string;
      registering: string;
      recordedTitle: string;
      recordedBody: string;
      cannotInvest: string;
      sampleCaption: string;
    };
    portfolio: {
      title: string;
      subtitle: string;
      empty: string;
      emptyCta: string;
      amount: string;
      project: string;
      date: string;
      sampleNote: string;
    };
    listings: Record<
      | "marina-district-residences"
      | "al-reem-office-yards"
      | "dubai-hills-courtyard"
      | "yas-harbour-suites",
      { summary: string; about: string; milestoneOne: string; milestoneTwo: string }
    >;
  };
};
