import { Placement } from "@popperjs/core";
import React from "react";
import { usePopper } from "react-popper";
import useOnClickOutside from "../hooks/useOnClickOutside";

interface PopupProps {
  anchorRef: Element;
  onClickOutside: () => void;
  open: boolean;
  placement?: Placement;
}

const Popup: React.FC<PopupProps> = ({ anchorRef, onClickOutside, open, children, placement = "left-start" }) => {
  const [popperElement, setPopperElement] = React.useState(null);
  const [arrowElement, setArrowElement] = React.useState(null);
  const closeRef = React.useRef(null);
  useOnClickOutside(closeRef, onClickOutside);

  const { styles: stylesPopper, attributes } = usePopper(anchorRef, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    placement,
  });
  return (
    <>
      {open && (
        <div
          ref={setPopperElement}
          style={{
            ...stylesPopper.popper,
            boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.1)",
            zIndex: 999,
          }}
          {...attributes.popper}
        >
          <div ref={closeRef}>{children}</div>

          <div ref={setArrowElement} style={stylesPopper.arrow} />
        </div>
      )}
    </>
  );
};

export default Popup;
