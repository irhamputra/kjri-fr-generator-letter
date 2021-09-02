export type RichTextValue = {
  type?: string;
  children: { text: string; bold?: boolean; italic?: boolean; underline?: boolean }[];
}[];
