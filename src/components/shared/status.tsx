import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { BookingStatus, VaccineStatus } from "@/lib/types";

const bookingTone: Record<BookingStatus, BadgeTone> = {
  pending: "amber",
  confirmed: "teal",
  completed: "neutral",
  cancelled: "red",
};

const bookingLabel: Record<BookingStatus, string> = {
  pending: "Awaiting review",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function BookingStatusBadge({ status, short }: { status: BookingStatus; short?: boolean }) {
  return (
    <Badge tone={bookingTone[status]} dot>
      {short && status === "pending" ? "Pending" : bookingLabel[status]}
    </Badge>
  );
}

const vaxTone: Record<VaccineStatus, BadgeTone> = { valid: "teal", expiring: "amber", expired: "red" };
const vaxLabel: Record<VaccineStatus, string> = {
  valid: "Vaccines current",
  expiring: "Vaccine due soon",
  expired: "Vaccine expired",
};

export function VaccineBadge({ status, label }: { status: VaccineStatus; label?: string }) {
  return (
    <Badge tone={vaxTone[status]} dot>
      {label ?? vaxLabel[status]}
    </Badge>
  );
}
