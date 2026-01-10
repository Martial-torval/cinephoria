export const formatDateToFrenchHour = (isoString: string) => {
  const date = new Date(isoString);
  const formatted = new Intl.DateTimeFormat("fr-FR", {
    hour: "numeric",
    minute: "2-digit", // tu peux mettre "2-digit" si tu veux les minutes
    hour12: false,
    timeZone: "Europe/Paris", // important pour le fuseau horaire français
  }).format(date);
  return formatted.replace(" ", " à ");
};

export const formatShowQuality = (quality: string) => {
  switch (quality) {
    case "FOUR_K":
      quality = "4K";
      break;
    case "THREE_D":
      quality = "3D";
      break;
    case "FOUR_DX":
      quality = "4DX";
      break;
  }
  return quality;
};

export const generatePMRSeats = (
  capacity: number,
  seatsPerRow: number
): number[] => {
  if (capacity % seatsPerRow !== 0) {
    throw new Error(
      "La capacité doit être un multiple du nombre de sièges par rangée."
    );
  }

  const totalRows = capacity / seatsPerRow;
  const pmrSeats: number[] = [];

  // Dernière rangée (start = premier siège de la dernière ligne)
  const lastRowStart = (totalRows - 1) * seatsPerRow + 1;

  // On place 6 PMR : 2 à gauche, 2 au milieu, 2 à droite
  pmrSeats.push(
    lastRowStart, // tout à gauche
    lastRowStart + 1,
    lastRowStart + Math.floor(seatsPerRow / 2) - 1, // milieu gauche
    lastRowStart + Math.floor(seatsPerRow / 2), // milieu droit
    lastRowStart + seatsPerRow - 2, // tout à droite
    lastRowStart + seatsPerRow - 1
  );

  return pmrSeats;
};

export const getSeatsPerRow = (capacity: number): number => {
  if (capacity <= 50) return 5; // petite salle
  if (capacity <= 100) return 10;
  if (capacity <= 150) return 12;
  if (capacity <= 200) return 15;
  return 20; // très grande salle
};

export function slugify(title: string): string {
  return title
    .normalize("NFD") // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Supprime tout sauf lettres, chiffres, espaces et tirets
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/-+/g, "-"); // Évite les tirets multiples
}

export const getPriceByQuality = (quality: string) => {
  switch (formatShowQuality(quality)) {
    case "3D":
      return 13;
    case "4DX":
      return 18;
    case "IMAX":
      return 25;
    case "4K":
      return 15;
    case "Standard":
    default:
      return 10;
  }
};

export const formatMinimumAge = (minimum_age: string) => {
  switch (formatShowQuality(minimum_age)) {
    case "AGE_0":
      return "0";
    case "AGE_10":
      return "-10";
    case "AGE_12":
      return "-12";
    case "AGE_16":
      return "-16";
    case "AGE_18":
      return "-18";
    default:
      return "-12";
  }
};
