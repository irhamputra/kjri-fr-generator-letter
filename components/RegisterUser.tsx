import * as React from "react";
import { useFormik } from "formik";
import { object } from "yup";
import createSchema from "../utils/validation/schema";
import { useMutation } from "react-query";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-hot-toast";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "0px",
  },
};

const RegisterUser: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const initialValues = {
    email: "",
    dob: "",
  };

  const { mutateAsync, data } = useMutation(
    "registerUser",
    async (values: typeof initialValues) => {
      try {
        const { data } = await axios.post<typeof initialValues & { codeId: string }>("/api/v1/users", values);

        return data;
      } catch (e) {
        throw new Error("User telah terdaftar");
      }
    },
    {
      onSuccess: () => {
        setModalOpen(true);
      },
      onError: () => {
        toast.error("User telah terdaftar");
      },
    }
  );

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      await mutateAsync(values);
      resetForm();
      setSubmitting(false);
    },
  });

  const handleCopy = () => {
    // create clipboard
    console.log("Copy Code");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Manage User</h4>
        <div>
          <button onClick={() => setOpen((prevState) => !prevState)} className="btn btn-dark">
            Tambah Staff +
          </button>
        </div>
      </div>

      <div>
        {open ? (
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-3">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="form-control"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
                {errors.email && touched.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="col-3">
                <label htmlFor="DOB">Tanggal Lahir</label>
                <input
                  className="form-control"
                  id="DOB"
                  type="date"
                  name="dob"
                  value={values.dob}
                  onChange={handleChange}
                />
                {errors.dob && touched.dob && <small className="text-danger">{errors.dob}</small>}
              </div>

              <div className="col-12">
                <button className="btn btn-dark">Register user</button>
              </div>
            </div>
          </form>
        ) : null}
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="User Registration Modal"
        style={customStyles}
      >
        <div className="modal-dialog" role="document" style={{ width: "100vw" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center">Kode Verifikasi User</h5>
            </div>
            <div className="modal-body text-center">
              {data?.codeId && <h2>{data.codeId}</h2>}
              <button onClick={handleCopy} className="btn btn-dark">
                Copy Nomor Identifikasi
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RegisterUser;
