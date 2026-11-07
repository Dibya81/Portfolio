export const profile = {
  name: "Dibya Bhusal",
  shortName: "DB",
  role: "Software engineer",
  focus: "Full-stack · Backend & IoT · AI agents",
  headline:
    "I build systems that have to be trusted: local AI agents that explain their decisions, chains you can verify, and machines that fail safely.",
  location: "From Nepal · studying in Bengaluru, India",
  email: "dibyabhusal81@gmail.com",
  phone: "+91 9035504514",
  phoneHref: "tel:+919035504514",
  links: {
    github: "https://github.com/Dibya81",
    linkedin: "https://www.linkedin.com/in/dibya-bhusal-72401b215",
    x: "https://x.com/dibya_bhusal",
  },
  resumePdf: "/resume/Dibya_Bhusal_Resume.pdf",
  about: [
    "I'm Dibya, a B.Tech Computer Science student at REVA University in Bengaluru, originally from Nepal, specialising in IoT, cybersecurity and blockchain.",
    "I'm drawn to problems where software meets the physical world and has to be trusted: a refinery that must reroute safely when a sensor dies, a kiosk that must never print the same job twice, a forecast that has to admit how uncertain it is.",
    "My recent projects document their own limits: what was measured, what was simulated, what isn't done yet. I'd rather show an honest number than a flattering one.",
  ],
} as const;

export const education = {
  institution: "REVA University",
  degree: "B.Tech, Computer Science & Engineering",
  specialisation: "IoT, Cybersecurity & Blockchain Technology",
  period: "Aug 2024 – May 2028",
  location: "Bengaluru, India",
  coursework: [
    "Data Structures & Algorithms",
    "Cybersecurity",
    "Blockchain Technology",
    "Internet of Things",
    "Artificial Intelligence",
    "Quantum Computing",
    "Software Engineering",
  ],
} as const;

export const recognition = [
  {
    title: "1st place · Solana track",
    detail: "Hackathon win for TRI-ZEROTRO (Phantom), built with a team of three.",
    project: "phantom",
    short: "TRI-ZEROTRO, team of three",
  },
  {
    title: "4th place · Namma Security 2.0",
    detail: "National-level hackathon (Presidency University) for KAVACH, an automated detect → analyze → decide → act security pipeline.",
    project: "kavach",
    short: "KAVACH, national-level",
  },
] as const;

export const certificates = [
  { src: "/certificates/google-cloud.webp", title: "Google Cloud: Prompt Design in Vertex AI", width: 1400, height: 1044 },
  { src: "/certificates/code-crusade-2025.webp", title: "Code Crusade 2025 Hackathon", width: 1024, height: 720 },
  { src: "/certificates/hackathon.webp", title: "Hackathon participation", width: 1400, height: 981 },
  { src: "/certificates/data-fundamentals.webp", title: "Data Fundamentals", width: 1400, height: 1084 },
  { src: "/certificates/mathematics.webp", title: "Mathematics", width: 1400, height: 924 },
] as const;

export const beyondCode = {
  cricket: {
    title: "State-level cricketer",
    detail: "Represented the state team in U16 & U19 national tournaments.",
    photos: [
      { src: "/life/cricket-trophy.webp", alt: "Dibya holding a tournament trophy on the cricket ground", width: 384, height: 576 },
      { src: "/life/cricket-field.webp", alt: "Dibya on the field in team kit", width: 900, height: 1101 },
    ],
  },
  tableTennis: {
    title: "State-level table tennis player",
    detail: "Plays for the state senior team.",
  },
  photography: {
    title: "Photography",
    detail: "Mostly Nepal: hills, weather and old architecture.",
    photos: [
      { src: "/life/himalaya.webp", alt: "Snow-covered Himalayan peak above haze", width: 1100, height: 733 },
      { src: "/life/storm-sunset.webp", alt: "Storm clouds lit orange at sunset over a town", width: 1100, height: 825 },
      { src: "/life/janaki-mandir.webp", alt: "Janaki Mandir temple facade at dusk", width: 1100, height: 825 },
      { src: "/life/valley.webp", alt: "Hazy valley seen from a forested ridge", width: 1100, height: 825 },
      { src: "/life/city-dusk.webp", alt: "City lights under a glowing sky at dusk", width: 1100, height: 825 },
      { src: "/life/hill-trail.webp", alt: "Trail along green hills", width: 1100, height: 406 },
    ],
  },
} as const;
