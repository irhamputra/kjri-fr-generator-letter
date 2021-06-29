import React from "react";
import styles from "./../styles/Stepper.module.css";

export interface StepperProps {
  data: StepperItem[];
  activeIndex: number;
}

export interface StepperItem {
  number: number;
  text: string;
}
export interface StepperItemProps {
  number: number;
  text: string;
  isLast: boolean;
  isActive: boolean;
}

const Stepper: React.FC<StepperProps> = ({ data, activeIndex }) => {
  return (
    <div style={{ display: "flex" }}>
      {data.map(({ number, text }, index) => (
        <StepperItem
          key={number}
          number={number}
          text={text}
          isActive={activeIndex === index}
          isLast={data.length - 1 === index}
        />
      ))}
    </div>
  );
};

const StepperItem: React.FC<StepperItemProps> = ({ number, text, isLast, isActive }) => {
  return (
    <div style={{ marginRight: 4, flex: 1 }}>
      <div className={styles.step}>
        <div className={styles.circleBox}>
          <div className={isActive ? styles.circle : styles.circleUnactive}>{number}</div>
        </div>
        <div className={styles.circleBox2}>{!isLast && <hr />}</div>
      </div>
      <div className={styles.text} style={{ fontWeight: isActive ? "bold" : "normal" }}>
        {text}{" "}
      </div>
    </div>
  );
};

export default Stepper;
