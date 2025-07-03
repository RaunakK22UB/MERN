import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { serverEndpoint } from '../../config/config';

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: ''
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/users`, {
        withCredentials: true
      });
      setUsers(response.data);
    } catch (error) {
      setErrors({ message: "Unable to fetch users" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (isEdit = false, data = {}) => {
    setIsEdit(isEdit);
    if (isEdit) {
      setFormData({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      });
    } else {
      setFormData({ id: '', name: '', email: '', role: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowDeleteModal = (id) => {
    setFormData({ id });
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverEndpoint}/users/${formData.id}`, {
        withCredentials: true
      });
      fetchUsers();
      handleCloseDeleteModal();
    } catch (error) {
      setErrors({ message: "Unable to delete user" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: formData.name,
      email: formData.email,
      role: formData.role
    };

    const config = { withCredentials: true };
    try {
      if (isEdit) {
        await axios.put(`${serverEndpoint}/users/${formData.id}`, body, config);
      } else {
        await axios.post(`${serverEndpoint}/users`, body, config);
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      setErrors({ message: "Unable to save user" });
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 3 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'actions', headerName: 'Actions', flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenModal(true, params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleShowDeleteModal(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Manage Users</h2>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(false)}>
          {isEdit ? 'Update User' : '+ Add User'}
        </button>
      </div>

      {errors.message && (
        <div className="alert alert-danger">{errors.message}</div>
      )}

      <div style={{ height: 500 }}>
        <DataGrid
          rows={users}
          getRowId={(row) => row._id}
          columns={columns}
          pageSizeOptions={[10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Update User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
            </div>
            {!isEdit && (
              <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
              </div>
            )}
            <div className="mb-3">
              <label>Role</label>
              <input type="text" className="form-control" name="role" value={formData.role} onChange={handleChange} />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Submit'}</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseDeleteModal}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageUser;
// it is comming inside my dashboard page only the managUSer.js file 