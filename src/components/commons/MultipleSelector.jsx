import React, { useEffect, useState } from "react";
import styles from "../../styles/multipleSelector.module.css";
import { FaCheck } from "react-icons/fa";

export const MultipleSelector = ({
  options,
  optionsSelected,
  handleSelectOption,
  title,
  placeholder = "Search...",
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [realOptions, setRealOptions] = useState(options);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const opt = search
      ? options.filter((el) => el.toLowerCase().includes(search.toLowerCase()))
      : options;

    const selecteds = opt.filter((el) => optionsSelected.includes(el));
    const notSelecteds = opt.filter((el) => !optionsSelected.includes(el));

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
                key={el}
                style={{
                  backgroundColor: optionsSelected.includes(el)
                    ? "orange"
                    : "inherit",
                  color: optionsSelected.includes(el) ? "white" : "black",
                }}
              >
                <span>{el}</span>
                <div
                  onClick={() => handleSelectOption(el)}
                  style={{
                    backgroundColor: optionsSelected.includes(el)
                      ? "white"
                      : "inherit",
                  }}
                >
                  {optionsSelected.includes(el) && (
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
