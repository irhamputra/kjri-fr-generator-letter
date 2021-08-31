import dayjs from "dayjs";
import { PDFForm, PDFFont } from "pdf-lib";
import { string } from "yup/lib/locale";
import { JalDis } from "../typings/Jaldis";
import { Pegawai, PegawaiSuratTugas } from "../typings/Pegawai";
import { RampunganFill } from "../typings/RampunganFill";
import { ListPegawai, SuratTugasRes } from "../typings/SuratTugas";
import { formattedDayjs } from "./dates";
import { terbilangWithKoma } from "./terbilang";
interface Option {
  font: PDFFont;
}

interface FormValues {
  fieldName: string;
  value?: string;
}

async function fillCover(
  form: PDFForm,
  data: { suratTugas: SuratTugasRes; jaldis?: JalDis; pegawaiId: string },
  option: Option
) {
  const { suratTugas, jaldis, pegawaiId } = data;
  const { listPegawai = [], pembuatKomitmen, nomorSurat } = suratTugas;

  const { pegawai, durasi, destinasi = [] } = listPegawai.filter(({ pegawai }) => pegawai.uid === pegawaiId)[0];

  const formValues: FormValues[] = [
    { fieldName: "nama_pejabat_komitmen__spd", value: pembuatKomitmen?.name },
    { fieldName: "nama_nip_spd", value: pegawai.displayName + " / " + pegawai.nip },
    { fieldName: "pangkat_golongan_spd", value: pegawai.pangkat },
    { fieldName: "jabatan_instansi_spd", value: pegawai.jabatan },
    { fieldName: "gol_jaldis_spd", value: jaldis?.golongan },
    { fieldName: "hari_spd", value: durasi.toString() },
    {
      fieldName: "tanggal_berangkat_spd",
      value: destinasi[0]?.tanggalPergi ? formattedDayjs(destinasi[0].tanggalPergi) : "",
    },
    { fieldName: "tanggal_dikeluarkan_spd", value: formattedDayjs(new Date()) },
    { fieldName: "tempat_tujuan_spd", value: destinasi.map(({ tibaDi }) => tibaDi).toString() },
    {
      fieldName: "tanggal_pulang_spd",
      value:
        destinasi[0] &&
        dayjs(destinasi[0].tanggalPergi)
          .add(Math.round(+durasi.replace(/,/g, ".")), "day")
          .format("DD.MM.YYYY"),
    },
    { fieldName: "nama_pejabat_komitmen__spd", value: pembuatKomitmen?.name },
    { fieldName: "nama_pejabat_komitmen_spd", value: pembuatKomitmen?.name },
    { fieldName: "nip_spd", value: pembuatKomitmen?.nip?.toString() },
    { fieldName: "nomor_spd", value: nomorSurat },
  ];

  fillAndSetReadOnly(form, formValues, option);
  enableReadOnly(form, [
    "alat_angkut_spd",
    "nama_pengikut_spd",
    "tanggal_lahir_spd",
    "keterangan_spd",
    "akun_spd",
    "keterangan_dll_spd",
    "kode_spd",
  ]);

  return form;
}

