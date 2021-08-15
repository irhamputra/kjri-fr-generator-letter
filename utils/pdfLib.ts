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

async function fillCover(
  form: PDFForm,
  data: { suratTugas: SuratTugasRes; jaldis: JalDis; pegawaiId: string },
  option: Option
) {
  const { suratTugas, jaldis, pegawaiId } = data;
  const { listPegawai = [], pembuatKomitmen } = suratTugas;

  const namePejabat = form.getTextField("nama_pejabat_komitmen__spd");
  const namenip = form.getTextField("nama_nip_spd");
  const pangkat = form.getTextField("pangkat_golongan_spd");
  const jabatanInstansi = form.getTextField("jabatan_instansi_spd");
  const gol_jaldis_spd = form.getTextField("gol_jaldis_spd");
  const hari_spd = form.getTextField("hari_spd");
  const tanggal_berangkat_spd = form.getTextField("tanggal_berangkat_spd");
  const tanggal_dikeluarkan_spd = form.getTextField("tanggal_dikeluarkan_spd");
  const tempat_tujuan_spd = form.getTextField("tempat_tujuan_spd");

  const name = form.getTextField("nama_pejabat_komitmen_spd");
  const nip = form.getTextField("nip_spd");

  const tanggal_pulang_spd = form.getTextField("tanggal_pulang_spd");

  const { pegawai, durasi, destinasi } = listPegawai.filter(({ pegawai }) => pegawai.uid === pegawaiId)[0];

  if (pembuatKomitmen) {
    namePejabat.setText(pembuatKomitmen.name);
    namenip.setText(pegawai.displayName + " / " + pegawai.nip);
    pangkat.setText(pegawai.pangkat);
    jabatanInstansi.setText(pegawai.jabatan);
    gol_jaldis_spd.setText(jaldis.golongan);
    hari_spd.setText(durasi.toString());
    tanggal_berangkat_spd.setText(formattedDayjs(destinasi[0].tanggalPergi));
    tanggal_dikeluarkan_spd.setText(formattedDayjs(new Date()));
    tempat_tujuan_spd.setText(destinasi.map(({ tibaDi }) => tibaDi).toString());
    tanggal_pulang_spd.setText(
      dayjs(destinasi[0].tanggalPergi)
        .add(Math.round(+durasi.replace(/,/g, ".")), "day")
        .format("DD.MM.YYYY")
    );

    name.setText(pembuatKomitmen.name);
    nip.setText(pembuatKomitmen.nip.toString());

    namePejabat.enableReadOnly();
    namenip.enableReadOnly();
    pangkat.enableReadOnly();
    jabatanInstansi.enableReadOnly();
    gol_jaldis_spd.enableReadOnly();
    hari_spd.enableReadOnly();
    tanggal_berangkat_spd.enableReadOnly();
    tanggal_dikeluarkan_spd.enableReadOnly();
    tempat_tujuan_spd.enableReadOnly();
    tanggal_pulang_spd.enableReadOnly();
    name.enableReadOnly();
    nip.enableReadOnly();
  }

  return form;
}

