export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ISODate = string;

export type ClockTime = string;

export type Species = "dog" | "cat";

export type ServiceId =
  | "pack-walk"
  | "solo-stroll"
  | "puppy-social"
  | "drop-in"
  | "sitter-consult";

export interface Service {
  id: ServiceId;
  name: string;
  tagline: string;
  description: string;
  durationMin: number;
  price: number;
  laneDayDiscount: number;
  recurring: boolean;
  species: Species[];
  capacity: number;
  image: string;
  includes: string[];
  slots: ClockTime[];
}

export interface Zone {
  id: string;
  code: string;
  name: string;
  postalCodes: string[];
  laneDays: Weekday[];
  walker: Walker;
  color: string;
  shape: string;
  label: { x: number; y: number };
}

export interface Walker {
  id: string;
  name: string;
  initials: string;
  since: string;
  certs: string[];
}

export interface Vaccination {
  name: string;
  givenOn: ISODate;
  expiresOn: ISODate;
}

export type VaccineStatus = "valid" | "expiring" | "expired";

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed: string;
  sex: "Male" | "Female";
  birthDate: ISODate;
  weightLb: number;
  photo: string;
  vaccinations: Vaccination[];
  behavior: {
    tags: string[];
    energy: 1 | 2 | 3 | 4 | 5;
    notes: string;
  };
  care: {
    feeding: string;
    medication: string;
    vet: string;
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  zoneId: string;
  memberSince: ISODate;
  point: { x: number; y: number };
}

export type Frequency = "weekly" | "biweekly";

export interface Subscription {
  id: string;
  clientId: string;
  petIds: string[];
  serviceId: ServiceId;
  days: Weekday[];
  time: ClockTime;
  frequency: Frequency;
  startDate: ISODate;
  status: "active" | "paused";
  pausedUntil?: ISODate;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  ref: string;
  clientId: string;
  petIds: string[];
  serviceId: ServiceId;
  date: ISODate;
  time: ClockTime;
  status: BookingStatus;
  zoneId: string;
  price: number;
  subscriptionId?: string;
  note?: string;
}

export interface VisitReport {
  bookingId: string;
  distanceMi: number;
  activeMin: number;
  checks: string[];
  note: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  pet: string;
  zone: string;
  photo: string;
}

export interface Faq {
  q: string;
  a: string;
}
