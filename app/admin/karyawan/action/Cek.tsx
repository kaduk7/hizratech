/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import { DivisiTb, HakAksesTb, KaryawanTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import { useSession } from "next-auth/react"
import { supabase, supabaseUrl, supabaseBUCKET } from '@/app/helper'

function Cek({ karyawan, hakAkses, caridivisi }: { karyawan: KaryawanTb, hakAkses: HakAksesTb, caridivisi: DivisiTb }) {
    const session = useSession()
    const [nama, setNama] = useState(karyawan.nama)
    const [tempatLahir, setTempatlahir] = useState(karyawan?.tempatLahir || "")
    const [tanggalLahir, setTanggallahir] = useState(moment(karyawan?.tanggalLahir).format("DD-MM-YYYY"))
    const [alamat, setAlamat] = useState(karyawan?.alamat || "")
    const [hp, setHp] = useState(karyawan.hp)
    const [preview, setPreview] = useState(karyawan?.foto)
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState(karyawan.email)
    const [divisiId, setDivisiId] = useState(String(karyawan.divisiId))
    const [namadivisi, setNamadivisi] = useState(caridivisi.nama)
    const [selectdivisi, setSelectdivisi] = useState([])

    const [karyawanCek, setKaryawanCek] = useState(false)
    const [informasiCek, setInformasiCek] = useState(false)
    const [jobdeskCek, setJobdeskCek] = useState(false)
    const [karyawanCekValue, setKaryawanCekValue] = useState(hakAkses.datakaryawan)
    const [informasiCekValue, setInformasiCekValue] = useState(hakAkses.informasi)
    const [jobdeskCekValue, setJobdeskCekValue] = useState(hakAkses.jobdesk)
    const [st, setSt] = useState(false);
    const router = useRouter()
    const [show, setShow] = useState(false)

    const [ktplama, setKtpLama] = useState(karyawan?.ktp)
    const [cvlama, setCvLama] = useState(karyawan?.CV)
    const [ijazahlama, setIjazahLama] = useState(karyawan?.ijazah)

    const handleClose = () => {
        setShow(false);
        refreshform()
        hakAksesceklis()
    }

    const handleShow = () => {
        setShow(true);
    }

    useEffect(() => {
        divisi();
        hakAksesceklis()
    }, [])

    const hakAksesceklis = () => {
        if (hakAkses.datakaryawan === "Ya") {
            setKaryawanCek(true)
        }

        if (hakAkses.informasi === "Ya") {
            setInformasiCek(true)
        }
        if (hakAkses.jobdesk === "Ya") {
            setJobdeskCek(true)
        }
    }

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
    }

    const refreshform = () => {
        setNama(karyawan.nama)
        setTempatlahir(karyawan?.tempatLahir || '')
        setTanggallahir(moment(karyawan?.tanggalLahir).format("YYYY-MM-DD"))
        setAlamat(karyawan?.alamat || '')
        setHp(karyawan.hp)
        setEmail(karyawan.email)
        setDivisiId(String(karyawan.divisiId))
        setNamadivisi(caridivisi.nama)
        setPassword('')
    }

    const hapuspass = () => {
        setPassword('')
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault()
        const newpass = password == "" ? 'no' : 'yes'
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('tempatlahir', tempatLahir)
            formData.append('tanggallahir', new Date(tanggalLahir).toISOString())
            formData.append('alamat', alamat)
            formData.append('hp', hp)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('newpass', newpass)
            formData.append('divisiId', divisiId)
            formData.append('namadivisi', namadivisi)
            formData.append('karyawanCekValue', karyawanCekValue)
            formData.append('informasiCekValue', informasiCekValue)
            formData.append('jobdeskCekValue', jobdeskCekValue)

            const xxx = await axios.patch(`/admin/api/karyawan/${karyawan.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'sudah ada email') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Email ini sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })
            }

            if (xxx.data.pesan == 'sudah ada hp') {
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: 'No Hp ini sudah terdaftar',
                    showConfirmButton: false,
                    timer: 1500
                })

            }
            if (xxx.data.pesan == 'berhasil') {
                setShow(false);
                hapuspass()
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
        <>
            <span onClick={handleShow} className="btn btn-info shadow btn-xl sharp mx-1"><i className="fa fa-eye"></i></span>
            <Modal
                dialogClassName="modal-xl"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Data Karyawan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row">
                            <div className="col-xl-3 col-lg-4">
                                <div className="clearfix">
                                    <div className="card card-bx profile-card author-profile m-b30">
                                        <div className="card-body">
                                            <div className="p-5">
                                                <div className="author-profile">
                                                    <div className="author-media">
                                                        {<img src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${preview}`} alt={""} className="mb-3 " width={200} height={200} />}
                                                    </div>

                                                    <div className="author-info">
                                                        <h6 className="title">{nama}</h6>
                                                        <span>{namadivisi}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="info-list">
                                                <ul>
                                                    <li >
                                                        <a >Scan KTP</a>
                                                        <div className='col-30'>
                                                            <a className="btn btn-primary" href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${ktplama}`} target="_blank">
                                                                Download
                                                            </a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <a  >Resume CV</a>
                                                        <div className='col-30'>
                                                            <a className="btn btn-primary" href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${cvlama}`} target="_blank">
                                                                Download
                                                            </a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <a  >Scan Ijazah</a>
                                                        <div className='col-30'>
                                                            <a className="btn btn-primary" href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${ijazahlama}`} target="_blank">
                                                                Download
                                                            </a>
                                                        </div>
                                                    </li>

                                                </ul>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-9 col-lg-8">
                                <div className="card profile-card card-bx m-b30">
                                    {/* <div className="card-header">
                                        <h6 className="card-title">Data Karyawan</h6>
                                    </div> */}
                                    <form className="profile-form" onSubmit={handleUpdate}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-12 m-b30">
                                                    <label className="form-label">Nama</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="form-control"
                                                        value={nama}
                                                    />
                                                </div>
                                                <div className="col-sm-6 m-b30">
                                                    <label className="form-label">Tempat Lahir</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="form-control"
                                                        value={tempatLahir}
                                                    />
                                                </div>
                                                <div className="col-sm-6 m-b30">
                                                    <label className="form-label">Tanggal Lahir</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="form-control"
                                                        value={tanggalLahir} 
                                                    />
                                                </div>
                                                <div className="col-sm-12 m-b30">
                                                    <label className="form-label">Alamat</label>
                                                    <textarea
                                                        disabled
                                                        rows={3}
                                                        className="form-control"
                                                        value={alamat}
                                                    />
                                                </div>
                                                <div className="col-sm-6 m-b30">
                                                    <label className="form-label">No Hp</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="form-control"
                                                        value={hp} 
                                                    />
                                                </div>
                                                <div className="col-sm-6 m-b30">
                                                    <label className="form-label">Email</label>
                                                    <input
                                                        disabled
                                                        required
                                                        type="text"
                                                        className="form-control"
                                                        value={email} 
                                                    />
                                                </div>
                                                <div className="col-sm-6 m-b30">
                                                    <label className="form-label">Password</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="form-control"
                                                        value={password}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default Cek