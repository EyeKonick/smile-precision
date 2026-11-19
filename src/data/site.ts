// Every clinic detail the site prints lives here. Components read from this file only.
// Facts below were taken from the clinic's Facebook page (cover, intro and "Details" panel).
//
// TO FILL IN before launch (search for "REPLACE"):
//   1. url            the production domain (canonical URL, share tags, sitemap)
//   2. facebookUrl    the clinic's Facebook page address
//   3. messengerUrl   https://m.me/<the same page username>
//   4. instagramUrl   the Instagram profile (the Facebook page links to Instagram but the handle isn't visible)
//   5. hours          PLACEHOLDER hours: confirm with the clinic, then set hoursConfirmed: true

const address = {
  unit: '2nd floor',
  building: 'STCI Building',
  street: 'MacArthur Hi-way',
  barangay: 'San Agustin',
  city: 'City of San Fernando',
  province: 'Pampanga',
  postalCode: '2000',
  country: 'PH',
};

const mapsQuery = `Smile Precision Dental Clinic, ${address.building}, ${address.street}, ${address.barangay}, ${address.city}, ${address.province}`;

export const site = {
  name: 'Smile Precision',
  legalName: 'Smile Precision Dental Clinic',
  tagline: 'The most recommended clinic for cosmetic dentistry in Pampanga.',
  description:
    'Smile Precision Dental Clinic in the City of San Fernando, Pampanga: no-prep, composite and porcelain veneers, laser teeth whitening and conservative everyday dentistry by Dr. Tristan Songco. Call 0917 558 0310.',

  url: 'https://REPLACE-WITH-YOUR-DOMAIN.com',

  dentist: 'Dr. Tristan Songco',

  address,
  addressLine: `${address.unit}, ${address.building}, ${address.street}, ${address.barangay}`,
  cityLine: `${address.city}, ${address.province} ${address.postalCode}`,
  phone: {
    display: '0917 558 0310',
    tel: '+639175580310',
  },
  email: 'smileprecisiondental@yahoo.com',

  facebookUrl: 'https://www.facebook.com/REPLACE-WITH-PAGE-USERNAME',
  messengerUrl: 'https://m.me/REPLACE-WITH-PAGE-USERNAME',
  instagramUrl: 'https://www.instagram.com/REPLACE-WITH-HANDLE',
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`,

  // Where every "Book your appointment" button goes.
  bookingUrl: '/contact#book',

  // PLACEHOLDER: not shown on the Facebook screenshots. Confirm with the clinic.
  hours: [
    { days: 'Monday – Saturday', time: '9:00 AM – 6:00 PM' },
    { days: 'Sunday', time: 'By appointment' },
  ],
  hoursConfirmed: false,
  hoursNote: 'Message us to confirm today’s schedule',

  // Hero proof bar. Every figure is from the Facebook page (option A). Keep them true.
  stats: [
    { value: '10,000+', label: 'Veneer cases' },
    { value: '100%', label: 'Recommend us, from 20 reviews' },
    { value: '46K', label: 'Facebook followers' },
    { value: 'Int’l', label: 'Trained lead dentist' },
  ],

  // The four promises from the Facebook intro, in the clinic's own words.
  promises: [
    { title: 'Internationally trained dentist', text: 'Our lead dentist, Dr. Tristan Songco, trained internationally and brings that standard to every chair.' },
    { title: '10,000+ veneer cases and counting', text: 'Veneers are our everyday work, not an occasional procedure.' },
    { title: '100% positive reviews', text: 'Every one of our 20 Facebook reviews recommends us. Read them on our page.' },
    { title: 'Conservative, multi-specialty treatment', text: 'We keep as much of your natural tooth as we can, and look after the rest of your mouth too.' },
  ],
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;
