/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import {  KaryawanTb, RequestJobdeskTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import { supabase, supabaseBUCKET } from "@/app/helper";

function Update({ reqjobdesk, karyawanTB, reload }: { reqjobdesk: RequestJobdeskTb, karyawanTB: KaryawanTb, reload: Function }) {

    const [karyawanId, setKaryawanId] = useState(String(reqjobdesk.karyawanId))
    const [namaJob, setNamajob] = useState(reqjobdesk.namaJob)
    const [tanggalMulai, setTanggalMulai] = useState(moment(reqjobdesk.tanggalMulai).format("YYYY-MM-DD"))
    const [deadline, setDeadline] = useState(moment(reqjobdesk.deadline).format("YYYY-MM-DD"))
    const [keterangan, setKeterangan] = useState(reqjobdesk.keterangan)
    const [rincian, setRincian] = useState(reqjobdesk.rincian)

    const [alasan, setAlasan] = useState("")
    const [namakaryawan, setNamakaryawan] = useState(karyawanTB.nama)

    const [fileSuratTugas, setFileSurattugas] = useState<File | null>()
    const [fileBeritaAcara, setFileBeritaacara] = useState<File | null>()
    const [fileAnggaran, setFileAnggaran] = useState<File | null>()

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [team, setTeam] = useState<string[]>([]);
    const [namaterpilih, setNamaterpilih] = useState('');
    const [namateam, setNamateam] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    if (isLoading) {
        Swal.fire({
            title: "Mohon tunggu!",
            html: "Sedang mengirim data ke server",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        })
    }

    const handleShow = () => setShow(true);
    const handleShow2 = () => setShow2(true);
    const handleShow3 = () => setShow3(true);

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleClose2 = () => {
        setShow2(false);
    }

    const handleClose3 = () => {
        setShow3(false);
    }

    const klikTolak = async (e: SyntheticEvent) => {
        e.preventDefault()
        handleShow2()
    }

    const klikTerima = async (e: SyntheticEvent) => {
        e.preventDefault()
        handleShow3()
    }

    const handleTolak = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        const konfirm = 'tolak'
        try {
            const formData = new FormData()
            formData.append('alasan', alasan)
            formData.append('konfirm', konfirm)
            const xxx = await axios.patch(`/admin/api/verifikasi/${reqjobdesk.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            setTimeout(function () {
                if (xxx.data.pesan == 'berhasil') {
                    setShow(false);
                    setShow2(false);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Berhasil diubah',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setIsLoading(false)
                    reload()
                }
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleTerima = async (e: SyntheticEvent) => {
        setIsLoading(true)
        e.preventDefault()
        const konfirm = 'terima'
        try {
            const formData = new FormData()
            formData.append('namaJob', namaJob)
            formData.append('keterangan', keterangan)
            formData.append('rincian', rincian)
            formData.append('deadline', new Date(deadline).toISOString())
            formData.append('tanggalMulai', new Date(tanggalMulai).toISOString())
            formData.append('karyawanId', karyawanId)
            formData.append('konfirm', konfirm)
            formData.append('fileSuratTugas', fileSuratTugas as File)
            formData.append('fileBeritaAcara', fileBeritaAcara as File)
            formData.append('fileAnggaran', fileAnggaran as File)
            formData.append('team', String(team))
            formData.append('namaterpilih', namaterpilih)

            const fileSuratTugas2 = formData.get('fileSuratTugas') as File;
            const namaunikSurat = Date.now() + '-' + fileSuratTugas2.name
            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`file/${namaunikSurat}`, fileSuratTugas2);

            const fileBeritaAcara2 = formData.get('fileBeritaAcara') as File;
            const namaunikBerita = Date.now() + '-' + fileBeritaAcara2.name
            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`file/${namaunikBerita}`, fileBeritaAcara2);

            const fileAnggaran2 = formData.get('fileAnggaran') as File;
            const namaunikAnggaran = Date.now() + '-' + fileAnggaran2.name
            await supabase.storage
                .from(supabaseBUCKET)
                .upload(`file/${namaunikAnggaran}`, fileAnggaran2);

            formData.append('namaunikSurat', namaunikSurat)
            formData.append('namaunikBerita', namaunikBerita)
            formData.append('namaunikAnggaran', namaunikAnggaran)


            const xxx = await axios.patch(`/admin/api/verifikasi/${reqjobdesk.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setTimeout(function () {
                if (xxx.data.pesan == 'berhasil') {
                    setShow(false);
                    setShow3(false);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Berhasil diubah',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setIsLoading(false)
                    reload()
                }
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        const namaTeam = reqjobdesk.namaTeam
        const dataNamaTeam = JSON.parse(namaTeam);
        const labelArray = dataNamaTeam.map((item: any) => item.label);
        const valuesArray = dataNamaTeam.map((item: any) => item.value);
        setNamateam(labelArray)
        setTeam(valuesArray)
        setNamaterpilih(namaTeam)
    }, [])

    const refreshform = () => {
        setNamajob(reqjobdesk.namaJob)
        setKeterangan(reqjobdesk.keterangan)
        setRincian(reqjobdesk.rincian)
        setDeadline(moment(reqjobdesk.deadline).format("YYYY-MM-DD"))
    }

    return (
        <>
            <span onClick={handleShow} className="btn btn-success shadow btn-xl sharp mx-1"><i className="fa fa-eye"></i></span>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form >
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Verifikasi Pengajuan Tugas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="card profile-card card-bx m-b30">
                            <div className="card-body">
                                <div className="row">
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Nama Karyawan</label>
                                        <input
                                            required
                                            disabled
                                            type="text"
                                            className="form-control"
                                            style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                            value={namakaryawan}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Team</label>
                                        <input
                                            required
                                            disabled
                                            type="text"
                                            className="form-control"
                                            style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                            value={namateam}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Nama Jobdesk</label>
                                        <input
                                            disabled
                                            required
                                            type="text"
                                            className="form-control"
                                            style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                            value={namaJob}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Keterangan</label>
                                        <input
                                            required
                                            disabled
                                            type="text"
                                            className="form-control"
                                            style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                            value={keterangan}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Rincian</label>
                                        <input
                                            required
                                            disabled
                                            type="text"
                                            className="form-control"
                                            style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                            value={rincian}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Tanggal Mulai</label>
                                        <input
                                            required
                                            disabled
                                            type="date"
                                            className="form-control"
                                            style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                            value={tanggalMulai}
                                        />
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Deadline</label>
                                        <input
                                            required
                                            disabled
                                            type="date"
                                            className="form-control"
                                            style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                            value={deadline}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={klikTolak}>Tolak</button>
                        <button type="button" className="btn btn-primary light" onClick={klikTerima}>Terima</button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal
                dialogClassName="modal-m"
                show={show2}
                onHide={handleClose2}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleTolak}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Alasan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Keterangan</label>
                                <textarea

                                    required
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={alasan} onChange={(e) => setAlasan(e.target.value)}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose2}>Close</button>
                        <button type="submit" className="btn btn-primary light">Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal
                dialogClassName="modal-m"
                show={show3}
                onHide={handleClose3}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleTerima}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Input Dokumen</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Upload Surat Tugas</label>
                                <input
                                    required
                                    type="file"
                                    name="file"
                                    accept=".docx, .xlsx"
                                    className="form-control"
                                    onChange={(e) => setFileSurattugas(e.target.files?.[0])}
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Upload Berita Acara</label>
                                <input
                                    required
                                    type="file"
                                    name="file"
                                    accept=".docx, .xlsx"
                                    className="form-control"
                                    onChange={(e) => setFileBeritaacara(e.target.files?.[0])}
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Upload Laporan Anggaran</label>
                                <input
                                    required
                                    type="file"
                                    name="file"
                                    accept=".docx, .xlsx"
                                    className="form-control"
                                    onChange={(e) => setFileAnggaran(e.target.files?.[0])}
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose3}>Close</button>
                        <button type="submit" className="btn btn-primary light">Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default Update