async function fillRincian(
  form: PDFForm,
  data: { suratTugas: SuratTugasRes; pegawaiId: string; hargaJaldis?: string; bendahara?: Pegawai },
  option: Option
) {
  const { suratTugas, pegawaiId, hargaJaldis, bendahara } = data;
  const { nomorSurat, listPegawai = [], fullDayKurs = 0.84, pembuatKomitmen, tujuanDinas } = suratTugas;

  const lampiranSPDNo = form.getTextField("no_spd_rincian");
  const tglSPD = form.getTextField("tanggal_rincian");

  lampiranSPDNo.setText(nomorSurat);
  tglSPD.setText(formattedDayjs(new Date()));
  lampiranSPDNo.enableReadOnly();
  tglSPD.enableReadOnly();

  const pegawai = listPegawai.filter(({ pegawai }) => pegawai.uid === pegawaiId)[0];

  const numberRincian = pegawai?.durasi?.toString();
  const [fullDayDur, haldDay] = numberRincian.split(",");
  let halfDayDur = "0";

  if (haldDay === "5") {
    halfDayDur = "1";
  }

  const days = parseFloat(fullDayDur) * fullDayKurs * parseFloat(hargaJaldis ?? "0");
  const halfDay = parseFloat(halfDayDur) * 0.4 * fullDayKurs * parseFloat(hargaJaldis ?? "0");

  // use toFixed to fix additional .9999 in decimal
  // read : https://stackoverflow.com/questions/10473994/javascript-adding-decimal-numbers-issue
  const jumlahTotal = (days + halfDay).toFixed(2) || 0;
  const nilaiTerbilang = terbilangWithKoma(+jumlahTotal).toString();

  const formToFill: FormValues[] = [
    {
      fieldName: "hari_full_rincian",
      value: fullDayDur,
    },
    {
      fieldName: "uang_harian_full_rincian",
      value: hargaJaldis,
    },
    { fieldName: "kurs", value: fullDayKurs.toString() },
    { fieldName: "hari_stgh_rincian", value: halfDayDur },
    { fieldName: "uang_harian_stgh_rincian", value: hargaJaldis },
    { fieldName: "40_persen", value: "0.4" },
    { fieldName: "jumlah_1_rincian", value: days.toFixed(2).toString() },
    { fieldName: "jumlah_2_rincian", value: halfDay.toFixed(2).toString() },
    { fieldName: "jumlah_3_rincian", value: jumlahTotal.toString() },
    { fieldName: "uang_jumlah_rincian", value: jumlahTotal.toString() },
    { fieldName: "terbilang_rincian", value: nilaiTerbilang + " Euro" },
    { fieldName: "nama_penerima_rincian", value: pegawai.pegawai.displayName },
    { fieldName: "NIP_penerima_rincian", value: pegawai.pegawai.nip.toString() },
    { fieldName: "tahun_spd", value: "DIPA KJRI FRANKFURT TA " + new Date().getFullYear() },
    { fieldName: "maksud_jalan_spd", value: tujuanDinas },
    { fieldName: "keterangan_rincian", value: pegawai.keterangan?.rincian },
    { fieldName: "NIP_bendahara_rincian", value: bendahara?.nip },
    { fieldName: "nama_bendahara_rincian", value: bendahara?.displayName },
  ];

  enableReadOnly(form, ["jumlah_total_rincian", "uang_dibayar_rincian", "uang_sisa_lebih_rincian"]);

  const formToFill2: FormValues[] = [
    {
      fieldName: "nama_komitmen_rincian",
      value: pembuatKomitmen?.name,
    },
    {
      fieldName: "NIP_komitmen_rincian",
      value: pembuatKomitmen?.nip,
    },
  ];

  fillAndSetReadOnly(form, [...formToFill, ...formToFill2], option);

  return form;
}

async function fillRampungan(
  form: PDFForm,
  data: { pegawai: Pegawai; pembuatKomitmen?: { name: string; nip: string }; rampungan: RampunganFill[] },
  option: Option
) {
  const { pegawai, pembuatKomitmen, rampungan = [] } = data;

  let formData: FormValues[] = [{ fieldName: "nama", value: pegawai.displayName }];

  const data1: FormValues[] = [
    { fieldName: "nama_pejabat_komitmen_rincian", value: pembuatKomitmen?.name },
    { fieldName: "NIP_1_rincian", value: pembuatKomitmen?.nip },
  ];

  const data2: FormValues[] = [
    { fieldName: "tujuan_1_rampungan", value: rampungan[0]?.tibaDi },
    {
      fieldName: "tanggal_1_rincian",
      value: rampungan[0]?.tanggalPergi ? formattedDayjs(rampungan[0].tanggalPergi) : "",
    },
    { fieldName: "kedatangan_1_rincian", value: rampungan[0]?.tibaDi },
    {
      fieldName: "tanggal_2_rincian",
      value: rampungan[0]?.tanggalTiba ? formattedDayjs(rampungan[0].tanggalTiba) : "",
    },
  ];

  const data3: FormValues[] = [
    {
      fieldName: "berangkat_1_rincian",
      value: rampungan[1]?.pergiDari,
    },
    {
      fieldName: "tujuan_2_rincian",
      value: rampungan[1]?.tibaDi,
    },
    {
      fieldName: "tanggal_2_rincian",
      value: rampungan[1]?.tanggalPergi ? formattedDayjs(rampungan[1].tanggalPergi) : "",
    },
    {
      fieldName: "kedatangan_2_rincian",
      value: rampungan[1]?.tibaDi,
    },
    {
      fieldName: "tanggal_3_rincian",
      value: rampungan[1]?.tanggalTiba ? formattedDayjs(rampungan[1].tanggalTiba) : "",
    },
  ];

  const data4: FormValues[] = [
    {
      fieldName: "berangkat_2_rincian",
      value: rampungan[2]?.pergiDari,
    },
    {
      fieldName: "tujuan_3_rincian",
      value: rampungan[2]?.tibaDi,
    },
    {
      fieldName: "tanggal_4_rincian",
      value: rampungan[2]?.tanggalPergi ? formattedDayjs(rampungan[2].tanggalPergi) : "",
    },
    {
      fieldName: "kedatangan_3_rincian",
      value: rampungan[2]?.tibaDi,
    },
    {
      fieldName: "tanggal_5_rincian",
      value: rampungan[2]?.tanggalTiba ? formattedDayjs(rampungan[2].tanggalTiba) : "",
    },
  ];

  formData = [...formData, ...data1, ...data2, ...data3, ...data4];

  fillAndSetReadOnly(form, formData, option);

  return form;
}

