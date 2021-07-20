import { computeStyles } from "@popperjs/core";
import { PDFDocument } from "pdf-lib";
import { Pegawai } from "../typings/Pegawai";
import { RampunganFill } from "../typings/RampunganFill";
import { ListPegawai, SuratTugasRes } from "../typings/SuratTugas";
import { formattedDayjs } from "./dates";
import { terbilangWithKoma } from "./terbilang";

async function createRincianFill(suratTugas: SuratTugasRes, pegawaiId: string, hargaJaldis: string) {
  const formUrl =
    "https://firebasestorage.googleapis.com/v0/b/kjri-fr-dev.appspot.com/o/template%2FRincian%20Fill.pdf?alt=media&token=a1d06305-4c31-40dd-b680-5f2516950b74";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

  const { nomorSurat, listPegawai = [], fullDayKurs = 0.84, pembuatKomitmen } = suratTugas;

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

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
    const [fullDayDur, halfDayDur = "0"] = numberRincian.split(",");
    const jumlah1 = Number.parseFloat(fullDayDur) * fullDayKurs * Number.parseFloat(hargaJaldis);
    const jumlah2 = Number.parseFloat(halfDayDur) * fullDayKurs * Number.parseFloat(hargaJaldis);
    const jumlahTotal = jumlah1 + jumlah2;
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

    jumlah1Rincian.setText(jumlah1.toString());
    jumlah2Rincian.setText(jumlah2.toString());
    jumlahTotalRincian.setText(jumlahTotal.toString());
    jumlah1Rincian.enableReadOnly();
    jumlah2Rincian.enableReadOnly();
    jumlahTotalRincian.enableReadOnly();

    terbilangTextField.setText(nilaiTerbilang);
    persen40.setText("0.4");
    terbilangTextField.enableReadOnly();
    persen40.enableReadOnly();

    uangJumlah.setText(jumlahTotal.toString());
    uangJumlah.enableReadOnly();
  }

  if (pembuatKomitmen) {
    const nama_komitmen_rincian = form.getTextField("nama_komitmen_rincian");
    const NIP_komitmen_rincian = form.getTextField("NIP_komitmen_rincian");

    nama_komitmen_rincian.setText(pembuatKomitmen?.name);
    NIP_komitmen_rincian.setText(pembuatKomitmen?.nip);

    nama_komitmen_rincian.enableReadOnly();
    NIP_komitmen_rincian.enableReadOnly();
  }

  return pdfDoc.save();
}

async function createRampunganFill(pembuatKomitmen?: { name: string; nip: string }, rampungan: RampunganFill[] = []) {
  // Create Document
  const formUrl =
    "https://firebasestorage.googleapis.com/v0/b/kjri-fr-dev.appspot.com/o/template%2FRampungan%20Fill.pdf?alt=media&token=cbb0764d-2e42-449e-bcfc-c003fee8832af";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

  //  tujuan_1_rampungan
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();

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

  return pdfDoc.save();
}

async function createPernyataanFill(pegawai: Pegawai, nomorSuratTugas: string) {
  const formUrl =
    "https://firebasestorage.googleapis.com/v0/b/kjri-fr-dev.appspot.com/o/template%2FSURAT%20PERNYATAAN%20TELAH%20MELAKSANAKAN%20PERJALANAN%20DINAS%20Fill.pdf?alt=media&token=b3af9879-fc16-4be1-b8a9-76160dde9c58";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  if (pegawai) {
    const name = form.getTextField("nama_surat_pernyataan");
    const nip = form.getTextField("nip_surat_pernyataan");
    const jabatan = form.getTextField("jabatan­_surat_pernyataan");
    const nomorSPD = form.getTextField("nomor_spd_surat_pernyataan");

    name.setText(pegawai.displayName);
    nip.setText(pegawai.nip.toString());
    jabatan.setText(pegawai.jabatan);
    nomorSPD.setText(nomorSuratTugas);

    name.enableReadOnly();
    nip.enableReadOnly();
    jabatan.enableReadOnly();
    nomorSPD.enableReadOnly();
  }
  return pdfDoc.save();
}

async function createKwitansiFill(pembuatKomitmen?: { name: string; nip: string }) {
  const formUrl =
    "https://firebasestorage.googleapis.com/v0/b/kjri-fr-dev.appspot.com/o/template%2F3.%20Kwitansi%20Jaldis%20Fill.pdf?alt=media&token=19125c41-4f8b-47cb-9299-af51544a4a34";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  const name = form.getTextField("pejabat_komitmen");
  const nip = form.getTextField("NIP1");

  if (pembuatKomitmen) {
    name.setText(pembuatKomitmen.name);
    nip.setText(pembuatKomitmen.nip.toString());
    name.enableReadOnly();
    nip.enableReadOnly();
  }

  return pdfDoc.save();
}

export { createRincianFill, createRampunganFill, createPernyataanFill, createKwitansiFill };