async function fillRincian(
  form: PDFForm,
  data: { suratTugas: SuratTugasRes; pegawaiId: string; hargaJaldis: string },
  option: Option
) {
  const { suratTugas, pegawaiId, hargaJaldis } = data;
  const { nomorSurat, listPegawai = [], fullDayKurs = 0.84, pembuatKomitmen } = suratTugas;

  if (nomorSurat) {
    const lampiranSPDNo = form.getTextField("no_spd_rincian");
    const tglSPD = form.getTextField("tanggal_rincian");

    lampiranSPDNo.setText(nomorSurat);
    tglSPD.setText(formattedDayjs(new Date()));
    lampiranSPDNo.enableReadOnly();
    tglSPD.enableReadOnly();
  }

  if (listPegawai?.length > 0) {
    const pegawai = listPegawai.filter(({ pegawai }) => pegawai.uid === pegawaiId)[0];

    const numberRincian = pegawai?.durasi?.toString() ?? "";
    let [fullDayDur, halfDayDur = ""] = numberRincian.split(",");
    if (halfDayDur === "5") {
      halfDayDur = "1";
    }

    const days = parseFloat(fullDayDur) * fullDayKurs * parseFloat(hargaJaldis);
    const halfDay = parseFloat(halfDayDur) * 0.4 * fullDayKurs * parseFloat(hargaJaldis);

    // use toFixed to fix additional .9999 in decimal
    // read : https://stackoverflow.com/questions/10473994/javascript-adding-decimal-numbers-issue
    const jumlahTotal = +(days + halfDay).toFixed(2) || 0;
    const nilaiTerbilang = terbilangWithKoma(jumlahTotal).toString();

    const hariRincian = form.getTextField("hari_full_rincian");
    const uangFullRincian = form.getTextField("uang_harian_full_rincian");
    const kurs = form.getTextField("kurs");
    const hariRincianStgh = form.getTextField("hari_stgh_rincian");
    const uangFullRincianStgh = form.getTextField("uang_harian_stgh_rincian");
    const persen40 = form.getTextField("40_persen");

    const jumlah1Rincian = form.getTextField("jumlah_1_rincian");
    const jumlah2Rincian = form.getTextField("jumlah_2_rincian");
    const jumlahTotalRincian = form.getTextField("jumlah_3_rincian");
    const uangJumlah = form.getTextField("uang_jumlah_rincian");

    const keterangan = form.getTextField("keterangan_rincian");
    const terbilangTextField = form.getTextField("terbilang_rincian");

    const nama_penerima_rincian = form.getTextField("nama_penerima_rincian");
    const NIP_penerima_rincian = form.getTextField("NIP_penerima_rincian");

    hariRincian.setText(fullDayDur);
    uangFullRincian.setText(hargaJaldis);
    hariRincian.enableReadOnly();
    uangFullRincian.enableReadOnly();

    hariRincianStgh.setText(halfDayDur);
    uangFullRincianStgh.setText(hargaJaldis);
    hariRincianStgh.enableReadOnly();
    uangFullRincianStgh.enableReadOnly();

    kurs.setText(fullDayKurs.toString());
    kurs.enableReadOnly();

    jumlah1Rincian.setText(days.toString());
    jumlah2Rincian.setText(halfDay.toString());
    jumlahTotalRincian.setText(jumlahTotal.toString());
    jumlah1Rincian.enableReadOnly();
    jumlah2Rincian.enableReadOnly();
    jumlahTotalRincian.enableReadOnly();

    terbilangTextField.setText(nilaiTerbilang + " Euro");
    persen40.setText("0.4");
    terbilangTextField.enableReadOnly();
    persen40.enableReadOnly();

    uangJumlah.setText(jumlahTotal.toString());
    uangJumlah.enableReadOnly();

    nama_penerima_rincian.setText(pegawai.pegawai.displayName);
    nama_penerima_rincian.enableReadOnly();

    NIP_penerima_rincian.setText(pegawai.pegawai.nip.toString());
    NIP_penerima_rincian.enableReadOnly();
  }

  if (pembuatKomitmen) {
    const nama_komitmen_rincian = form.getTextField("nama_komitmen_rincian");
    const NIP_komitmen_rincian = form.getTextField("NIP_komitmen_rincian");

    nama_komitmen_rincian.setText(pembuatKomitmen?.name);
    NIP_komitmen_rincian.setText(pembuatKomitmen?.nip);

    nama_komitmen_rincian.enableReadOnly();
    NIP_komitmen_rincian.enableReadOnly();
  }

  return form;
}

async function fillRampungan(
  form: PDFForm,
  data: { pegawai: Pegawai; pembuatKomitmen?: { name: string; nip: string }; rampungan: RampunganFill[] },
  option: Option
) {
  const { pegawai, pembuatKomitmen, rampungan = [] } = data;
  const nama = form.getTextField("nama");
  nama.setText(pegawai.displayName);
  nama.enableReadOnly();

  if (pembuatKomitmen) {
    const namaPembuatKomitmen = form.getTextField("nama_pejabat_komitmen_rincian");
    const nip1 = form.getTextField("NIP_1_rincian");

    namaPembuatKomitmen.setText(pembuatKomitmen?.name);
    nip1.setText(pembuatKomitmen?.nip);

    namaPembuatKomitmen.enableReadOnly();
    nip1.enableReadOnly();
  }

  if (rampungan[0]) {
    const tujuan1 = form.getTextField("tujuan_1_rampungan");
    const tanggalTujuan1 = form.getTextField("tanggal_1_rincian");
    const kedatangan1 = form.getTextField("kedatangan_1_rincian");
    const tanggalKedatangan1 = form.getTextField("tanggal_2_rincian");

    tujuan1.setText(rampungan[0].tibaDi);
    tanggalTujuan1.setText(formattedDayjs(rampungan[0].tanggalPergi));
    kedatangan1.setText(rampungan[0].tibaDi);
    tanggalKedatangan1.setText(formattedDayjs(rampungan[0].tanggalTiba));

    tujuan1.enableReadOnly();
    tanggalTujuan1.enableReadOnly();
    kedatangan1.enableReadOnly();
    tanggalKedatangan1.enableReadOnly();
  }

  if (rampungan[1]) {
    const berangkat1 = form.getTextField("berangkat_1_rincian");
    const tujuan2 = form.getTextField("tujuan_2_rincian");
    const tanggalTujuan2 = form.getTextField("tanggal_2_rincian");
    const kedatangan2 = form.getTextField("kedatangan_2_rincian");
    const tanggalKedatangan2 = form.getTextField("tanggal_3_rincian");

    berangkat1.setText(rampungan[1].pergiDari);
    tujuan2.setText(rampungan[1].tibaDi);
    tanggalTujuan2.setText(formattedDayjs(rampungan[1].tanggalPergi));
    kedatangan2.setText(rampungan[1].tibaDi);
    tanggalKedatangan2.setText(formattedDayjs(rampungan[1].tanggalTiba));

    berangkat1.enableReadOnly();
    tujuan2.enableReadOnly();
    tanggalTujuan2.enableReadOnly();
    kedatangan2.enableReadOnly();
    tanggalKedatangan2.enableReadOnly();
  }

  if (rampungan[2]) {
    const berangkat2 = form.getTextField("berangkat_2_rincian");
    const tujuan3 = form.getTextField("tujuan_3_rincian");
    const tanggalTujuan3 = form.getTextField("tanggal_4_rincian");
    const kedatangan3 = form.getTextField("kedatangan_3_rincian");
    const tanggalKedatangan3 = form.getTextField("tanggal_5_rincian");

    berangkat2.setText(rampungan[2].pergiDari);
    tujuan3.setText(rampungan[2].tibaDi);
    tanggalTujuan3.setText(formattedDayjs(rampungan[2].tanggalPergi));
    kedatangan3.setText(rampungan[2].tibaDi);
    tanggalKedatangan3.setText(formattedDayjs(rampungan[2].tanggalTiba));

    berangkat2.enableReadOnly();
    tujuan3.enableReadOnly();
    tanggalTujuan3.enableReadOnly();
    kedatangan3.enableReadOnly();
    tanggalKedatangan3.enableReadOnly();
  }

  return form;
}

