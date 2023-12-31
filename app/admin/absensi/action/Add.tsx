/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";

function Add() {

    const [nama, setNama] = useState("")
    const router = useRouter()
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        ref.current?.focus();
    }, [])

    function clearForm() {
        setNama('')
    }


    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        handleClose();
        await axios.post('/admin/api/divisi', {
            nama: nama,
        })
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Berhasil disimpan',
            showConfirmButton: false,
            timer: 1500
        })

        setTimeout(function () {
            clearForm();
            router.refresh()
        }, 1500);
    }

    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                <i className=""></i>Tambah</button>
            <Modal
                dialogClassName="modal-m"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Tambah Data Divisi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="mb-3 row">
                            <label className="col-sm-4 col-form-label" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama Divisi</label>
                            <div className="col-sm-8">
                                <input
                                    required
                                    autoFocus
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
        </div>
    )
}

export default Add