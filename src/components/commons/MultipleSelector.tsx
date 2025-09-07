import React, { useEffect, useState } from "react";
import styles from "../../styles/multipleSelector.module.css";
import { FaCheck } from "react-icons/fa";
import { OptionSelectType } from "../../types/global.types";

export const MultipleSelector = ({
  options,
  optionsSelected,
  handleSelectOption,
  title,
  placeholder = "Search...",
}: {
  options: OptionSelectType[];
  optionsSelected: OptionSelectType[];
  handleSelectOption: (option: OptionSelectType) => void;
  title?: string;
  placeholder?: string;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [realOptions, setRealOptions] = useState(options);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const opt = search
      ? options.filter((el) =>
          el.label.toLowerCase().includes(search.toLowerCase())
        )
      : options;

    const selecteds = opt.filter((el) =>
      optionsSelected.some((sel) => sel.key === el.key)
    );
    const notSelecteds = opt.filter(
      (el) => !optionsSelected.some((sel) => sel.key === el.key)
    );

    setRealOptions([...selecteds, ...notSelecteds]);
  }, [options, optionsSelected, search]);

  return (
    <div style={{ margin: "20px 0" }}>
      <div className={styles.selector_title}>
        <h4>{title || "Not title"}</h4>
        <p
          onClick={() => setShowOptions(true)}
          style={{
            backgroundColor:
              optionsSelected.length === 0 ? "inherit" : "orange",
            color: optionsSelected.length === 0 ? "black" : "white",
          }}
        >
          {optionsSelected.length === 0 ? "Not selected" : "Selected"}
        </p>
      </div>

      {showOptions && (
        <div className={styles.container_list}>
          <span className={styles.close} onClick={() => setShowOptions(false)}>
            X
          </span>
          <input
            type="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className={styles.search}
            placeholder={placeholder}
          />
          <ul className={styles.list}>
            {realOptions.map((el) => (
              <li
                key={el.key}
                style={{
                  backgroundColor: optionsSelected.some(
                    (sel) => sel.key === el.key
                  )
                    ? "orange"
                    : "inherit",
                  color: optionsSelected.some((sel) => sel.key === el.key)
                    ? "white"
                    : "black",
                }}
              >
                <span>{el.label}</span>
                <div
                  onClick={() => handleSelectOption(el)}
                  style={{
                    backgroundColor: optionsSelected.some(
                      (sel) => sel.key === el.key
                    )
                      ? "white"
                      : "inherit",
                  }}
                >
                  {optionsSelected.some((sel) => sel.key === el.key) && (
                    <FaCheck style={{ color: "black", fontSize: 17 }} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
