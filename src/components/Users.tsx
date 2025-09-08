import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { ModalFilters } from "./Filters/ModalFilters";
import { Loader } from "./commons/Loader";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { Flex } from "./commons/Flex";
import { Constants } from "../constants/constants";
import { useHistory } from "react-router-dom";
import {
  FiltersFieldsType,
  FiltersType,
  PaginationType,
} from "../types/filters.types";
import { UserType } from "../types/user.types";
import { UserRepository } from "../repositories/user.rps";
import { FileUtils, ObjectUtils, UserUtils } from "../utils";
import styles from "../styles/users.module.css";
import { DatesUtils } from "../utils/dates.utils";
import { FaUserCheck } from "react-icons/fa6";
import { MdOutgoingMail } from "react-icons/md";

const existFilters = (filters: FiltersFieldsType) => {
  const entries = Object.entries(filters);
  const exist = entries.some((el) => {
    return typeof el[1] === "boolean" || (el[1] && el[1].length > 0);
  });
  return exist;
};

export default function Users() {
  //CONST

  const history = useHistory();
  const getPerPage = localStorage.getItem("perPage");
  const email = localStorage.getItem("email");

  //STATES

  const [isLoaded, setIsLoaded] = useState(false);

  const [items, setItems] = useState<UserType[]>([]);
  const [itemsFilter, setItemsFilter] = useState<UserType[]>([]);
  const [showOrder, setShowOrder] = useState(false);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 0,
    perPage: 0,
    totalPages: 0,
  });
  const [viewMoreComment, setViewMoreComment] = useState<string[]>([]);

  const [perPage, setPerPage] = useState<number>(
    getPerPage ? Number(getPerPage) : Constants.FILTERS.PER_PAGE[0]
  );
  const [showPagination, setShowPagination] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingDeleteSelected, setLoadingDeleteSelected] = useState(false);
  const [loadingChangeActiveSelected, setLoadingChangeActiveSelected] =
    useState(false);
  const [loadingResetPassword, setLoadingResetPassword] = useState(false);

  const [filtersActive, setFiltersActive] = useState<FiltersType>(
    Constants.INITIAL_FILTERS
  );
  const [saveCheckboxes, setSaveCheckboxes] = useState<string[]>([]);

  //EFFECTS

  useEffect(() => {
    initEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      let array = [...items];
      if (filtersActive.searchValue)
        array = UserUtils.filterDataSearch(
          [...array],
          filtersActive.searchValue
        );

      if (filtersActive.orderActive.active)
        array = UserUtils.orderArray(
          [...array],
          filtersActive.orderActive.value
        );

      array = UserUtils.filterUsers([...array], filtersActive.filters);

      array = [...array].filter((el) => {
        if (!filtersActive.showInactive) return !!el.inactive === false;
        return true;
      });

      localStorage.setItem("filtersActive", JSON.stringify(filtersActive));

      setItemsFilter(array);
    }
  }, [filtersActive, items]);

  useEffect(() => {
    setSaveCheckboxes([]);
  }, [itemsFilter]);

  useEffect(() => {
    let totalPages =
      Math.floor(itemsFilter.length / perPage) !== itemsFilter.length / perPage
        ? Math.floor(itemsFilter.length / perPage)
        : itemsFilter.length / perPage - 1;

    if (totalPages === -1) totalPages = 0;

    setPagination({
      page: totalPages >= pagination.page ? pagination.page : 0,
      perPage: perPage,
      totalPages,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage, itemsFilter]);

  useEffect(() => {
    localStorage.setItem("perPage", perPage.toString());
  }, [perPage]);

  //FUNCTIONS

  const initEffect = async () => {
    const filters: FiltersType | null = JSON.parse(
      localStorage.getItem("filtersActive") || ""
    );
    setIsLoaded(true);

    const response = await UserRepository.getAll();

    if (response.ok && response.data) {
      const users = response.data;
      setItems(users);
      setItemsFilter(users);
      setPagination({
        page: 0,
        perPage: perPage,
        totalPages:
          Math.floor(users.length / perPage) !== users.length / perPage
            ? Math.floor(users.length / perPage)
            : users.length / perPage - 1,
      });
    }

    setFiltersActive(
      filters
        ? { ...filters, filters: ObjectUtils.parseJson(filters.filters) }
        : Constants.INITIAL_FILTERS
    );

    setIsLoaded(false);
  };

  const orderDataByParam = (e: MouseEvent<HTMLLIElement>) => {
    const key = e.currentTarget.dataset.id;
    // setItemsFilter(order)
    setFiltersActive({
      ...filtersActive,
      orderActive: {
        active: true,
        by: e.currentTarget.textContent,
        value: key || "",
      },
    });
  };

  const handlePrevPage = () => {
    if (pagination.page > 0) {
      setPagination({
        ...pagination,
        page: pagination.page - 1,
      });
    }
  };

  const handleNextPage = () => {
    if (pagination.page !== pagination.totalPages) {
      setPagination({
        ...pagination,
        page: pagination.page + 1,
      });
    }
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    if (saveCheckboxes.length === 10) {
      alert("You can only select up to 10 teachers at a time");
      return;
    }

    const key = e.target.dataset.key as string;

    if (saveCheckboxes.includes(key))
      setSaveCheckboxes(saveCheckboxes.filter((item) => item !== key));
    else setSaveCheckboxes([...saveCheckboxes, key]);
  };

  const deleteSelectedUsers = async () => {
    if (loadingDeleteSelected || saveCheckboxes.length === 0) return;

    const filterUsers = itemsFilter.filter((el) =>
      saveCheckboxes.includes(el.userKey)
    );

    const confirm = window.confirm(
      `¿Está seguro de que desea eliminar a los usuarios seleccionados (${
        saveCheckboxes.length
      })?\n\n${filterUsers
        .map((el, index) => `${index + 1}. ${el.email}`)
        .join("\n")}`
    );

    if (confirm) {
      setLoadingDeleteSelected(true);

      const res = await UserRepository.deleteSelected(filterUsers);

      if (res.ok) window.location.reload();
    }
    setLoadingDeleteSelected(false);

    setSaveCheckboxes([]);
  };

  const changeActiveSelectedUsers = async () => {
    if (loadingChangeActiveSelected || saveCheckboxes.length === 0) return;

    const filterUsers = itemsFilter.filter((el) =>
      saveCheckboxes.includes(el.userKey)
    );

    const confirm = window.confirm(
      `¿Está seguro de que desea cambiar el estado de los usuarios seleccionados (${
        saveCheckboxes.length
      })?\n\n${filterUsers
        .map(
          (el, index) =>
            `${index + 1}. ${el.email} (${
              el.inactive ? "ACTIVAR" : "DESACTIVAR"
            })`
        )
        .join("\n")}`
    );

    if (confirm) {
      setLoadingChangeActiveSelected(true);

      const promises = saveCheckboxes.map((key) => {
        const findUser = filterUsers.find((el) => el.userKey === key);

        return findUser
          ? UserRepository.changeActiveStatus(
              findUser.userKey,
              !findUser.inactive
            )
          : Promise.resolve();
      });

      const responses = await Promise.all(promises);

      if (responses.every((res) => res && res.ok)) window.location.reload();
      else alert("Error changing status for some users");

      setLoadingChangeActiveSelected(false);

      setSaveCheckboxes([]);
    }
  };

  const handleViewMoreComment = (key: string) => {
    if (viewMoreComment.includes(key)) {
      setViewMoreComment(viewMoreComment.filter((item) => item !== key));
    } else {
      setViewMoreComment([...viewMoreComment, key]);
    }
  };

  const handleResetPassword = async () => {
    if (saveCheckboxes.length === 0) return;

    if (saveCheckboxes.length > 4) {
      alert("You can only reset the password for up to 4 teachers at a time");
      return;
    }

    let filterItems = itemsFilter.filter((el) =>
      saveCheckboxes.includes(el.userKey)
    );

    const confirm = window.confirm(
      `¿Está seguro de que desea enviar un correo electrónico de restablecimiento de contraseña a los usuarios seleccionados (${
        saveCheckboxes.length
      })?\n\n${filterItems
        .map(
          (el, index) =>
            `${index + 1}. ${el.email} (${
              el.authenticated === 0
                ? "Primero debes enviar FIRST MAIL"
                : "Listo para enviar"
            })`
        )
        .join("\n")} `
    );

    filterItems = filterItems.filter((el) => el.authenticated !== 0);
    const errors: string[] = [];
    const success: string[] = [];

    if (confirm) {
      setLoadingResetPassword(true);
      for (const user of filterItems) {
        const res = await UserRepository.sendPasswordResetEmail(
          user.email,
          "https://cursos.elartedevivir.org/app"
        );

        if (!res.ok)
          errors.push(`${user.email} - ${res.error || "Error desconocido"}`);
        else success.push(user.email);
      }

      alert(
        `Reset password emails sent successfully to ${success.length}:\n
        ${success.join("\n")} 
        ${errors.length > 0 ? "\n\nErrors:\n" + errors.join("\n") : ""}`
      );

      setLoadingResetPassword(false);

      setSaveCheckboxes([]);
    }
  };

  const handleSendFirstMail = async (user: UserType) => {
    const confirm = window.confirm(
      `¿Está seguro de que desea enviar el primer correo a ${user.email}?`
    );

    if (confirm) {
      setIsLoaded(true);

      const res = await UserRepository.authenticate(user, "a1b2c3e4d5");

      if (res.ok) window.location.reload();

      setIsLoaded(false);
    }
  };

  /** ==================== BUSCADOR =======================*/

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().trim();
    setFiltersActive({ ...filtersActive, searchValue: value });
  };

  const disabledActionsCheckboxes =
    loadingChangeActiveSelected ||
    loadingDeleteSelected ||
    loadingResetPassword;

  return (
    <div className="App">
      <div>
        <Navigation />
        <br />
        <br />
        <br />
        <br />

        {!isLoaded ? (
          email === "sistemas@elartedevivir.org" ? (
            <>
              <div style={{ width: "100%" }}>
                {/* EXCEL BUTTON */}
                <Flex justify="space-between" style={{ margin: 10 }}>
                  <button
                    onClick={() => {
                      FileUtils.exportDataToJSON(items);
                    }}
                    className={styles.exportExcelBtn}
                  >
                    {"EXPORT BACKUP"}
                  </button>
                  <button
                    onClick={async () => {
                      setLoadingExcel(true);
                      await FileUtils.exportDataToExcel(itemsFilter);
                      setLoadingExcel(false);
                    }}
                    className={styles.exportExcelBtn}
                  >
                    {!loadingExcel ? "EXPORT EXCEL" : "Loading..."}
                  </button>
                </Flex>

                <div style={{ width: "90%", margin: "0 auto" }}>
                  {/* TITLE AND ADD USER */}
                  <Flex
                    align="center"
                    justify="center"
                    gap={20}
                    style={{ marginBottom: 10 }}
                  >
                    <h1 style={{ fontSize: 30, marginBottom: 0 }}>
                      Teachers ({itemsFilter.length} of {items.length})
                    </h1>
                    <FaUserPlus
                      onClick={() => history.push("/add-users")}
                      size={40}
                      className={styles.addIcon}
                    />
                  </Flex>

                  {/* SEARCH, FILTERS, ORDER, PAGINATION */}
                  <form
                    className="formSearch"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {/* onSubmit={handleSearch} */}
                    <input
                      type="text"
                      placeholder="Nombre, apellido o email..."
                      style={{
                        display: "block",
                        padding: 8,
                        width: 350,
                      }}
                      name="search"
                      // value={valueSearchAux}
                      // onChange={e => setValueSearchAux(e.target.value)}
                      value={filtersActive.searchValue}
                      onChange={handleSearchChange}
                    />
                    <label htmlFor="search">
                      <AiOutlineSearch />
                    </label>
                    <input
                      type="submit"
                      name="search"
                      id="search"
                      style={{ display: "none" }}
                    />
                  </form>

                  <Flex justify="center" gap={20} style={{ marginBottom: 20 }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        setFiltersActive({
                          ...filtersActive,
                          showInactive: !filtersActive.showInactive,
                        })
                      }
                      style={{
                        backgroundColor: filtersActive.showInactive
                          ? Constants.COLORS.red
                          : Constants.COLORS.grey,
                      }}
                    >
                      {filtersActive.showInactive
                        ? "Show inactive users"
                        : "Hide inactive users"}
                    </button>

                    <div
                      className="orderContainer"
                      style={{
                        position: "relative",
                        backgroundColor: existFilters(filtersActive.filters)
                          ? Constants.COLORS.primary
                          : Constants.COLORS.white,
                        color: existFilters(filtersActive.filters)
                          ? Constants.COLORS.white
                          : Constants.COLORS.black,
                      }}
                    >
                      <p
                        onClick={() => setShowFilters(true)}
                        style={{ padding: "0 15px" }}
                      >
                        Filtro:{" "}
                        {existFilters(filtersActive.filters)
                          ? `Activo`
                          : "Inactivo"}
                      </p>
                      {existFilters(filtersActive.filters) && (
                        <div
                          style={{
                            position: "absolute",
                            right: -10,
                            top: -10,
                          }}
                        >
                          <Flex align="center">
                            <ImCross
                              color={"red"}
                              style={{ cursor: "pointer" }}
                              size={17}
                              onClick={() =>
                                setFiltersActive({
                                  ...filtersActive,
                                  filters: Constants.INITIAL_FILTERS.filters,
                                })
                              }
                            />
                          </Flex>
                        </div>
                      )}
                    </div>

                    <ModalFilters
                      visible={showFilters}
                      data={items}
                      setShowFilters={setShowFilters}
                      setFiltersActive={setFiltersActive}
                      filtersActive={filtersActive}
                    />

                    <div
                      className="orderContainer"
                      style={{
                        padding: "0 15px",
                        backgroundColor: filtersActive.orderActive.active
                          ? Constants.COLORS.primary
                          : Constants.COLORS.white,
                      }}
                      onClick={() => setShowOrder(!showOrder)}
                    >
                      <p
                        style={{
                          color: filtersActive.orderActive.active
                            ? Constants.COLORS.white
                            : Constants.COLORS.black,
                        }}
                      >
                        {"Order by " + filtersActive.orderActive.by ||
                          "Order by..."}
                      </p>
                      {showOrder && (
                        <ul className="orderOptions">
                          {filtersActive.orderActive.active && (
                            <li
                              className="delete-order"
                              onClick={() => {
                                setItemsFilter(items);
                                setFiltersActive({
                                  ...filtersActive,
                                  orderActive: {
                                    active: false,
                                    by: "",
                                    value: "",
                                  },
                                });
                              }}
                            >
                              Clear
                            </li>
                          )}

                          {Constants.FILTERS.ORDER_OPTIONS.map((el) => (
                            <li
                              data-id={el.key}
                              key={el.key}
                              onClick={orderDataByParam}
                            >
                              {el.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div
                      className="orderContainer"
                      style={{ padding: "0 15px" }}
                      onClick={() => setShowPagination(!showPagination)}
                    >
                      <p>Por pagina: {perPage}</p>
                      {showPagination && (
                        <ul className="orderOptions">
                          {Constants.FILTERS.PER_PAGE.map((el) => (
                            <li key={el} onClick={() => setPerPage(el)}>
                              {el}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Flex>

                  {/* PAGINATION */}
                  {itemsFilter.length > 0 && (
                    <div className="containerBtnPage">
                      {pagination.page !== 0 ? (
                        <div
                          className="containerBtnPage__btn"
                          onClick={handlePrevPage}
                        >
                          <BsChevronLeft />
                        </div>
                      ) : (
                        <div
                          className="containerBtnPage__btn"
                          style={{
                            backgroundColor: "inherit",
                            border: "none",
                            color: Constants.COLORS.lightGray,
                          }}
                        >
                          <BsChevronLeft />
                        </div>
                      )}
                      <p>
                        {pagination.page + 1} / {pagination.totalPages + 1}
                      </p>
                      {pagination.page !== pagination.totalPages ? (
                        <div
                          className="containerBtnPage__btn"
                          onClick={handleNextPage}
                        >
                          <BsChevronRight />
                        </div>
                      ) : (
                        <div
                          className="containerBtnPage__btn"
                          style={{
                            backgroundColor: "inherit",
                            border: "none",
                            color: Constants.COLORS.lightGray,
                          }}
                        >
                          <BsChevronRight />
                        </div>
                      )}
                    </div>
                  )}
                  {/* PAGINATION CLOSE */}

                  {/* SELECTED USERS ACTIONS */}
                  {saveCheckboxes.length > 0 && (
                    <div className={styles.selectedUsersContainer}>
                      <h6>SELECTED: {saveCheckboxes.length}</h6>

                      <div>
                        <Flex gap={10} justify="center">
                          <button
                            onClick={deleteSelectedUsers}
                            disabled={disabledActionsCheckboxes}
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={changeActiveSelectedUsers}
                            disabled={disabledActionsCheckboxes}
                          >
                            Activar / Desactivar
                          </button>
                          <button
                            onClick={handleResetPassword}
                            disabled={disabledActionsCheckboxes}
                          >
                            Reset Pass
                          </button>
                        </Flex>
                        <ImCross
                          className={styles.crossIcon_selected}
                          onClick={() => {
                            const confirm = window.confirm(
                              "¿Desea cancelar la selección de usuarios?"
                            );
                            if (confirm) setSaveCheckboxes([]);
                          }}
                        />
                      </div>
                      {disabledActionsCheckboxes && (
                        <Loader
                          size={30}
                          color={Constants.COLORS.white}
                          style={{ marginTop: 10 }}
                        />
                      )}
                    </div>
                  )}

                  {/* START TABLE WITH USERS DATA */}
                  <div style={{ overflow: "auto" }}>
                    <table
                      className="table table-striped"
                      style={{
                        fontSize: 12,
                        width: "100%",
                        overflow: "auto",
                      }}
                    >
                      <thead>
                        <tr>
                          {Constants.TABLE.HEADER.map((el) => (
                            <th key={el} scope="col">
                              {el}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {itemsFilter
                          .slice(
                            pagination.page * pagination.perPage,
                            (pagination.page + 1) * pagination.perPage
                          )
                          .map((user) => (
                            <tr
                              id="list_users"
                              key={user.userKey}
                              style={{
                                backgroundColor: user.inactive ? "orange" : "",
                              }}
                            >
                              <td>
                                <input
                                  style={{ marginTop: 10 }}
                                  id="checked_option"
                                  type="checkbox"
                                  data-key={user.userKey}
                                  checked={saveCheckboxes.includes(
                                    user.userKey
                                  )}
                                  onChange={handleCheckbox}
                                />
                              </td>
                              <td style={{ paddingLeft: 20 }}>
                                <FaUserEdit
                                  style={{ cursor: "pointer" }}
                                  size={30}
                                  color={
                                    user.inactive
                                      ? Constants.COLORS.white
                                      : Constants.COLORS.primary
                                  }
                                  onClick={() => {
                                    history.push({
                                      pathname: "/add-users",
                                      state: { key: user.userKey },
                                    });
                                  }}
                                />
                              </td>

                              {user.authenticated === 0 ? (
                                <td>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => handleSendFirstMail(user)}
                                    style={{ fontSize: 12 }}
                                  >
                                    <MdOutgoingMail size={25} />
                                  </button>
                                </td>
                              ) : (
                                <td
                                  style={{
                                    color: Constants.COLORS.green,
                                    fontWeight: "bold",
                                    fontSize: 10,
                                  }}
                                >
                                  <FaUserCheck
                                    size={30}
                                    title="Authenticated"
                                  />
                                </td>
                              )}
                              <td>
                                {DatesUtils.formatTimestampToDDMMAAAA(
                                  user.updatedAt
                                ) || "-"}
                              </td>
                              <td>{user.name}</td>
                              <td>{user.lastName}</td>
                              <td>{user.email}</td>
                              <td>
                                {DatesUtils.formatAAAAMMDDtoDDMMYYYY(
                                  user.birthday
                                ) || "-"}
                              </td>
                              <td>{user.phone}</td>
                              <td>{user?.country}</td>
                              <td>{user.teach_country}</td>
                              <td>{user.code}</td>
                              <td>{user.manualCode}</td>
                              <td>{user.kriyaNotesCode}</td>
                              <td
                                style={{
                                  color: colorBoolean(user?.SKY?.long === 1),
                                  fontSize: 14,
                                  fontWeight: "bold",
                                }}
                              >
                                {user?.SKY?.long === 1 ? "ON" : "OFF"}
                              </td>
                              <td
                                style={{
                                  color: colorBoolean(user?.SKY?.short === 1),
                                  fontSize: 14,
                                  fontWeight: "bold",
                                }}
                              >
                                {user?.SKY?.short === 1 ? "ON" : "OFF"}
                              </td>
                              <td
                                style={{
                                  color: colorBoolean(!user.inactive),
                                  fontSize: 12,
                                  fontWeight: "bold",
                                }}
                              >
                                {user.inactive ? "DISABLE" : "ENABLE"}
                              </td>
                              <td>{user.TTCDate}</td>
                              <td>{user.placeTTC}</td>
                              <td
                                style={{
                                  color: colorBoolean(user.sign === 1),
                                  fontSize: 14,
                                  fontWeight: "bold",
                                }}
                              >
                                {user.sign === 1 ? "SI" : "NO"}
                              </td>
                              <td>
                                {user.comment?.length > 25 ? (
                                  <div>
                                    {viewMoreComment.includes(user.userKey)
                                      ? user.comment
                                      : `${user.comment.slice(0, 25)}...`}

                                    <span
                                      onClick={() =>
                                        handleViewMoreComment(user.userKey)
                                      }
                                      style={{
                                        cursor: "pointer",
                                        color: "#feae00",
                                        fontWeight: "bold",
                                        textDecoration: "underline",
                                        display: "block",
                                      }}
                                    >
                                      {" "}
                                      {viewMoreComment.includes(user.userKey)
                                        ? "Ver menos"
                                        : "Ver más"}
                                    </span>
                                  </div>
                                ) : (
                                  user.comment || "-"
                                )}
                              </td>
                              {/* CURSOS */}
                              {Constants.COURSE_OPTIONS.map((el) => {
                                const value = user.course
                                  ? user?.course[
                                      el.key as keyof typeof user.course
                                    ]?.toUpperCase() || "NO"
                                  : "NO";

                                return (
                                  <td
                                    key={el.key}
                                    style={{
                                      fontSize: 14,
                                      fontWeight: "bold",
                                      color: colorBoolean(value === "SI"),
                                    }}
                                  >
                                    {value}
                                  </td>
                                );
                              })}

                              {/* USER ID */}
                              <td
                                style={{
                                  fontSize: 8,
                                  fontWeight: "bold",
                                  color: Constants.COLORS.black,
                                }}
                              >
                                {user.userKey}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {itemsFilter.length === 0 && (
                <div
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    marginTop: 20,
                    fontWeight: "bold",
                    color: Constants.COLORS.error,
                  }}
                >
                  <p>No users found!</p>
                </div>
              )}

              {/* PAGINATION */}
              {itemsFilter.length > 0 && (
                <div className="containerBtnPage">
                  {pagination.page !== 0 ? (
                    <div
                      className="containerBtnPage__btn"
                      onClick={handlePrevPage}
                    >
                      <BsChevronLeft />
                    </div>
                  ) : (
                    <div
                      className="containerBtnPage__btn"
                      style={{
                        backgroundColor: "inherit",
                        border: "none",
                        color: "#a5a5a5",
                      }}
                    >
                      <BsChevronLeft />
                    </div>
                  )}
                  <p>
                    {pagination.page + 1} / {pagination.totalPages + 1}
                  </p>
                  {pagination.page !== pagination.totalPages ? (
                    <div
                      className="containerBtnPage__btn"
                      onClick={handleNextPage}
                    >
                      <BsChevronRight />
                    </div>
                  ) : (
                    <div
                      className="containerBtnPage__btn"
                      style={{
                        backgroundColor: "inherit",
                        border: "none",
                        color: "#a5a5a5",
                      }}
                    >
                      <BsChevronRight />
                    </div>
                  )}
                </div>
              )}
              {/* PAGINATION CLOSE */}
            </>
          ) : (
            <div className="not_permisions">
              <p>
                No tiene permisos! Por favor{" "}
                <span
                  className="not_permisions_link"
                  onClick={() => history.push("/signin")}
                >
                  inicie sesion de Administrador
                </span>
              </p>
            </div>
          )
        ) : (
          <div className="not_permisions ">
            <div className="loader_container">
              <Loader newClass="loader-order" />
              <p>Loading Users</p>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

const colorBoolean = (value: boolean) => {
  return value ? Constants.COLORS.green : Constants.COLORS.red;
};
