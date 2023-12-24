/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import Select from 'react-select';

function Add() {
    const session = useSession()
    const [namaJob, setNamajob] = useState("")
    const [tanggalMulai, setTanggalMulai] = useState("")
    const [deadline, setDeadline] = useState("")
    const [keterangan, setKeterangan] = useState("")
    const [karyawanId, setKaryawanId] = useState(String(session.data?.karyawanId))
    const router = useRouter()
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const [team, setTeam] = useState<string[]>([]);
    const [namaterpilih, setNamaterpilih] = useState('');
    const [dataKaryawan, setDataKaryawan] = useState([])

    const handleSelectChange = (selectedOptions: any) => {
        setTeam(selectedOptions.map((option: any) => option.value));
        const terpilih = JSON.stringify(selectedOptions)
        setNamaterpilih(terpilih)
    };

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        ref.current?.focus();
        cariKaryawan()
    }, [])

    const cariKaryawan = async () => {
        const response = await axios.get(`/admin/api/notkaryawan/${session.data?.id}`);
        const data = response.data;
        const options = data.map((item: any) => ({
            value: item.id,
            label: item.nama,
        }));
        setDataKaryawan(options)
    }

    function clearForm() {
        setNamajob('')
        setDeadline('')
        setTanggalMulai('')
        setKeterangan('')
        setTeam([])
        setNamaterpilih('')
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('namaJob', namaJob)
            formData.append('keterangan', keterangan)
            formData.append('tanggalMulai', new Date(tanggalMulai).toISOString())
            formData.append('deadline', new Date(deadline).toISOString())
            formData.append('karyawanId', karyawanId)
            formData.append('namaterpilih', namaterpilih)
            formData.append('team', String(team))

            const xxx = await axios.post(`/master/api/requestjobdesk`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'berhasil') {
                handleClose();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil Simpan',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function () {
                    clearForm();
                    router.refresh()
                }, 1500);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: state.isFocused ? '0 0 0 2px #007bff' : null,
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            fontSize: 20,
            color: "black",
            fontFamily: "initial",
        }),
    };

    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                <i className=""></i>Buat Pengajuan</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Tambah Data Pengajuan Tugas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="col-md-12 col-xl-12 col-xxl-12 mb-3">
                            <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Nama Tugas</label>
                            <div className="input-group">
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={namaJob} onChange={(e) => setNamajob(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Team</label>
                                <Select
                                    required
                                    isMulti
                                    options={dataKaryawan}
                                    value={dataKaryawan.filter((option: any) => team.includes(option.value))}
                                    onChange={handleSelectChange}
                                    styles={customStyles}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Tanggal Mulai</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Deadline</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={deadline} onChange={(e) => setDeadline(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-md-12 col-xl-12 col-xxl-12 mb-3">
                            <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Keterangan</label>
                            <div className="input-group">
                                <textarea
                                    required
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={keterangan} onChange={(e) => setKeterangan(e.target.value)}
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