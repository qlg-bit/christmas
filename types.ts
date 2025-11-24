export enum RsvpStatus {
  ATTENDING = 'ATTENDING',
  NOT_ATTENDING = 'NOT_ATTENDING',
  UNDECIDED = 'UNDECIDED'
}

export interface GuestFormData {
  name: string;
  guestsCount: number;
  status: RsvpStatus;
}

export interface PartyDetails {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
}