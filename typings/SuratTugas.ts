import { RichTextValue } from "./Common";
import { Pegawai } from "./Pegawai";
import { RampunganFill } from "./RampunganFill";

export interface SuratTugasRes {
  nomorSurat: string;
  suratTugasId: string;
  tujuanDinas: string;
  fullDayKurs: number;

  createdAt: FirebaseFirestore.Timestamp; // UTC String
  editedAt: FirebaseFirestore.Timestamp; // UTC String

  textPembuka?: RichTextValue;
  textTengah?: RichTextValue;
  textPenutup?: RichTextValue;

  listPegawai?: ListPegawai[];
  pembuatKomitmen?: {
    name: string;
    nip: string;
  };

  downloadUrl?: {
    suratPenugasan: {
      [k in string]: string;
    };
    suratTugas: string;
  };
}

export type ListPegawai = {
  uangHarian: string;
  durasi: string;
  pegawai: Pegawai;
  destinasi: RampunganFill[];
  keterangan: {
    rincian: string;
  };
};

export type CreateSuratTugasValues = Pick<
  SuratTugasRes,
  "nomorSurat" | "tujuanDinas" | "textPembuka" | "textTengah" | "textPenutup"
> & { createdAt: Date };

export type CreateSuratTugasReqBody = Partial<Omit<SuratTugasRes, "createdAt" | "updatedAt">> & {
  createdAt: Date;
};

export type UpdateSuratTugasReqBody = Partial<
  Omit<SuratTugasRes, "createdAt" | "updatedAt"> & {
    createdAt: Date;
    updatedAt: Date;
  }
>;