async function fillPernyataan(form: PDFForm, data: { pegawai: Pegawai; nomorSuratTugas: string }, option: Option) {
  const { pegawai, nomorSuratTugas } = data;
  if (pegawai) {
    const name = form.getTextField("nama_surat_pernyataan");
    const nip = form.getTextField("nip_surat_pernyataan");

    const jabatanField = form.getTextField("jabatan_surat_pernyataan");

    const text_pembuka_surat = form.getTextField("text_pembuka_surat");

    name.setText(pegawai.displayName);
    nip.setText("NIP. " + pegawai.nip.toString());
    jabatanField.setText(pegawai.jabatan);
    text_pembuka_surat.setText(`Menyatakan dengan sesungguhnya bahwa saya telah melaksanakan tugas perjalanan dinas`);

    name.enableReadOnly();
    nip.enableReadOnly();
    jabatanField.enableReadOnly();
    text_pembuka_surat.enableReadOnly();
  }
  return form;
}

async function fillKwitansi(
  form: PDFForm,
  data: { listPegawai: ListPegawai; pembuatKomitmen?: { name: string; nip: string } },
  option: Option
) {
  const { listPegawai, pembuatKomitmen } = data;
  const name = form.getTextField("pejabat_komitmen");
  const nip = form.getTextField("NIP1");

  const jumlah_uang = form.getTextField("jumlah_uang");
  const terbilangField = form.getTextField("terbilang");
  const nama_penerima = form.getTextField("nama_penerima");
  const tanggal_pulang_jaldis_surat_pernyataan = form.getTextField("tanggal_pulang_jaldis_surat_pernyataan");
  const datum = form.getTextField("datum");

  tanggal_pulang_jaldis_surat_pernyataan.setText(
    dayjs(listPegawai?.destinasi[0].tanggalPergi)
      .add(Math.round(+listPegawai?.durasi.replace(/,/g, ".")), "day")
      .format("DD.MM.YYYY")
  );

  const nilaiTerbilang = +listPegawai.uangHarian.slice(1).replace(/,/g, "");
  console.log(nilaiTerbilang, "nilai");
  jumlah_uang.setText(listPegawai.uangHarian);
  console.log(listPegawai.uangHarian.slice(1));
  terbilangField.setText(terbilangWithKoma(nilaiTerbilang) + " Euro");
  nama_penerima.setText(listPegawai.pegawai.displayName);
  datum.setText(formattedDayjs(new Date()));

  jumlah_uang.enableReadOnly();
  terbilangField.enableReadOnly();
  nama_penerima.enableReadOnly();
  tanggal_pulang_jaldis_surat_pernyataan.enableReadOnly();

  if (pembuatKomitmen) {
    name.setText(pembuatKomitmen.name);
    nip.setText(pembuatKomitmen.nip.toString());
    name.enableReadOnly();
    nip.enableReadOnly();
    datum.enableReadOnly();
  }

  return form;
}

function fillAndSetReadOnly(form: PDFForm, data: { fieldName: string; value: string }[], option: Option) {
  data.forEach(({ fieldName, value }) => {
    const textField = form.getTextField(fieldName);
    textField.setText(value);
    textField.updateAppearances(option.font);
    textField.enableReadOnly();
  });
}

export { fillCover, fillRincian, fillRampungan, fillPernyataan, fillKwitansi };
