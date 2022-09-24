import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { Modal } from "react-bootstrap";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function EditUser({ users, setUsers, userId, setShowModal, ...props }) {
  const user_to_update = users.find((user) => user.id === userId);
  const { enqueueSnackbar } = useSnackbar();

  const [formValue, setFormValue] = useState({
    email: user_to_update.email,
    name: user_to_update.name,
    role: user_to_update.role,
  });

  const submit_handler = () => {
    const newList = users.map((item) => {
      if (item.id === userId) {
        return { ...item, ...formValue };
      }
      return item;
    });
    enqueueSnackbar("Data Updated successfully ", { variant: "info" });
    setUsers(newList);
    setShowModal(false);
  };

  const handle_change = (event) => {
    let { id, value } = event.target;
    if (value.trim().length === 0) {
      value = formValue[name];
    }
    setFormValue((values) => {
      return {
        ...values,
        [id]: value.trim(),
      };
    });
  };
  const { email, name, role } = formValue;

  // const submit_handler = () => {
  //   const newList = users.map((item) => {
  //     if (item.id === userId) {
  //       return { ...item, ...formValue };
  //     }
  //     return item;
  //   });
  //   enqueueSnackbar("Data Updated successfully ", { variant: "info" });
  //   setUsers(newList);
  //   setShowModal(false);
  // };

  return (
    <Modal {...props} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Update user</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TextField
          type="text"
          id="name"
          placeholder={name}
          onChange={handle_change}
          variant="filled"
        />

        <TextField
          type="email"
          id="email"
          placeholder={email}
          onChange={handle_change}
          variant="filled"
        />

        <TextField
          type="text"
          id="role"
          placeholder={role}
          onChange={handle_change}
          variant="filled"
        />
      </Modal.Body>
      <Modal.Footer gap={2}>
        <Button variant="contained" color="success" onClick={submit_handler}>
          Confirm
        </Button>
        <hr />
        <Button
          variant="contained"
          color="error"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUser;
