import { RichTextValue } from "./Common";
import { Pegawai } from "./Pegawai";
import { RampunganFill } from "./RampunganFill";

export interface SuratTugasRes {
  nomorSurat: string;
  suratTugasId: string;
  tujuanDinas: string;

  textPembuka?: RichTextValue;
  textTengah?: RichTextValue;
  textPenutup?: RichTextValue;

  listPegawai?: { durasi: number; pegawai: Pegawai; destinasi: RampunganFill[] }[];
  pembuatKomitmen?: {
    name: string;
    nip: string;
  };

  downloadUrl?: {
    suratPenugasan: {
      [k in string]: string;
    }
    suratTugas: string;
  };
}
