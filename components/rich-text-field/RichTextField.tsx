import React, { PropsWithChildren, useCallback, useRef } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate, ReactEditor } from "slate-react";
import { Editor, createEditor, BaseEditor } from "slate";

import { Button, Toolbar } from "./RichTextComponents";
import { TypeBold, TypeItalic, TypeUnderline } from "react-bootstrap-icons";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const RichTextFieldComponent = ({
  name,
  value,
  onChange,
}: {
  name: string;
  value: any;
  onChange: (value: any) => any;
}) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editorRef = useRef<any>();
  if (!editorRef.current) editorRef.current = withReact(createEditor() as BaseEditor & ReactEditor);
  const editor = editorRef.current;
  return (
    <div style={{ border: "1px solid rgb(206, 212, 218)", borderRadius: 8 }}>
      <Slate editor={editor} value={value} onChange={onChange}>
        <Toolbar>
          <MarkButton format="bold">
            <TypeBold />
          </MarkButton>
          <MarkButton format="italic">
            <TypeItalic />
          </MarkButton>
          <MarkButton format="underline">
            <TypeUnderline />
          </MarkButton>
        </Toolbar>
        <Editable
          name={name}
          style={{ padding: 16 }}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault();
                const mark: string = HOTKEYS[hotkey as "mod+b" | "mod+i" | "mod+u" | "mod+`"];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
    </div>
  );
};

const toggleMark = (editor: BaseEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks = Editor.marks(editor);
  console.log(marks);

  return marks ? (marks as any)[format] === true : false;
};

const Element = ({ attributes, children, element }: PropsWithChildren<{ attributes: any; element: any }>) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({
  attributes,
  children,
  leaf,
}: PropsWithChildren<{
  attributes: any;
  leaf: {
    bold: boolean;
    code: boolean;
    italic: boolean;
    underline: boolean;
  };
}>) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const MarkButton = ({ format, children }: PropsWithChildren<{ format: string }>) => {
  const editor = useSlate();
  return (
    <Button
      style={{ marginRight: 8 }}
      active={isMarkActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {children}
    </Button>
  );
};
export default RichTextFieldComponent;
