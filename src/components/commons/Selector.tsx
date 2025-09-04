import styles from "../../styles/selector.module.css";

export const Selector = ({
  title,
  field,
  options,
  handleSelectOption,
  optionSelected,
}: {
  title?: string;
  field: string;
  options: { title: string; value: string | boolean | null }[];
  handleSelectOption: (field: string, value: string | boolean | null) => void;
  optionSelected: string | boolean | null;
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
            value={el.value === null ? "-" : el.value.toString()}
            selected={optionSelected === el.value}
          >
            {el.title}
          </option>
        ))}
      </select>
    </div>
  );
};
