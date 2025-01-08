import { useState } from "react";
import { useEffect } from "react";
import { getDataSet } from "../../helpers/getDataSet";
import { MultipleSelector } from "../commons/MultipleSelector";
import { Selector } from "../commons/Selector";

export const ModalFilters = ({
  data,
  setShowFilters,
  setFiltersActive,
  filtersActive,
  visible,
}) => {
  const [countries, setCountries] = useState([]);
  const [TTCDate, setTTCDate] = useState([]);
  const [teachCountries, setTeachCountries] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const ct = getDataSet(data, "country");
    const ttc = getDataSet(data, "TTCDate");
    const teachC = getDataSet(data, "teach_country");

    const crsSet = new Set();
    data.forEach((el) => {
      if (el[1].course) {
        const keys = Object.keys(el[1].course);
        keys.forEach((el2) => crsSet.add(el2));
      }
    });

    setCourses(Array.from(crsSet));
    setCountries(ct);
    setTTCDate(ttc);
    setTeachCountries(teachC);
  }, [data]);

  const handleSelectCountry = (country) => {
    let countrySelecteds = filtersActive.filters.country;
    const exist = countrySelecteds.includes(country);
    let newCountries = [];
    if (exist) newCountries = countrySelecteds.filter((el) => el !== country);
    else newCountries = [...countrySelecteds, country];

    setFiltersActive({
      ...filtersActive,
      filters: {
        ...filtersActive.filters,
        country: newCountries,
      },
    });
  };

  const handleSelectTeachCountry = (teach_country) => {
    let countrySelecteds = filtersActive.filters.teach_country;
    const exist = countrySelecteds.includes(teach_country);
    let newCountries = [];
    if (exist)
      newCountries = countrySelecteds.filter((el) => el !== teach_country);
    else newCountries = [...countrySelecteds, teach_country];

    setFiltersActive({
      ...filtersActive,
      filters: {
        ...filtersActive.filters,
        teach_country: newCountries,
      },
    });
  };

  const handleSelectTTCDate = (TTCDate) => {
    let ttcSelecteds = filtersActive.filters.TTCDate;
    const exist = ttcSelecteds.includes(TTCDate);
    let newTTC = [];
    if (exist) newTTC = ttcSelecteds.filter((el) => el !== TTCDate);
    else newTTC = [...ttcSelecteds, TTCDate];

    setFiltersActive({
      ...filtersActive,
      filters: {
        ...filtersActive.filters,
        TTCDate: newTTC,
      },
    });
  };

  const handleSelectCourses = (course) => {
    let coursesSelected = filtersActive.filters.courses;
    const exist = coursesSelected.includes(course);
    let newCourse = [];
    if (exist) newCourse = coursesSelected.filter((el) => el !== course);
    else newCourse = [...coursesSelected, course];

    setFiltersActive({
      ...filtersActive,
      filters: {
        ...filtersActive.filters,
        courses: newCourse,
      },
    });
  };

  const handleSelectOption = (field, value) => {
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
      <div
        style={{
          width: "60%",
          height: "80%",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "20px",
          position: "relative",
          //   overflowY: 'scroll'
        }}
      >
        <p
          onClick={() => setShowFilters(false)}
          style={{
            color: "black",
            cursor: "pointer",
            padding: "20px",
            borderRadius: "100%",
            position: "absolute",
            right: 0,
            top: 0,
            backgroundColor: "#feae00",
            height: "40px",
            width: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "20px",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          X
        </p>
        <h2
          style={{
            color: "black",
            fontSize: "40px",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Filtros
        </h2>
        <form
          className="formFilters"
          style={{ overflow: "auto", height: "90%" }}
        >
          <MultipleSelector
            options={countries}
            optionsSelected={filtersActive.filters.country}
            handleSelectOption={handleSelectCountry}
            title="Country"
            placeholder="Search country..."
          />
          <MultipleSelector
            options={teachCountries}
            optionsSelected={filtersActive.filters.teach_country}
            handleSelectOption={handleSelectTeachCountry}
            title="Teacher Country"
            placeholder="Search teacher country..."
          />
          <MultipleSelector
            options={TTCDate}
            optionsSelected={filtersActive.filters.TTCDate}
            handleSelectOption={handleSelectTTCDate}
            title="TTC Date"
            placeholder="Search TTC Date..."
          />
          <MultipleSelector
            options={courses}
            optionsSelected={filtersActive.filters.courses}
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
