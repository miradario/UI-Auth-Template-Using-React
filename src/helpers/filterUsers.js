export const filterUsers = (array, filters) => {
  let filterArray = [...array];

  //FILTRO EXISTENCIA DE NOMBRE
  if (filters.name !== null)
    filterArray = filterByValue([...filterArray], "name", filters.name);

  //FILTRO EXISTENCIA DE LASTNAME
  if (filters.lastName !== null)
    filterArray = filterByValue([...filterArray], "lastName", filters.lastName);

  //FILTRO EXISTENCIA DE EMAIL
  if (filters.email !== null)
    filterArray = filterByValue([...filterArray], "email", filters.email);

  //FILTRO PAIS DE ORIGEN
  if (filters.country.length > 0)
    filterArray = multiFilters([...filterArray], "country", filters.country);

  //FILTRO POR CURSOS
  if (filters.courses.length > 0)
    filterArray = filterPerCourses([...filterArray], filters.courses);

  //FILTRO TTCDATE
  if (filters.TTCDate.length > 0)
    filterArray = multiFilters([...filterArray], "TTCDate", filters.TTCDate);

  //FILTRO ESTADO (AUTENTICADO/NO)
  if (filters.state !== null)
    filterArray = filterByValue(
      [...filterArray],
      "authenticated",
      filters.state
    );

  //FILTRO TELEFONO
  if (filters.phone !== null)
    filterArray = filterByValue([...filterArray], "phone", filters.phone);

  //FILTRO PAIS DE RESIDENCIA
  if (filters.teach_country.length > 0)
    filterArray = multiFilters(
      [...filterArray],
      "teach_country",
      filters.teach_country
    );

  return filterArray;
};

const filterByValue = (array, attribute, value, equal = true) => {
  const filter = array.filter((el) => {
    const boolAttribute = !!el[1][attribute]?.toString().toLowerCase();

    return equal ? boolAttribute == value : boolAttribute != value;
  });

  return filter;
};

const multiFilters = (array, attribute, values) => {
  const filter = array.filter((el) => {
    return (
      typeof el[1][attribute] == "string" &&
      values.includes(el[1][attribute]?.toLowerCase()?.trim())
    );
  });
  return filter;
};

const filterPerCourses = (array, values) => {
  const filter = array.filter((el) => {
    if (!el[1].course) return false;

    const entries = Object.entries(el[1].course);

    let coincidence = 0;

    entries.forEach((entry) => {
      if (values.includes(entry[0]) && entry[1] === "si") coincidence++;
    });

    return coincidence === values.length;
  });

  return filter;
};
