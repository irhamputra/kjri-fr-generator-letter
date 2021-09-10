export type RichTextValue = {
  type?: string;
  children: { text: string; bold?: boolean; italic?: boolean; underline?: boolean }[];
}[];

export type FirebaseTimestamp = {
  _nanoseconds: number;
  _seconds: number;
};
