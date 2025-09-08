import { useState } from "react";
import { useEffect } from "react";
import { getDataSet } from "../../helpers/getDataSet";
import { MultipleSelector } from "../commons/MultipleSelector";
import { Selector } from "../commons/Selector";
import { UserType } from "../../types/user.types";
import { FiltersType } from "../../types/filters.types";
import { ImCross } from "react-icons/im";
import styles from "../../styles/modalFilters.module.css";
import { Constants } from "../../constants/constants";
import { OptionSelectType } from "../../types/global.types";

export const ModalFilters = ({
  data,
  setShowFilters,
  setFiltersActive,
  filtersActive,
  visible,
}: {
  data: UserType[];
  setShowFilters: (show: boolean) => void;
  setFiltersActive: (filters: FiltersType) => void;
  filtersActive: FiltersType;
  visible: boolean;
}) => {
  const [countries, setCountries] = useState<OptionSelectType[]>([]);
  const [TTCDate, setTTCDate] = useState<OptionSelectType[]>([]);
  const [teachCountries, setTeachCountries] = useState<OptionSelectType[]>([]);
  const [courses, setCourses] = useState<OptionSelectType[]>([]);

  useEffect(() => {
    const ct = getDataSet(data, "country");
    const ttc = getDataSet(data, "TTCDate");
    const teachC = getDataSet(data, "teach_country");

    const crsSet: Set<string> = new Set();

    data.forEach((el) => {
      if (el.course) {
        const keys = Object.keys(el.course);
        keys.forEach((el2) => crsSet.add(el2));
      }
    });

    setCourses(
      Array.from(crsSet).map((el) => ({
        key: el,
        label: Constants.COURSE_OPTIONS.find((c) => c.key === el)?.label || el,
      }))
    );
    setCountries(ct.map((el) => ({ key: el, label: el })));
    setTTCDate(ttc.map((el) => ({ key: el, label: el })));
    setTeachCountries(teachC.map((el) => ({ key: el, label: el })));
  }, [data]);

  const handleSelectCountry = (country: OptionSelectType) => {
    let countrySelecteds = filtersActive.filters.country;
    const exist = countrySelecteds.includes(country.key);
    let newCountries = [];
    if (exist)
      newCountries = countrySelecteds.filter((el) => el !== country.key);
    else newCountries = [...countrySelecteds, country.key];

    setFiltersActive({
      ...filtersActive,
      filters: {
        ...filtersActive.filters,
        country: newCountries,
      },
    });
  };

  const handleSelectTeachCountry = (teach_country: OptionSelectType) => {
    let countrySelecteds = filtersActive.filters.teach_country;
    const exist = countrySelecteds.includes(teach_country.key);
    let newCountries = [];
    if (exist)
      newCountries = countrySelecteds.filter((el) => el !== teach_country.key);
    else newCountries = [...countrySelecteds, teach_country.key];

    setFiltersActive({
      ...filtersActive,
      filters: {
        ...filtersActive.filters,
        teach_country: newCountries,
      },
    });
  };

  const handleSelectTTCDate = (TTCDate: OptionSelectType) => {
    let ttcSelecteds = filtersActive.filters.TTCDate;
    const exist = ttcSelecteds.includes(TTCDate.key);
    let newTTC = [];
    if (exist) newTTC = ttcSelecteds.filter((el) => el !== TTCDate.key);
    else newTTC = [...ttcSelecteds, TTCDate.key];

    setFiltersActive({
      ...filtersActive,
      filters: {
        ...filtersActive.filters,
        TTCDate: newTTC,
      },
    });
  };

  const handleSelectCourses = (course: OptionSelectType) => {
    let coursesSelected = filtersActive.filters.courses;
    const exist = coursesSelected.includes(course.key);
    let newCourse = [];
    if (exist) newCourse = coursesSelected.filter((el) => el !== course.key);
    else newCourse = [...coursesSelected, course.key];

    setFiltersActive({
      ...filtersActive,
      filters: {
        ...filtersActive.filters,
        courses: newCourse,
      },
    });
  };

  const handleSelectOption = (
    field: string,
    value: string | boolean | null
  ) => {
    const realValue =
      value === "true" ? true : value === "false" ? false : value;

    setFiltersActive({
      ...filtersActive,
      filters: {
        ...filtersActive.filters,
        [field]: realValue,
      },
    });
  };

  return (
    <div className={`modalFilter ${visible && "visible"}`}>
      <div className={styles.container}>
        <ImCross
          color={Constants.COLORS.primary}
          onClick={() => setShowFilters(false)}
          className={styles.closeModal}
          size={25}
        />
        <h2 className={styles.filterTitle}>Filtros</h2>
        <form
          className="formFilters"
          style={{ overflow: "auto", height: "90%" }}
        >
          <MultipleSelector
            options={countries}
            optionsSelected={filtersActive.filters.country.map((el) => ({
              key: el,
              label: el,
            }))}
            handleSelectOption={handleSelectCountry}
            title="Country"
            placeholder="Search country..."
          />
          <MultipleSelector
            options={teachCountries}
            optionsSelected={filtersActive.filters.teach_country.map((el) => ({
              key: el,
              label: el,
            }))}
            handleSelectOption={handleSelectTeachCountry}
            title="Teacher Country"
            placeholder="Search teacher country..."
          />
          <MultipleSelector
            options={TTCDate}
            optionsSelected={filtersActive.filters.TTCDate.map((el) => ({
              key: el,
              label: el,
            }))}
            handleSelectOption={handleSelectTTCDate}
            title="TTC Date"
            placeholder="Search TTC Date..."
          />
          <MultipleSelector
            options={courses}
            optionsSelected={filtersActive.filters.courses.map((el) => ({
              key: el,
              label:
                Constants.COURSE_OPTIONS.find((c) => c.key === el)?.label || el,
            }))}
            handleSelectOption={handleSelectCourses}
            title="Courses"
            placeholder="Search courses..."
          />

          <Selector
            title="Name"
            options={[
              { title: "Not selected", value: "-" },
              { title: "Vacio", value: false },
              { title: "No vacio", value: true },
            ]}
            handleSelectOption={handleSelectOption}
            field="name"
            optionSelected={filtersActive.filters.name}
          />
          <Selector
            title="Last Name"
            options={[
              { title: "Not selected", value: "-" },
              { title: "Vacio", value: false },
              { title: "No vacio", value: true },
            ]}
            handleSelectOption={handleSelectOption}
            field="lastName"
            optionSelected={filtersActive.filters.lastName}
          />
          <Selector
            title="Email"
            options={[
              { title: "Not selected", value: "-" },
              { title: "Vacio", value: false },
              { title: "No vacio", value: true },
            ]}
            handleSelectOption={handleSelectOption}
            field="email"
            optionSelected={filtersActive.filters.email}
          />
          <Selector
            title="Phone"
            options={[
              { title: "Not selected", value: "-" },
              { title: "Vacio", value: false },
              { title: "No vacio", value: true },
            ]}
            handleSelectOption={handleSelectOption}
            field="phone"
            optionSelected={filtersActive.filters.phone}
          />
          <Selector
            title="State"
            options={[
              { title: "Not selected", value: "-" },
              { title: "Autenticados", value: true },
              { title: "No autenticados", value: false },
            ]}
            handleSelectOption={handleSelectOption}
            field="state"
            optionSelected={filtersActive.filters.state}
          />
        </form>
      </div>
    </div>
  );
};
