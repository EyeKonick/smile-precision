// Clinic assistant knowledge & intent matcher (same engine as the Dental Heights assistant).
// Reads strictly from the clinic's data in site.ts and services.json and never invents prices,
// credentials or results. Hours are only quoted as "to confirm" until site.hoursConfirmed is true.

import { site } from './site';
import servicesData from './services.json';

export interface ChatAction {
  label: string;
  href: string;
  external?: boolean;
  icon?: 'phone' | 'messenger' | 'directions' | 'calendar' | 'mail' | 'arrow';
  service?: string;
}

export interface ChatReply {
  paragraphs: string[];
  actions?: ChatAction[];
  suggestions: string[];
}

interface ServiceMatcher {
  name: string;
  keywords: string[];
  caseNote?: string;
}

// Keywords include common Tagalog and Kapampangan words patients in Pampanga use.
const serviceMatchers: ServiceMatcher[] = [
  {
    name: 'No-prep veneers',
    keywords: ['no prep', 'no-prep', 'noprep', 'no drill', 'no-drill', 'without drilling', 'minimal prep', 'walang drill'],
    caseNote: 'You can see a real no-prep veneer case in our Smiles section on the home page.',
  },
  {
    name: 'Direct composite veneers',
    keywords: ['composite', 'direct veneer', 'direct veneers', 'bonding', 'gap', 'gaps', 'siwang', 'chipped', 'chip', 'basag', 'reshape'],
    caseNote: 'We have a real composite veneer case, done to close a front gap during braces, on our Services page.',
  },
  {
    name: 'Porcelain veneers',
    keywords: ['porcelain', 'ceramic', 'emax', 'e.max', 'lab veneer'],
  },
  {
    name: 'Laser teeth whitening',
    keywords: ['whiten', 'whitening', 'bleach', 'bleaching', 'laser', 'stain', 'stains', 'yellow', 'dilaw', 'paputi', 'pampaputi', 'maputi'],
  },
  {
    name: 'Smile makeover',
    keywords: ['makeover', 'smile design', 'transformation', 'whole smile', 'full smile', 'hollywood'],
  },
  {
    name: 'Consultation & check-up',
    keywords: ['consult', 'consultation', 'checkup', 'check-up', 'check up', 'exam', 'pacheck', 'patingin'],
  },
  {
    name: 'Cleaning',
    keywords: ['cleaning', 'clean', 'prophylaxis', 'scaling', 'polish', 'tartar', 'plaque', 'linis', 'palinis'],
  },
  {
    name: 'Fillings',
    keywords: ['filling', 'fillings', 'pasta', 'papasta', 'cavity', 'cavities', 'decay', 'butas', 'sira'],
  },
  {
    name: 'Tooth extraction',
    keywords: ['extraction', 'extract', 'remove', 'pull', 'bunot', 'pabunot', 'wisdom', 'impacted'],
  },
  {
    name: 'Braces',
    keywords: ['brace', 'braces', 'ortho', 'orthodontic', 'crooked', 'align', 'straighten', 'brackets', 'sungki', 'bungi'],
  },
];

// Generic "veneers" with no type named: answer with all three veneer options.
const veneerWords = ['veneer', 'veneers', 'venner', 'vineer'];

export const initialSuggestions = [
  'Which veneers are right for me?',
  'What services do you offer?',
  'Where is the clinic?',
  'How do I book?',
  'How much do veneers cost?',
];

const bookHref = (service?: string) =>
  service ? `/contact?service=${encodeURIComponent(service)}#book` : site.bookingUrl;

const defaultBookingActions: ChatAction[] = [
  { label: 'Message on Messenger', href: site.messengerUrl, external: true, icon: 'messenger' },
  { label: `Call ${site.phone.display}`, href: `tel:${site.phone.tel}`, icon: 'phone' },
];

const hoursText = site.hoursConfirmed
  ? `Our hours: ${site.hours.map((h) => `${h.days}, ${h.time}`).join('; ')}.`
  : `${site.hoursNote}.`;

