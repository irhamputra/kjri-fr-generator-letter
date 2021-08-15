import { RichTextValue } from "./Common";
import { Pegawai } from "./Pegawai";
import { RampunganFill } from "./RampunganFill";

export interface SuratTugasRes {
  nomorSurat: string;
  suratTugasId: string;
  tujuanDinas: string;
  fullDayKurs: number;

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

export type ListPegawai = { uangHarian: string; durasi: string; pegawai: Pegawai; destinasi: RampunganFill[] };
