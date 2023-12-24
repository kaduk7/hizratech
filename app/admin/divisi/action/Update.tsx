/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent } from "react"
import { DivisiTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"

function Update({ divisi }: { divisi: DivisiTb }) {

    const [nama, setNama] = useState(divisi.nama)
    const router = useRouter()
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => setShow(true);

    const refreshform = () => {
        setNama(divisi.nama)
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault()
        setShow(false)
        await axios.patch(`/admin/api/divisi/${divisi.id}`, {
            nama: nama,
        })
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Berhasil diubah',
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(function () {
            router.refresh()
        }, 1500);
    }

    return (
        <>
              <span onClick={handleShow} className="btn btn-success shadow btn-xl sharp mx-1"><i className="fa fa-edit"></i></span>

            <Modal
                dialogClassName="modal-m"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Edit Data Divisi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama Divisi</label>
                            <div className="col-sm-8">
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={nama} onChange={(e) => setNama(e.target.value)}
                                />
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                        <button type="submit" className="btn btn-primary light">Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default Update