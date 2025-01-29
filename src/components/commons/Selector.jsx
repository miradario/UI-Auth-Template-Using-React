import React from "react";
import styles from "../../styles/selector.module.css";

export const Selector = ({
  title,
  field,
  options,
  handleSelectOption,
  optionSelected,
}) => {
  return (
    <div className={styles.container}>
      <label>{title || "Not title"}</label>
      <select
        onChange={(e) =>
          handleSelectOption(
            field,
            e.target.value === "-" ? null : e.target.value
          )
        }
        style={{
          backgroundColor: optionSelected === null ? "inherit" : "orange",
          color: optionSelected === null ? "black" : "white",
        }}
      >
        {options.map((el) => (
          <option
            key={el.title}
            value={el.value}
            selected={optionSelected === el.value}
          >
            {el.title}
          </option>
        ))}
      </select>
    </div>
  );
};
