import dayjs from "dayjs";
import {
  AlignmentType,
  convertInchesToTwip,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  ImageRun,
  Document,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
  VerticalPositionRelativeFrom,
} from "docx";
import fs from "fs";
import { RichTextValue } from "../typings/Common";
import { PegawaiSuratTugas } from "../typings/Pegawai";
import "dayjs/locale/id";

type Modify<T, TData> = T & TData;

type GeneratePegawaiProps = {
  nomorSurat: string;
  pegawai: Modify<PegawaiSuratTugas, { pangkat: string }>[];
  waktuPelaksanaan: number;
  textTengah: RichTextValue;
  waktuPerjalanan: number;
  textPembuka: RichTextValue;
  textPenutup: RichTextValue;
};

const styles = {
  bold: {
    font: "Arial",
    size: 22,
    bold: true,
  },
  normal: { font: "Arial", size: 22, text: "SURAT TUGAS" },
};

const tabStop = [
  {
    type: TabStopType.RIGHT,
    position: TabStopPosition.MAX,
  },
  {
    type: TabStopType.LEFT,
    position: convertInchesToTwip(0.3),
  },
  {
    type: TabStopType.LEFT,
    position: convertInchesToTwip(0.5),
  },

  {
    type: TabStopType.LEFT,
    position: convertInchesToTwip(2),
  },
  {
    type: TabStopType.LEFT,
    position: convertInchesToTwip(4),
  },
];

const tabStop2 = [
  {
    type: TabStopType.LEFT,
    position: convertInchesToTwip(0.3),
  },
  {
    type: TabStopType.LEFT,
    position: convertInchesToTwip(0.5),
  },

  {
    type: TabStopType.LEFT,
    position: convertInchesToTwip(2),
  },
  {
    type: TabStopType.LEFT,
    position: convertInchesToTwip(2.7),
  },

  {
    type: TabStopType.LEFT,
    position: convertInchesToTwip(3.2),
  },
];

function generateSuratTugas({
  nomorSurat,
  pegawai = [],
  waktuPelaksanaan,
  waktuPerjalanan,
  textPembuka,
  textTengah,
  textPenutup,
}: GeneratePegawaiProps) {
  const image = new ImageRun({
    data: fs.readFileSync("./public/doc.png"),
    transformation: {
      width: 100,
      height: 100,
    },
    floating: {
      horizontalPosition: {
        relative: HorizontalPositionRelativeFrom.PAGE,
        align: HorizontalPositionAlign.CENTER,
      },
      verticalPosition: {
        relative: VerticalPositionRelativeFrom.PAGE,
        // align: VerticalPositionAlign.TOP,
        offset: 435600,
        // relative: VerticalPositionRelativeFrom.PAGE by default
      },
    },
  });

  const parsedPembukaan = parseRichTextValue(textPembuka);
  const parsedTengah = parseRichTextValue(textTengah);
  const parsedPenutup = parseRichTextValue(textPenutup);

  const spaceLeft = 20 - pegawai.length * 4;

  const doc = new Document({
    styles: { default: { document: { paragraph: { spacing: { line: 270 } } } } },
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [image],
          }),
          ...blankSpace(2),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                ...styles.bold,
                text: "KONSULAT JENDERAL REPUBLIK INDONESIA",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                ...styles.bold,
                text: "FRANKFURT",
              }),
            ],
          }),
          ...blankSpace(2),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                ...styles.normal,
                characterSpacing: 1.03,
                text: "SURAT TUGAS",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                ...styles.bold,
                text: "NO.",
              }),
              new TextRun({
                ...styles.bold,
                text: nomorSurat,
              }),
            ],
          }),
          ...blankSpace(),
          ...parsedPembukaan,
          ...blankSpace(),
          ...pegawai.map((v, index) => createList(index + 1, v)).flat(),

          // Text Tengah
          ...parsedTengah,

          ...blankSpace(),
          new Paragraph({
            children: [
              new TextRun({ ...styles.normal, text: `Waktu pelaksanaan tugas\t: hari (\t${waktuPelaksanaan}\t)` }),
            ],
            tabStops: tabStop2,
          }),
          new Paragraph({
            children: [new TextRun({ ...styles.normal, text: `Waktu perjalanan\t: hari (\t${waktuPerjalanan}\t)` })],
            tabStops: tabStop2,
          }),
          ...blankSpace(spaceLeft),
          ...parsedPenutup,
          ...blankSpace(4),
          new Paragraph({
            children: [new TextRun({ ...styles.normal, text: "\t\t\t\t Dikeluarkan di Frankfurt" })],
            tabStops: tabStop,
          }),
          new Paragraph({
            children: [
              new TextRun({
                ...styles.normal,
                text: `\t\t\t\t pada tanggal ${dayjs().locale("id").format("DD MMMM YYYY")}`,
              }),
            ],
            tabStops: tabStop,
          }),
          new Paragraph({
            children: [new TextRun({ ...styles.normal, text: "\t\t\t\t Kepala Perwakilan RI" })],
            tabStops: tabStop,
          }),
        ],
      },
    ],
  });

  return doc;
}

function createList(
  number: string | number,
  {
    displayName,
    nip,
    pangkat,
    golongan,
    jabatan,
  }: { displayName?: string; nip: string | number; pangkat: string; golongan: string; jabatan: string }
) {
  return [
    new Paragraph({
      children: [new TextRun({ ...styles.normal, text: `\t${number}.\tNama/NIP\t: ${displayName}\t/ NIP. ${nip}` })],
      tabStops: tabStop,
    }),
    new Paragraph({
      children: [new TextRun({ ...styles.normal, text: `\t\tPangkat/Golongan\t: ${pangkat}\t/ ${golongan}` })],
      tabStops: tabStop,
    }),
    new Paragraph({
      children: [new TextRun({ ...styles.normal, text: `\t\tJabatan\t: ${jabatan}` })],
      tabStops: tabStop,
    }),
    new Paragraph({
      children: [new TextRun({ ...styles.bold })],
    }),
  ];
}

const blankSpace = (num: number = 1) => {
  let space = [];

  for (let count = num; count !== 0; count--) {
    space.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "",
            size: 24,
            font: "Times New Roman",
          }),
        ],
      })
    );
  }

  return space;
};

function parseRichTextValue(data: RichTextValue) {
  const parsedVal = data?.map(
    (v) =>
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        children: v.children.map(
          ({ text, bold, underline, italic }) =>
            new TextRun({
              ...styles.normal,
              text: text,
              bold,
              ...(underline ? { underline: { color: "black" } } : {}),
              italics: italic,
            })
        ),
      })
  );
  return parsedVal ?? [];
}

export { generateSuratTugas, blankSpace };
