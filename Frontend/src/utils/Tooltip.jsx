// Tooltip.jsx
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Tooltip = ({ text, children }) => (
  <Tippy content={text} delay={[300, 0]}>
    <span className="inline-flex">{children}</span>
  </Tippy>
);

export default Tooltip;
