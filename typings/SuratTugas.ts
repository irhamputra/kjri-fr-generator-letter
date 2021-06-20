import { RichTextValue } from "./Common";
import { Pegawai } from "./Pegawai";

export interface SuratTugasRes {
    nomorSurat: string;
    listPegawai: { durasi: number; pegawai: Pegawai }[];
    textPembuka: RichTextValue
    textTengah: RichTextValue
    textPenutup: RichTextValue
    suratTugasId: string;
    tujuanDinas: string;
}
