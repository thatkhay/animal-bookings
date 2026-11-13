import { unsplash } from "../utils";
import type { Faq, Testimonial } from "../types";

export const testimonials: Testimonial[] = [
  {
    quote:
      "Same walker, same two afternoons, for a year and a half. Biscuit sits by the window at 1:55 every Tuesday. I don't even think about booking anymore.",
    name: "Sam R.",
    pet: "Biscuit & Juniper",
    zone: "Northside",
    photo: unsplash("1543466835-00a7907e9de1"),
  },
  {
    quote:
      "Pepper is reactive and I've had walkers quit on me. Pawlane actually read her notes. The walker crosses the street before I'd even have noticed the other dog.",
    name: "Hana K.",
    pet: "Pepper",
    zone: "Riverbend",
    photo: unsplash("1561037404-61cd46aa615b"),
  },
  {
    quote:
      "The puppy sessions were worth every cent. Bruno went from hiding behind my legs to greeting the mail carrier in three weeks.",
    name: "Theo L.",
    pet: "Bruno",
    zone: "Cedar Heights",
    photo: unsplash("1541599540903-216a46ca1dc0"),
  },
];

export const faqs: Faq[] = [
  {
    q: "What's a lane, and why does my day matter?",
    a: "A lane is one neighborhood and the walker who covers it. Each lane runs on set days, so when you book on your lane day your walker is already on your street — that's why lane-day visits cost a few dollars less and almost never get rescheduled.",
  },
  {
    q: "Can I book something that isn't on my lane day?",
    a: "Yes. Any day with open slots can be booked. We'll route a walker from a nearby lane, and the regular price applies.",
  },
  {
    q: "How do recurring slots work?",
    a: "Pick the days and the time once — say every Tuesday and Thursday at 2 PM — and we hold that slot for you each week. You can skip a single visit, pause the whole plan, or change days from your account at any time.",
  },
  {
    q: "Why do you need vaccination records?",
    a: "Pack walks and puppy sessions put dogs close together. We ask for rabies and DHPP for every dog, and bordetella for pack walks. Upload them once in your pet's profile; we'll remind you before anything expires.",
  },
  {
    q: "When is my booking confirmed?",
    a: "New bookings arrive as a request. We check pet profiles and route capacity, then confirm by email — usually within two hours during the day. Nothing is charged until a visit is completed.",
  },
  {
    q: "What if my pet doesn't get along with the pack?",
    a: "Then we move them to a Solo Stroll at the pack-walk price for the rest of that week, and work out the right fit together. Your walker's notes go straight into the pet profile.",
  },
];
