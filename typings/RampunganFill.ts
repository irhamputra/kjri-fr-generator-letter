export type RampunganFill = {
  pergiDari: string;
  tanggalPergi: any;
  tibaDi: string;
  tanggalTiba: any;
};

export type FormRampunganFillInitialValues = {
  pembuatKomitmenName: string;
  pembuatKomitmenNIP: string;
  data: FormRampunganFillData[];
};

export type RampunganFillReqBody = {
  pembuatKomitmenName: string;
  pembuatKomitmenNIP: string;
  rampungan: RampunganFill[];
};

export type FormRampunganFillData = {
  nama: string;
  nip: string;
  rampungan: RampunganFill[];
};
