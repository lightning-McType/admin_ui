import React from "react";
import { Container, Row, Col, Form, Stack, Table } from "react-bootstrap";
import axios from "axios";
import { useSnackbar } from "notistack";
import Button from "@mui/material/Button";
import EditUser from "./EditUser";
import { useState, useEffect } from "react";
import Search from "./Search";
import CustomPagination from "./CustomPagination";

function Datagrid() {
  const [usersInfo, setUsersInfo] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [usersFiltered, setUsersFiltered] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [findText, setFindText] = useState("");
  const [usersSelected, setUsersSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allAreChecked, setAllAreChecked] = useState(false);
  const [userIdUpdate, setUserIdUpdate] = useState(null);
  const rows_per_page = 10;
  const apiURL =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  const update_user = (userId) => {
    setUserIdUpdate(userId);
    setShowModal(true);
  };

  const handle_delete_selected = () => {
    const newList = usersInfo.filter(
      (user) => !usersSelected.includes(user.id)
    );

    const newFilteredList = usersFiltered.filter(
      (user) => !usersSelected.includes(user.id)
    );

    setUsersInfo(newList);
    setUsersFiltered(newFilteredList);
    setAllAreChecked(false);

    if (usersSelected.length) {
      enqueueSnackbar("Data deleted successfully ", { variant: "success" });
    } else {
      enqueueSnackbar("No data selected to delete ", { variant: "warning" });
    }
  };

  const handle_select_all = (event) => {
    let newList = [...usersSelected];
    if (event.target.checked) {
      setAllAreChecked(true);
      newList = current_users.map((user) => user.id);
    } else {
      setAllAreChecked(false);
      newList = [];
    }
    setUsersSelected(newList);
  };

  // const handle_delete_selected = () => {
  //   const newList = usersInfo.filter(
  //     (user) => usersSelected.includes(user.id)
  //   );

  //   const newFilteredList = usersFiltered.filter(
  //     (user) => usersSelected.includes(user.id)
  //   );

  //   setUsersInfo(newList);
  //   setUsersFiltered(newFilteredList);
  //   setAllAreChecked(false);

  //   if (usersSelected.length) {
  //     enqueueSnackbar("Data deleted successfully ", { variant: "success" });
  //   } else {
  //     enqueueSnackbar("No data selected to delete ", { variant: "warning" });
  //   }
  // };

  const handle_delete = (userId) => {
    const newList = usersInfo.filter((user) => user.id !== userId);
    enqueueSnackbar("Data deleted successfully ", { variant: "info" });
    setUsersInfo(newList);
  };

  const handle_select = (event) => {
    let newList = [...usersSelected];
    const userId = event.target.value;

    if (event.target.checked) {
      newList = [...usersSelected, userId];
    } else {
      setAllAreChecked(false);
      newList.splice(usersSelected.indexOf(userId), 1);
    }
    setUsersSelected(newList);
  };

  // const handle_delete = (userId) => {
  //   const newList = usersInfo.filter((user) => user.id !== userId);
  //   enqueueSnackbar("Data deleted successfully ", { variant: "info" });
  //   setUsersInfo(newList);
  // };

  const on_search = (event) => {
    setFindText(event.target.value);
  };

  const fetch_data = async () => {
    try {
      const res = await axios.get(apiURL);
      setUsersInfo(res.data);
    } catch (err) {
      console.log("Fetching users data failed", err);
    }
  };

  const filter = () => {
    if (findText === "") {
      // const result = usersInfo.filter((obj) =>
      //   Object.keys(obj).some((key) => obj[key].includes(findText))
      // );
      // setUsersFiltered(result);
      setUsersFiltered(usersInfo);
    } else {
      // setUsersFiltered(usersInfo);
      const result = usersInfo.filter((obj) =>
        Object.keys(obj).some((key) => obj[key].includes(findText))
      );
      setUsersFiltered(result);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);

  useEffect(() => {
    filter();
  }, [usersInfo, findText]);

  const index_of_last_user_data = currentPage * rows_per_page;
  const index_of_first_user_data = index_of_last_user_data - rows_per_page;
  const current_users = usersFiltered.length
    ? usersFiltered.slice(index_of_first_user_data, index_of_last_user_data)
    : usersInfo.slice(index_of_first_user_data, index_of_last_user_data);
  const total_users = usersFiltered.length;
  const total_pages = Math.ceil(total_users / rows_per_page);

  const paginate = (pageNumber) => {
    if (!allAreChecked) {
      setAllAreChecked(false);
    }
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Search on_search={on_search} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Table hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={handle_select_all}
                    checked={allAreChecked}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current_users.map((user) => {
                return (
                  <tr key={user.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        value={user.id}
                        checked={usersSelected.includes(user.id)}
                        onChange={handle_select}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Stack direction="horizontal">
                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => update_user(user.id)}
                        >
                          <i className="bi bi-pencil-fill text-primary"></i>
                        </Button>

                        <Button
                          size="sm"
                          variant="link"
                          onClick={() => handle_delete(user.id)}
                        >
                          <i className="bi bi-trash-fill text-danger"></i>
                        </Button>
                      </Stack>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      {
        <Row className="pt-2 pt-md-0">
          <Col xs="12" md="4" sm="6">
            <Button
              variant="contained"
              onClick={handle_delete_selected}
              color="secondary"
            >
              Delete the selected users
            </Button>
          </Col>
          <Col xs="12" md="8" sm="6">
            <CustomPagination
              currentPage={currentPage}
              checked={allAreChecked}
              paginate={paginate}
              total_pages={total_pages}
              disabled={usersSelected.length > 0 ? false : true}
            />
          </Col>
        </Row>
      }
      {showModal ? (
        <EditUser
          users={usersInfo}
          userId={userIdUpdate}
          setUsers={setUsersInfo}
          setShowModal={setShowModal}
          onHide={() => setShowModal(false)}
          show={showModal}
        />
      ) : null}
    </Container>
  );
}

export default Datagrid;
