/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import {  RequestJobdeskTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import { useSession } from "next-auth/react";
import Select from 'react-select';
import { StyleSelect } from "@/app/helper"

function Update({ jobdesk }: { jobdesk: RequestJobdeskTb }) {
    const session = useSession()
    const [namaJob, setNamajob] = useState(jobdesk.namaJob)
    const [tanggalMulai, setTanggalMulai] = useState(moment(jobdesk.tanggalMulai).format("YYYY-MM-DD"))
    const [deadline, setDeadline] = useState(moment(jobdesk.deadline).format("YYYY-MM-DD"))
    const [keterangan, setKeterangan] = useState(jobdesk.keterangan)
    const [team, setTeam] = useState<string[]>(["1"]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [namaterpilih, setNamaterpilih] = useState('');
    const [dataKaryawan, setDataKaryawan] = useState([])
    const router = useRouter()
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        cariKaryawan()
        const namaTeam = jobdesk.namaTeam
        const dataNamaTeam = JSON.parse(namaTeam);
        const valuesArray = dataNamaTeam.map((item: any) => item.value);
        setTeam(valuesArray)
        setNamaterpilih(namaTeam)
    }, [])

    useEffect(() => {
        const selectedData = dataKaryawan.filter((option: any) => team.includes(option.value));
        setSelectedOptions(selectedData);
    }, [team, dataKaryawan]);

    const cariKaryawan=async ()=>{
        const response = await axios.get(`/admin/api/notkaryawan/${session.data?.karyawanId}`);
        const data = response.data;
        const options = data.map((item: any) => ({
            value: item.id,
            label: item.nama,
        }));
        setDataKaryawan(options)
    }

    const handleSelectChange = (selectedOptions: any) => {
        setTeam(selectedOptions.map((option: any) => option.value));
        const terpilih = JSON.stringify(selectedOptions)
        setNamaterpilih(terpilih)
    };

    const refreshform = () => {
        setNamajob(jobdesk.namaJob)
        setKeterangan(jobdesk.keterangan)
        setDeadline(moment(jobdesk.deadline).format("YYYY-MM-DD"))
        const dataNamaTeam = JSON.parse(jobdesk.namaTeam);
        const valuesArray = dataNamaTeam.map((item: any) => item.value);
        setTeam(valuesArray)
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            formData.append('namaJob', namaJob)
            formData.append('keterangan', keterangan)
            formData.append('tanggalMulai', new Date(tanggalMulai).toISOString())
            formData.append('deadline', new Date(deadline).toISOString())
            formData.append('namaterpilih', namaterpilih)
            formData.append('team', String(team))

            const xxx = await axios.patch(`/master/api/requestjobdesk/${jobdesk.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (xxx.data.pesan == 'tidak bisa diedit') {
               
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Data yang sudah di Acc Tidak bisa diedit',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function () {
                    handleClose()
                }, 1500);
                
            }
            if (xxx.data.pesan == 'berhasil') {
                setShow(false);
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
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <>
            <span onClick={handleShow} className="btn btn-success shadow btn-xl sharp mx-1"><i className="fa fa-edit"></i></span>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Update Data Pengajuan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    <div className="row">
                                <div className="mb-3 col-md-12">
                                    <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Team</label>
                                    <Select
                                        required
                                        isMulti
                                        options={dataKaryawan}
                                        value={selectedOptions}
                                        onChange={handleSelectChange}
                                        styles={StyleSelect}
                                    />
                                </div>
                            </div>

                    <div className="col-md-12 col-xl-12 col-xxl-12 mb-3">
                            <label className="form-label"  style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Nama Job</label>
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
                            <label className="form-label"  style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Keterangan</label>
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
        </>
    )
}

export default Update