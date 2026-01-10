// utils/enums.ts (backend safe)
import {
  Genre,
  QualityProjection,
  Role,
  BookingStatus,
  ReviewStatus,
  IncidentStatus,
} from "@prisma/client";

// Pour utiliser côté front (selects), on transforme en tableau
export const GENRE_OPTIONS = Object.values(Genre);
export const QUALITY_OPTIONS = Object.values(QualityProjection);
export const ROLE_OPTIONS = Object.values(Role);
export const BOOKING_STATUS_OPTIONS = Object.values(BookingStatus);
export const REVIEW_STATUS_OPTIONS = Object.values(ReviewStatus);
export const INCIDENT_STATUS_OPTIONS = Object.values(IncidentStatus);
