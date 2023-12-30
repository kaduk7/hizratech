/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

function Add() {
    const session = useSession()
    const [nama, setNama] = useState("")
    const [tempatLahir, setTempatlahir] = useState("")
    const [tanggalLahir, setTanggallahir] = useState('2000-01-01')
    const [alamat, setAlamat] = useState("")
    const [hp, setHp] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    
    const [selectdivisi, setSelectdivisi] = useState([])
    const [divisiId, setDivisiId] = useState("")
    const [namadivisi, setNamadivisi] = useState("")

    const [karyawanCek, setKaryawanCek] = useState(false)
    const [informasiCek, setInformasiCek] = useState(false)
    const [jobdeskCek, setJobdeskCek] = useState(false)
    const [karyawanCekValue, setKaryawanCekValue] = useState("Tidak")
    const [informasiCekValue, setInformasiCekValue] = useState("Tidak")
    const [jobdeskCekValue, setJobdeskCekValue] = useState("Tidak")

    const router = useRouter()
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const refemail = useRef<HTMLInputElement>(null);
    const refhp = useRef<HTMLInputElement>(null);
    const [st, setSt] = useState(false);

    const setfokusemail = () => {
        refemail.current?.focus();
    }

    const setfokushp = () => {
        refhp.current?.focus();
    }

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        ref.current?.focus();
        divisi();
    }, [])

    async function divisi() {
        const response = await axios.get(`/admin/api/divisi`);
        const data = response.data;
        setSelectdivisi(data)
    }

    const onDivisi = async (e: any) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedLabel = selectedOption.getAttribute("label");
        setDivisiId(e.target.value);   
        setNamadivisi(selectedLabel)
        console.log(selectedLabel)
    }

    function clearForm() {
        setNama('')
        setTempatlahir('')
        setTanggallahir('2000-01-01')
        setAlamat('')
        setHp('')
        setPassword('')
        setEmail('')
        setDivisiId('')
        setSt(false)
        setKaryawanCek(false)
        setInformasiCek(false)
        setJobdeskCek(false)
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('tempatlahir', tempatLahir)
            formData.append('tanggallahir', new Date(tanggalLahir).toISOString())
            formData.append('alamat', alamat)
            formData.append('hp', hp)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('divisiId', divisiId)
            formData.append('namadivisi', namadivisi)
            formData.append('karyawanCekValue', karyawanCekValue)
            formData.append('informasiCekValue', informasiCekValue)
            formData.append('jobdeskCekValue', jobdeskCekValue)

            const xxx = await axios.post(`/admin/api/karyawan`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'Email sudah ada') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Email sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function () {
                    setfokusemail()
                }, 1500);
            }
            if (xxx.data.pesan == 'No Hp sudah ada') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'No Hp sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(function () {
                    setfokushp()
                }, 1600);
            }

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

    const handleCheckboxChangeKaryawan = () => {
        setKaryawanCek(!karyawanCek);
        if (!karyawanCek) {
            setKaryawanCekValue("Ya")
        }
        else {
            setKaryawanCekValue("Tidak")
        }
    };

    const handleCheckboxChangeinformasi = () => {
        setInformasiCek(!informasiCek);
        if (!informasiCek) {
            setInformasiCekValue("Ya")
        }
        else {
            setInformasiCekValue("Tidak")
        }
    };

    const handleCheckboxChangeJobdesk = () => {
        setJobdeskCek(!jobdeskCek);
        if (!jobdeskCek) {
            setJobdeskCekValue("Ya")
        }
        else {
            setJobdeskCekValue("Tidak")
        }
    };


    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                <i className=""></i>Tambah Karyawan</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Tambah Data Karyawan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Nama Karyawan</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={nama} onChange={(e) => setNama(e.target.value)}
                                />
                            </div>

                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>No Hp</label>
                                <input
                                    required
                                    ref={refhp}
                                    type="number"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={hp} onChange={(e) => setHp(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Divisi</label>
                                <select
                                    required
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    className="form-control"
                                    value={divisiId} onChange={onDivisi}>
                                    <option value={''}> Pilih Divisi</option>
                                    {selectdivisi?.map((item: any, i) => (
                                        <option key={i} value={item.id} label={item.nama} >{item.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Email</label>
                                <input
                                    required
                                    ref={refemail}
                                    type="email"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Password</label>
                                <div className="input-group input-success">
                                    <input
                                        required
                                        type={st ? "text" : "password"}
                                        className="form-control"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {st ?
                                        <button onClick={() => setSt(!st)} className="input-group-text border-0" type="button">
                                            <i className="mdi mdi-eye-off" />
                                        </button>
                                        :
                                        <button onClick={() => setSt(!st)} className="input-group-text border-0" type="button">
                                            <i className="mdi mdi-eye" />
                                        </button>
                                    }
                                </div>
                            </div>

                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Tempat Lahir</label>
                                <input
                                    // required
                                    type="text"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={tempatLahir} onChange={(e) => setTempatlahir(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Tanggal Lahir</label>
                                <input
                                    // required
                                    type="date"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={tanggalLahir} onChange={(e) => setTanggallahir(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row  mb-3">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Alamat</label>
                                <textarea
                                    // required
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={alamat} onChange={(e) => setAlamat(e.target.value)}
                                />
                            </div>
                        </div>

                        {session?.data?.status === 'Admin' ?
                            <div className="row">
                                <div className="mb-3 col-md-12">
                                    <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Hak Akses</label>
                                    <div className="row">
                                        <div className="col-xl-4 col-xxl-4 col-4">
                                            <div className="form-check custom-checkbox mb-3">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    style={{ fontFamily: "initial", color: "black", borderColor: "grey" }}
                                                    id="karyawancek"
                                                    checked={karyawanCek}
                                                    onChange={handleCheckboxChangeKaryawan}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="karyawancek"
                                                    style={{ fontFamily: "initial", fontSize: 17, color: "black" }}>
                                                    Data Karyawan
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-xxl-4 col-4">
                                            <div className="form-check custom-checkbox mb-3 ">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    style={{ fontFamily: "initial", color: "black", borderColor: "grey" }}
                                                    id="informasicek"
                                                    checked={informasiCek}
                                                    onChange={handleCheckboxChangeinformasi}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="informasicek"
                                                    style={{ fontFamily: "initial", fontSize: 17, color: "black" }}>
                                                    Informasi
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-xxl-4 col-4">
                                            <div className="form-check custom-checkbox mb-3 ">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    style={{ fontFamily: "initial", color: "black", borderColor: "grey" }}
                                                    id="jobdeskcek"
                                                    checked={jobdeskCek}
                                                    onChange={handleCheckboxChangeJobdesk}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="jobdeskcek"
                                                    style={{ fontFamily: "initial", fontSize: 17, color: "black" }}>
                                                    Jobdesk
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }

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