export const welcomeMessage: ChatReply = {
  paragraphs: [
    `Hi! Welcome to ${site.legalName} in San Fernando, Pampanga.`,
    'I can help with veneers, whitening and our other treatments, directions to the clinic, or booking a visit with Dr. Tristan Songco.',
  ],
  actions: [
    { label: 'Book an appointment', href: bookHref(), icon: 'calendar' },
    { label: `Call ${site.phone.display}`, href: `tel:${site.phone.tel}`, icon: 'phone' },
  ],
  suggestions: initialSuggestions,
};

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => {
    if (term.includes(' ')) return text.includes(term);
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    return regex.test(text);
  });
}

export function getBotReply(rawInput: string): ChatReply {
  const q = rawInput.trim().toLowerCase();

  // 1. Greeting (English, Tagalog, Kapampangan)
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|magandang umaga|magandang hapon|magandang gabi|kumusta|musta|mayap a abak|mayap a gatpanapun|mayap a bengi|komusta)[!.,?\s]*$/i.test(q)) {
    return {
      paragraphs: [
        `Hello! How can we help with your smile today?`,
        'Ask about a treatment (no-prep veneers, composite veneers, whitening, cleaning, fillings), where we are on MacArthur Highway, or how to book.',
      ],
      actions: defaultBookingActions,
      suggestions: ['Which veneers are right for me?', 'Where is the clinic?', 'How do I book?'],
    };
  }

  // 2. Thank you / closing
  if (/^(thanks|thank you|salamat|maraming salamat|dakal a salamat|salamat po|ty|thx)[!.,?\s]*$/i.test(q)) {
    return {
      paragraphs: [
        `You’re welcome! We look forward to seeing you at ${site.addressLine}, ${site.address.city}.`,
      ],
      actions: defaultBookingActions,
      suggestions: ['Where is the clinic?', 'How do I book?', 'What services do you offer?'],
    };
  }

  const matchedServices = serviceMatchers.filter((m) => includesAny(q, m.keywords));
  const asksVeneersGeneric = matchedServices.length === 0 && includesAny(q, veneerWords);

  const asksPrice = includesAny(q, [
    'price', 'prices', 'cost', 'costs', 'rate', 'rates', 'fee', 'fees', 'how much',
    'magkano', 'presyo', 'halaga', 'pilan', 'bayad', 'budget', 'affordable', 'cheap', 'mura',
    'downpayment', 'down payment', 'installment', 'hulugan', 'hmo', 'insurance',
  ]);

  const asksLocation = includesAny(q, [
    'where', 'location', 'located', 'address', 'direction', 'directions', 'map', 'macarthur',
    'stci', 'san fernando', 'san agustin', 'saan', 'nasaan', 'nokarin', 'landmark', 'floor', 'parking', 'pampanga',
  ]);

  const asksHours = includesAny(q, [
    'hour', 'hours', 'open', 'close', 'closed', 'closing', 'opening', 'schedule', 'time',
    'sunday', 'saturday', 'weekend', 'today', 'tomorrow', 'bukas', 'sarado', 'oras', 'what time',
  ]);

  const asksBooking = includesAny(q, [
    'book', 'booking', 'appointment', 'schedule a', 'walk-in', 'walk in', 'walkin',
    'reserve', 'contact', 'phone', 'number', 'call', 'messenger', 'email', 'message', 'pa-appointment', 'pa schedule',
  ]);

  const asksPainOrUrgent = includesAny(q, [
    'pain', 'hurt', 'hurts', 'toothache', 'ache', 'aching', 'swollen', 'swelling', 'bleeding',
    'broken', 'cracked', 'emergency', 'urgent', 'masakit', 'sakit', 'namamaga', 'maga', 'masakit ngipin',
  ]);

  const asksSmilesOrReviews = includesAny(q, [
    'before and after', 'before/after', 'case', 'cases', 'result', 'results', 'photo', 'photos',
    'gallery', 'review', 'reviews', 'testimonial', 'testimonials', 'feedback', 'recommend',
  ]);

  const asksDentist = includesAny(q, ['dentist', 'doctor', 'dr', 'dra', 'songco', 'tristan', 'who', 'trained', 'experience']);

  const asksAllServices = includesAny(q, [
    'service', 'services', 'offer', 'treatment', 'treatments', 'procedure', 'procedures', 'what do you do', 'ano',
  ]);

  // 3. Urgent / toothache
  if (asksPainOrUrgent) {
    return {
      paragraphs: [
        'Sorry to hear your tooth is bothering you. The first step is a consultation so we can see what’s causing it. Depending on what we find, that may mean a filling or an extraction if a tooth can’t be saved.',
        `Please call or text ${site.phone.display}, or message us on Messenger, so our team can fit you in as soon as possible.`,
      ],
      actions: [
        { label: `Call ${site.phone.display}`, href: `tel:${site.phone.tel}`, icon: 'phone' },
        { label: 'Message on Messenger', href: site.messengerUrl, external: true, icon: 'messenger' },
      ],
      suggestions: ['Where is the clinic?', 'Tell me about fillings', 'Tell me about tooth extraction'],
    };
  }

  // 4. "Veneers" with no type: compare the three options
  if (asksVeneersGeneric) {
    const veneers = servicesData.services.filter((s) => s.category === 'veneers');
    const paragraphs = [
      'Veneers are our specialty, with 10,000+ cases and counting. We offer three kinds:',
      ...veneers.map((v) => `${v.name}: ${v.description}`),
      asksPrice
        ? `Cost depends on the type and how many teeth are involved, so we don’t list fixed prices online. Message us or call ${site.phone.display} and we’ll guide you.`
        : 'At your consultation we’ll recommend the most conservative option that gets you the result you want.',
    ];
    return {
      paragraphs,
      actions: [
        { label: 'Book a veneer consultation', href: bookHref('No-prep veneers'), icon: 'calendar', service: 'No-prep veneers' },
        { label: 'Compare veneers', href: '/services#veneers', icon: 'arrow' },
        ...defaultBookingActions,
      ],
      suggestions: ['Tell me about no-prep veneers', 'Tell me about composite veneers', 'How do I book?'],
    };
  }

  // 5. Specific service(s) matched (with a price note if they asked "how much is...")
  if (matchedServices.length > 0) {
    const paragraphs: string[] = [];
    const actions: ChatAction[] = [];

    for (const match of matchedServices.slice(0, 3)) {
      const serviceInfo = servicesData.services.find((s) => s.name === match.name);
      if (serviceInfo) paragraphs.push(`${serviceInfo.name}: ${serviceInfo.description}`);
      if (match.caseNote) paragraphs.push(match.caseNote);
    }

    if (asksPrice) {
      paragraphs.push(
        `Because every smile is different (how many teeth, which material), we don’t list fixed prices online. Send us a message on Messenger or call ${site.phone.display} and tell us what you have in mind.`,
      );
    } else {
      paragraphs.push(`Ready for us to take a look? Book a visit, message us on Messenger, or call ${site.phone.display}.`);
    }

    const first = matchedServices[0].name;
    actions.push({ label: `Book ${first}`, href: bookHref(first), icon: 'calendar', service: first });
    actions.push(...defaultBookingActions);
    actions.push(
      matchedServices.some((m) => m.caseNote)
        ? { label: 'See real results', href: '/services#results', icon: 'arrow' }
        : { label: 'View all services', href: '/services', icon: 'arrow' },
    );

    return {
      paragraphs,
      actions,
      suggestions: ['How do I book?', 'Where is the clinic?', 'What other services do you offer?'],
    };
  }

  // 6. Price / HMO with no specific service
  if (asksPrice) {
    return {
      paragraphs: [
        'Costs depend on what your teeth need and which treatment is right for you, so we quote after a quick look rather than online.',
        `Message us on Messenger with the treatment you’re interested in, or call ${site.phone.display}, and our team will give you a clear estimate.`,
      ],
      actions: defaultBookingActions,
      suggestions: ['Which veneers are right for me?', 'Tell me about laser whitening', 'What services do you offer?'],
    };
  }

  // 7. Location & directions (with hours if asked together)
  if (asksLocation) {
    const paragraphs = [
      `We’re at ${site.addressLine}, ${site.cityLine}.`,
      asksHours
        ? `${hoursText} Message us on Messenger or call ${site.phone.display} to confirm a time that suits you.`
        : 'Tap below to open Google Maps, or message us before heading over and we’ll make sure we’re ready for you.',
    ];
    return {
      paragraphs,
      actions: [
        { label: 'Get directions', href: site.mapsUrl, external: true, icon: 'directions' },
        { label: `Call ${site.phone.display}`, href: `tel:${site.phone.tel}`, icon: 'phone' },
      ],
      suggestions: ['What are your clinic hours?', 'How do I book?', 'What services do you offer?'],
    };
  }

  // 8. Clinic hours
  if (asksHours) {
    return {
      paragraphs: [
        `${hoursText} Send us a message on Messenger or call ${site.phone.display} with the day and time you’d like, and our team will confirm.`,
      ],
      actions: [{ label: 'Request a time', href: bookHref(), icon: 'calendar' }, ...defaultBookingActions],
      suggestions: ['Where is the clinic?', 'How do I book?', 'What services do you offer?'],
    };
  }

  // 9. Booking / contact
  if (asksBooking) {
    return {
      paragraphs: [
        'Booking is quick: fill in the appointment form with your treatment and preferred day, then send it to us on Messenger or by email. Or just call or text us.',
        `Phone: ${site.phone.display} · Email: ${site.email}`,
      ],
      actions: [
        { label: 'Open the booking form', href: bookHref(), icon: 'calendar' },
        { label: 'Message on Messenger', href: site.messengerUrl, external: true, icon: 'messenger' },
        { label: `Call ${site.phone.display}`, href: `tel:${site.phone.tel}`, icon: 'phone' },
      ],
      suggestions: ['Where is the clinic?', 'What services do you offer?', 'What are your clinic hours?'],
    };
  }

  // 10. Before & after / reviews
  if (asksSmilesOrReviews) {
    return {
      paragraphs: [
        'All our before-and-after photos are real patients: no-prep veneers, direct composite veneers and full smile makeovers.',
        'And 100% of the 20 people who reviewed us on Facebook recommend Smile Precision.',
      ],
      actions: [
        { label: 'See real results', href: '/services#results', icon: 'arrow' },
        { label: 'Read reviews', href: site.facebookUrl, external: true, icon: 'arrow' },
      ],
      suggestions: ['Which veneers are right for me?', 'How do I book?', 'What services do you offer?'],
    };
  }

  // 11. About the dentist
  if (asksDentist) {
    return {
      paragraphs: [
        `Our lead dentist is ${site.dentist}, who is internationally trained. Smile Precision has completed more than 10,000 veneer cases.`,
        'The approach is conservative: keep as much natural tooth as possible and choose the gentlest option that works.',
      ],
      actions: [
        { label: 'About the clinic', href: '/about', icon: 'arrow' },
        { label: 'Book a consultation', href: bookHref('Consultation & check-up'), icon: 'calendar', service: 'Consultation & check-up' },
      ],
      suggestions: ['Which veneers are right for me?', 'How do I book?', 'Where is the clinic?'],
    };
  }

  // 12. All services overview
  if (asksAllServices) {
    const names = servicesData.services.map((s) => s.name).join(', ');
    return {
      paragraphs: [
        `At ${site.name} we offer: ${names}.`,
        'Ask me about any of them, or browse the Services page.',
      ],
      actions: [{ label: 'Browse services', href: '/services', icon: 'arrow' }, ...defaultBookingActions],
      suggestions: ['Which veneers are right for me?', 'Tell me about laser whitening', 'Tell me about cleaning', 'How do I book?'],
    };
  }

  // 13. Fallback
  return {
    paragraphs: [
      `I only want to give you accurate details about our clinic. For anything specific, please message our team on Messenger or call ${site.phone.display}.`,
      'You can also ask me about veneers, whitening, our other treatments, our location on MacArthur Highway, or how to book.',
    ],
    actions: defaultBookingActions,
    suggestions: initialSuggestions.slice(0, 4),
  };
}
