import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../../config/config';
import { Modal } from 'react-bootstrap';

function LinksDashboard() {
  const [errors, setErrors] = useState({});
  const [linksData, setLinksData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    campaignTitle: '',
    originalUrl: '',
    category: '',
  });

  const handleOpenModal = (isEdit = false, data = {}) => {
    if (isEdit) {
      setFormData({
        id: data._id,
        campaignTitle: data.campaignTitle,
        originalUrl: data.originalUrl,
        category: data.category,
      });
    } else {
      setFormData({
        id: '',
        campaignTitle: '',
        originalUrl: '',
        category: '',
      });
    }

    setIsEdit(isEdit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowDeleteModal = (linkId) => {
    setFormData({ id: linkId });
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverEndpoint}/links/${formData.id}`, {
        withCredentials: true,
      });
      await fetchLinks();
      handleCloseDeleteModal();
    } catch (error) {
      setErrors({ message: 'Unable to delete the link, please try again' });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.campaignTitle) {
      newErrors.campaignTitle = 'Campaign Title is mandatory';
      isValid = false;
    }
    if (!formData.originalUrl) {
      newErrors.originalUrl = 'URL is mandatory';
      isValid = false;
    }
    if (!formData.category) {
      newErrors.category = 'Category is mandatory';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const body = {
        campaign_title: formData.campaignTitle,
        original_url: formData.originalUrl,
        category: formData.category,
      };
      const config = { withCredentials: true };

      try {
        if (isEdit) {
          await axios.put(`${serverEndpoint}/links/${formData.id}`, body, config);
        } else {
          await axios.post(`${serverEndpoint}/links`, body, config);
        }
        await fetchLinks();
        handleCloseModal();
        setFormData({ id: '', campaignTitle: '', originalUrl: '', category: '' });
      } catch (error) {
        setErrors({ message: 'Unable to save the link, please try again' });
      }
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links`, {
        withCredentials: true,
      });
      setLinksData(response.data.data);
    } catch (error) {
      setErrors({ message: 'Unable to fetch links at the moment. Please try again' });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const columns = [
    { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
    
    { field: 'originalUrl', headerName: 'URL', flex: 3,  renderCell:(params)=>(
      <>
        <a href={`${serverEndpoint}/links/r/4{params.roe._id}`}
        target='_blank'
        rel="noopener noreferrer"
       >
        {params.row.originalUrl}
       </a>

      </>
    )},
    { field: 'category', headerName: 'Category', flex: 2 },
    { field: 'clickCount', headerName: 'Clicks', flex: 1 },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenModal(true, params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleShowDeleteModal(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Manage Affiliate Links</h2>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(false)}>
          {isEdit ? 'Update Link' : '+ Add'}
        </button>
      </div>

      {errors.message && (
        <div className="alert alert-danger" role="alert">
          {errors.message}
        </div>
      )}

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={linksData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20, page: 0 },
            },
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          sx={{ fontFamily: 'inherit' }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Update Link' : 'Add Link'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="campaignTitle" className="form-label">Campaign Title</label>
              <input
                type="text"
                className={`form-control ${errors.campaignTitle ? 'is-invalid' : ''}`}
                id="campaignTitle"
                name="campaignTitle"
                value={formData.campaignTitle}
                onChange={handleChange}
              />
              {errors.campaignTitle && <div className="invalid-feedback">{errors.campaignTitle}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="originalUrl" className="form-label">URL</label>
              <input
                type="text"
                className={`form-control ${errors.originalUrl ? 'is-invalid' : ''}`}
                id="originalUrl"
                name="originalUrl"
                value={formData.originalUrl}
                onChange={handleChange}
              />
              {errors.originalUrl && <div className="invalid-feedback">{errors.originalUrl}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <input
                type="text"
                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this link?</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LinksDashboard;


//----------------last updated 30-06-25
// import IconButton from '@mui/material/IconButton';
// import { DataGrid } from '@mui/x-data-grid';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { serverEndpoint } from '../../config/config';
// import { Modal } from 'react-bootstrap';  //-------------------------------------for pop-ups we are going to use Modal of react bootstrap

// function LinksDashboard() {
//   const [errors, setErrors] = useState({});
//   const [linksData, setLinksData] = useState([]);
//   //--------------------------------------for Modal
//   const [showModal, setShowModal] = useState(false);
//   const handleOpenModel =()=>{
//     setShowModal(true);
//   }
//    const handleCloseModel =()=>{
//     setShowModal(false);
//   }

//   const fetchLinks = async () => {
//     try {
//       const response = await axios.get(`${serverEndpoint}/links`, {
//         withCredentials: true,
//       });
//       setLinksData(response.data.data);
//     } catch (error) {
//       console.log(error);
//       setErrors({ message: 'Unable to fetch links at the moment. Please try again' });
//     }
//   };

//   useEffect(() => {
//     fetchLinks();
//   }, []);

//   const columns = [
//     { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
//     { field: 'originalUrl', headerName: 'URL', flex: 3 },
//     { field: 'category', headerName: 'Category', flex: 2 },
//     { field: 'clickCount', headerName: 'Clicks', flex: 1 },
//     {field: 'action',headerName: 'Actions',flex: 1,
//       renderCell: (params) => (
//         <>
//           <IconButton>
//             <EditIcon />
//           </IconButton>
//           <IconButton>
//             <DeleteIcon />
//           </IconButton>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="container py-4">
//       <div className='d-flex justify-content-between mb-3'>
//       <h2>Manage Affiliate Links</h2>
//       <button className='btn btn-primary btn-sm' onClick={()=> handleOpenModel()}>
//         + Add
//       </button>
//       </div>

//       {errors.message && (
//         <div className="alert alert-danger" role="alert">
//           {errors.message}
//         </div>
//       )}

//       <div style={{ height: 500, width: '100%' }}>
//         <DataGrid
//           getRowId={(row) => row._id}
//           rows={linksData}
//           columns={columns}
//           initialState={{
//             pagination: {
//               paginationModel: { pageSize: 20, page: 0 },
//             },
//           }}
//           pageSizeOptions={[20, 50, 100]}
//           disableRowSelectionOnClick
//           showToolbar
//           sx={{
//             fontFamily:'inherit'
//           }}
//         />
        
//       </div>

      
//     <Modal show={false} onHide={()=>handleCloseModel()}></Modal>
//     <Modal.Header closeButton>
//     <Modal.Title>
//       Add Link
//     </Modal.Title>
//     </Modal.Header>
   
//     <Modal.Body>
//       <p>TBD: Add form goes here</p>
//     </Modal.Body>
//     </div>

//   );
// }

// export default LinksDashboard;



// for the UI part of the Links we are useing MUI 