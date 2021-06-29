import clsx from "clsx";
import React, { Ref, PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import styles from "../../styles/RichTextField.module.css";

interface BaseProps {
  className: string;
  [key: string]: unknown;
}

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<HTMLButtonElement>
  ) => (
    <button
      {...props}
      ref={ref}
      type="button"
      tabIndex={-1}
      className={clsx(
        "btn btn-light btn-sm",
        className,
        styles.textButton,
        reversed
          ? active
            ? styles.btnRichTextReverseActive
            : styles.btnRichTextReverseInactive
          : active
          ? styles.btnRichTextActive
          : styles.btnRichTextInactive
      )}
    />
  )
);

export const EditorValue = React.forwardRef(
  (
    {
      className,
      value,
      ...props
    }: PropsWithChildren<
      {
        value: any;
      } & BaseProps
    >,
    ref: Ref<HTMLDivElement>
  ) => {
    const textLines = value.document.nodes
      .map((node: { text: string }) => node.text)
      .toArray()
      .join("\n");
    return (
      <div ref={ref} {...props} className={clsx(className)}>
        <div className={styles.textLinesTitle}>Slate's value as text</div>
        <div className={styles.textLines}>{textLines}</div>
      </div>
    );
  }
);

export const Instruction = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<HTMLDivElement>) => (
    <div {...props} ref={ref} className={clsx(className, styles.intruction)} />
  )
);

export const Menu = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<HTMLDivElement>) => (
    <div {...props} ref={ref} className={clsx(className)} />
  )
);

export const Portal = ({ children }: PropsWithChildren<{}>) => {
  return typeof document === "object" ? ReactDOM.createPortal(children, document.body) : null;
};

export const Toolbar = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: Ref<HTMLDivElement>) => (
    <Menu {...props} ref={ref} className={clsx(className, styles.toolbar)} />
  )
);
