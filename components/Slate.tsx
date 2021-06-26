// Import the Slate editor factory.
import { createEditor, BaseEditor } from "slate";

// Import the Slate components and React plugin.
import { Slate, ReactEditor, Editable, withReact } from "slate-react";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

type Editor = BaseEditor & ReactEditor;

import React from "react";

const SlateComponent = () => {
  const editor = React.useMemo(() => withReact(createEditor() as Editor), []);
  const [value, setValue] = React.useState<CustomElement[]>([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);
  return (
    <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue as any)}>
      <Editable />
    </Slate>
  );
};

export default SlateComponent;