async function fillPernyataan(form: PDFForm, data: { pegawai: Pegawai; nomorSuratTugas: string }, option: Option) {
  const { pegawai, nomorSuratTugas } = data;

  const formData: FormValues[] = [
    {
      fieldName: "nama_surat_pernyataan",
      value: pegawai.displayName,
    },
    { fieldName: "nip_surat_pernyataan", value: pegawai?.nip.toString() },
    { fieldName: "jabatan_surat_pernyataan", value: pegawai?.jabatan },
    {
      fieldName: "text_pembuka_surat",
      value: `sesuai dengan Surat Perjalanan Dinas (SPD) Nomor ${nomorSuratTugas} tanggal ${formattedDayjs(
        new Date()
      )}`,
    },
  ];

  fillAndSetReadOnly(form, formData, option);

  return form;
}

async function fillKwitansi(
  form: PDFForm,
  data: {
    listPegawai: ListPegawai;
    tujuanSurat: string;
    pembuatKomitmen?: { name: string; nip: string };
    bendahara?: Pegawai;
  },
  option: Option
) {
  const { listPegawai, pembuatKomitmen, tujuanSurat, bendahara } = data;

  let formData: FormValues[] = [
    {
      fieldName: "pejabat_komitmen",
      value: pembuatKomitmen?.name,
    },
    { fieldName: "NIP1", value: pembuatKomitmen?.nip.toString() },
  ];

  const nilaiTerbilang = +listPegawai.uangHarian.slice(1).replace(/,/g, "");

  const data2 = [
    {
      fieldName: "tanggal_pulang_jaldis_surat_pernyataan",
      value:
        listPegawai?.destinasi?.[0]?.tanggalPergi &&
        dayjs(listPegawai?.destinasi[0].tanggalPergi)
          .add(Math.round(+listPegawai?.durasi.replace(/,/g, ".")), "day")
          .format("DD.MM.YYYY"),
    },

    { fieldName: "jumlah_uang", value: listPegawai.uangHarian },
    { fieldName: "terbilang", value: terbilangWithKoma(nilaiTerbilang) + " Euro" },
    { fieldName: "nama_penerima", value: listPegawai.pegawai.displayName },
    { fieldName: "datum", value: formattedDayjs(new Date()) },
    { fieldName: "info_pembayaran", value: tujuanSurat },
    { fieldName: "NIP2", value: bendahara?.nip },
  ];

  formData = [...formData, ...data2];
  fillAndSetReadOnly(form, formData, option);
  enableReadOnly(form, ["TA", "no_buk", "mata_anggaran"]);

  return form;
}

function fillAndSetReadOnly(form: PDFForm, data: FormValues[], option: Option) {
  data.forEach(({ fieldName, value }) => {
    const textField = form.getTextField(fieldName);
    textField.setText(value);
    textField.updateAppearances(option.font);
    textField.enableReadOnly();
  });
}

function enableReadOnly(form: PDFForm, fieldNames: string[]) {
  fieldNames.forEach((fieldName) => form.getTextField(fieldName ?? "").enableReadOnly());
}

export { fillCover, fillRincian, fillRampungan, fillPernyataan, fillKwitansi };
