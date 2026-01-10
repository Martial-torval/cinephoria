export type Booking = {
  id: string;
  userId: string;
  seanceId: number;
  numberOfSeats: number;
  bookingSeats: number[];
  totalPrice: number;
  statut: string;
  createdAt: string;
  updatedAt: string;
  seance: {
    id: number;
    movieId: number;
    movie: {
      id: number;
      title: string;
      posterUrl: string;
    };
    roomId: number;
    room: { id: number; numero: string };
    cinemaId: number;
    cinema: {
      id: number;
      name: string;
      image: string;
    };
    startTime: string;
    endTime: string;
    qualityProjection: string;
    createdAt: string;
    updatedAt: string;
  };
};
