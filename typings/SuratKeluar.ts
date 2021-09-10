import { firestore } from "firebase-admin";

export type SuratKeluarCollection = {
  arsipId: string;
  author: string;
  content: string;
  id: string;
  jenisSurat: string;
  nomorSurat: string;
  url: string;
  recipient: string;
  createdAt: firestore.Timestamp;
  editedAt: firestore.Timestamp;
};

export type SuratKeluarResBody = {
  arsipId: string;
  author: string;
  content: string;
  id: string;
  jenisSurat: string;
  nomorSurat: string;
  url: string;
  recipient: string;
  createdAt: Date;
  editedAt: Date;
};
