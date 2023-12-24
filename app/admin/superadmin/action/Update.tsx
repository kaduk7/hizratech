/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import { DivisiTb, HakAksesTb, KaryawanTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import { Button } from "primereact/button"
import moment from "moment"
import { useSession } from "next-auth/react"

function Update({ karyawan, hakAkses, caridivisiId }: { karyawan: KaryawanTb, hakAkses: HakAksesTb, caridivisiId: Number }) {
    const session = useSession()
    const [nama, setNama] = useState(karyawan.nama)
    const [tempatLahir, setTempatlahir] = useState(karyawan.tempatLahir)
    const [tanggalLahir, setTanggallahir] = useState(moment(karyawan.tanggalLahir).format("YYYY-MM-DD"))
    const [alamat, setAlamat] = useState(karyawan.alamat)
    const [hp, setHp] = useState(karyawan.hp)
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState(karyawan.email)
    const [divisiId, setDivisiId] = useState(String(karyawan.divisiId))
    const [namadivisi, setNamadivisi] = useState("")
    const [selectdivisi, setSelectdivisi] = useState([])

    const [karyawanCek, setKaryawanCek] = useState(false)
    const [informasiCek, setInformasiCek] = useState(false)
    const [jobdeskCek, setJobdeskCek] = useState(false)
    const [karyawanCekValue, setKaryawanCekValue] = useState("Tidak")
    const [informasiCekValue, setInformasiCekValue] = useState("Tidak")
    const [jobdeskCekValue, setJobdeskCekValue] = useState("Tidak")
    const [st, setSt] = useState(false);
    const router = useRouter()
    const [show, setShow] = useState(false)

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        divisi();
        if (hakAkses.datakaryawan === "Ya") {
            setKaryawanCek(true)
            setKaryawanCekValue("Ya")
        }

        if (hakAkses.informasi === "Ya") {
            setInformasiCek(true)
            setInformasiCekValue("Ya")
        }
        if (hakAkses.jobdesk === "Ya") {
            setJobdeskCek(true)
            setJobdeskCekValue("Ya")
        }
    }, [])

    async function divisi() {
        const response = await axios.get(`/admin/api/divisi`);
        const data = response.data;
        setSelectdivisi(data)
    }

    const onDivisi = async (e: any) => {

        setDivisiId(e.target.value);

        const xxx = await axios.get(`/admin/api/divisi/${e.target.value}`)

        setNamadivisi(xxx.data.nama)
    }

    const refreshform = () => {
        setNama(karyawan.nama)
        setTempatlahir(karyawan.tempatLahir)
        setTanggallahir(moment(karyawan.tanggalLahir).format("YYYY-MM-DD"))
        setAlamat(karyawan.alamat)
        setHp(karyawan.hp)
        setEmail(karyawan.email)
        setDivisiId(String(karyawan.divisiId))
        setNamadivisi('')
        setPassword('')
    }

    const hapuspass = () => {
        setNamadivisi('')
        setPassword('')
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault()
        const newemail = email === karyawan.email ? 'no' : 'yes'
        const newhp = hp === karyawan.hp ? 'no' : 'yes'

        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('tempatlahir', tempatLahir)
            formData.append('tanggallahir', new Date(tanggalLahir).toISOString())
            formData.append('alamat', alamat)
            formData.append('hp', hp)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('newemail', newemail)
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
        setKaryawanCek(!karyawanCek); // Mengubah nilai isChecked menjadi kebalikannya
        if (!karyawanCek) {
            setKaryawanCekValue("Ya")
        }
        else {
            setKaryawanCekValue("Tidak")
        }
    };

    const handleCheckboxChangeinformasi = () => {
        setInformasiCek(!informasiCek); // Mengubah nilai isChecked menjadi kebalikannya
        if (!informasiCek) {
            setInformasiCekValue("Ya")
        }
        else {
            setInformasiCekValue("Tidak")
        }
    };

    const handleCheckboxChangeJobdesk = () => {
        setJobdeskCek(!jobdeskCek); // Mengubah nilai isChecked menjadi kebalikannya
        if (!jobdeskCek) {
            setJobdeskCekValue("Ya")
        }
        else {
            setJobdeskCekValue("Tidak")
        }
    };

    return (
        <>
            <Button icon="fa fa-edit" rounded severity="success" className="mr-2" onClick={handleShow} />
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "monospace", fontSize: 30, color: "black" }}>Edit Data Karyawan</Modal.Title>
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
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Tempat Lahir</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={tempatLahir} onChange={(e) => setTempatlahir(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Tanggal Lahir</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={tanggalLahir} onChange={(e) => setTanggallahir(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Alamat</label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={alamat} onChange={(e) => setAlamat(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>No Hp</label>
                                <input
                                    required
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
                                        <option key={i} value={item.id} >{item.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Email</label>
                                <input
                                    required
                                    type="email"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Password</label>
                                <div className="input-group">
                                    <input

                                        type={st ? "text" : "password"}
                                        className="form-control"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                        style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {st ?
                                        <button onClick={() => setSt(!st)} className="btn btn-success" type="button">
                                            <i className="mdi mdi-eye-off" />
                                        </button>
                                        :
                                        <button onClick={() => setSt(!st)} className="btn btn-success" type="button">
                                            <i className="mdi mdi-eye" />
                                        </button>
                                    }
                                </div>
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
                                            <div className="form-check custom-checkbox mb-3 checkbox-info">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
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
                                            <div className="form-check custom-checkbox mb-3 checkbox-success">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
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
        </>
    )
}

export default Update