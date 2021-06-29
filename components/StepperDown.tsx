import React from "react";
import { GeoAltFill } from "react-bootstrap-icons";
import styles from "../styles/StepperDown.module.css";

export interface StepperDownProps {
  title?: string;
  Icon?: JSX.Element;
  isLast?: boolean;
}

const StepperDown: React.FC<StepperDownProps> = ({ title, children, isLast, Icon = <GeoAltFill /> }) => {
  return (
    <section>
      <div className={styles.itemWrap}>
        <div className={styles.left}>
          <div className={styles.circle}>{Icon}</div>
          {!isLast && <div className={styles.line} />}
        </div>
        <div className={styles.right}>
          {title && <h5>{title}</h5>}

          {children}
        </div>
      </div>
    </section>
  );
};

export default StepperDown;
