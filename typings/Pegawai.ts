export type Pegawai = {
    displayName: string;
    email: string;
    golongan: string;
    jabatan: string;
    nip: number | string;
    role: string;
    uid: string;
};

export type PegawaiSuratTugas = Omit<Pegawai, "role" | "uid">;