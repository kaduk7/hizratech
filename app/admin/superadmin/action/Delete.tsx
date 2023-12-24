"use client"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { Button } from "primereact/button";

function Delete({ karyawanId }: { karyawanId: Number }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const router = useRouter()

    const handleDelete = async (karyawanId: number) => {
        handleClose()
        await axios.delete(`/admin/api/karyawan/${karyawanId}`)
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Berhasil dihapus',
            showConfirmButton: false,
            timer: 1500
          })
        setTimeout(function () {
            router.refresh()
        }, 1500);
    }

    return (
        <>
           <Button icon="fa fa-trash" rounded severity="danger" onClick={handleShow} />
            <Modal
                dialogClassName="modal-md"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Body>
                    <h6 className="font-bold" style={{color:"black"}}>Anda jakin menghapus data ini ?</h6>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-warning light" onClick={handleClose}>Close</button>
                    <button type="button" className="btn btn-danger light" onClick={() => handleDelete(Number(karyawanId))}>Ya, Hapus</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Delete