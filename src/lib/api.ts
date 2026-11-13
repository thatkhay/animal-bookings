import { HUB, services, walkers, zones } from "./data/catalog";
import { bookings, reportFor, subscriptions } from "./data/bookings";
import { clients, CURRENT_CLIENT_ID, pets } from "./data/people";
import { faqs, testimonials } from "./data/content";
import { diffDays, TODAY } from "./schedule";
import type { Booking, Pet, Service, ServiceId, Vaccination, VaccineStatus, Zone } from "./types";

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getZones(): Promise<Zone[]> {
  return zones;
}

export async function getWalkers() {
  return walkers;
}

export async function getHub() {
  return HUB;
}

export async function getMarketingContent() {
  return { testimonials, faqs };
}

export function findService(id: ServiceId | string) {
  return services.find((s) => s.id === id);
}

export function findZone(id: string) {
  return zones.find((z) => z.id === id);
}

export function zoneForPostalCode(code: string): Zone | undefined {
  const clean = code.trim();
  return zones.find((z) => z.postalCodes.includes(clean));
}

export function vaccineStatus(v: Vaccination): VaccineStatus {
  const left = diffDays(v.expiresOn, TODAY);
  if (left < 0) return "expired";
  if (left <= 30) return "expiring";
  return "valid";
}

export function petVaccineStatus(pet: Pet): VaccineStatus {
  const statuses = pet.vaccinations.map(vaccineStatus);
  if (statuses.includes("expired")) return "expired";
  if (statuses.includes("expiring")) return "expiring";
  return "valid";
}

export async function getCurrentClient() {
  return clients.find((c) => c.id === CURRENT_CLIENT_ID)!;
}

export async function getPetsForClient(clientId = CURRENT_CLIENT_ID) {
  return pets.filter((p) => p.ownerId === clientId);
}

export async function getPet(id: string) {
  return pets.find((p) => p.id === id) ?? null;
}

export async function getPetIds() {
  return pets.filter((p) => p.ownerId === CURRENT_CLIENT_ID).map((p) => p.id);
}

export async function getSubscriptionsForClient(clientId = CURRENT_CLIENT_ID) {
  return subscriptions.filter((s) => s.clientId === clientId);
}

export async function getBookingsForClient(clientId = CURRENT_CLIENT_ID) {
  return bookings.filter((b) => b.clientId === clientId);
}

export async function getVisitHistory(petId: string) {
  return bookings
    .filter((b) => b.petIds.includes(petId) && b.status === "completed")
    .reverse()
    .map((b) => ({ booking: b, report: reportFor(b) }));
}

export async function getAllBookings(): Promise<Booking[]> {
  return bookings;
}

export async function getAllClients() {
  return clients;
}

export async function getAllPets() {
  return pets;
}

export async function getAllSubscriptions() {
  return subscriptions;
}

export async function getOpsSnapshot() {
  return {
    today: TODAY,
    bookings,
    clients,
    pets,
    zones,
    services,
    subscriptions,
    hub: HUB,
  };
}

export type OpsSnapshot = Awaited<ReturnType<typeof getOpsSnapshot>>;
