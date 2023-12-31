"use client"
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import Swal from 'sweetalert2'
import AvatarEditor from 'react-avatar-editor';
import Modal from 'react-bootstrap/Modal';
import { supabase, supabaseUrl, supabaseBUCKET } from '@/app/helper'

const Profil = () => {
    const [dataKaryawan, setDatakaryawan] = useState([{}])
    const [karyawanId, setKaryawanId] = useState('')
    const [namaAvatar, setNamaAvatar] = useState('')
    const [nama, setNama] = useState('')
    const [alamat, setAlamat] = useState("")
    const [tempatLahir, setTempatLahir] = useState("")
    const [tanggalLahir, setTanggalLahir] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [hp, setHp] = useState("")
    const [namaDivisi, setNamadivisi] = useState("")
    const [fotolama, setFotoLama] = useState("")
    const [preview, setPreview] = useState("")
    const [file, setFile] = useState<File | null>()

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setShow(false);
        clearForm()
    }

    async function clearForm() {
        const response = await axios.get(`/admin/api/profil`);
        const data = response.data;
        setFile(null)
        setPreview(data?.foto)
    }

    const handleCrop = () => {
        if (editor) {
            const canvas = editor.getImage();
            canvas.toBlob((blob: any) => {
                setFile(blob)
            });
            const canvasScaled = editor.getImageScaledToCanvas();
            const croppedData = canvasScaled.toDataURL();
            setPreview(croppedData)
            setShow(false)
        }
    };

    let editor: AvatarEditor | null;

    const handleFileChange = (e: any) => {
        const selectedImage = e.target.files[0];
        setFile(selectedImage);
        const objectUrl = URL.createObjectURL(selectedImage)
        setPreview(objectUrl)
        handleShow()
    };

    useEffect(() => {
        fetchDataprofil()
    }, [])

    const fetchDataprofil = async () => {
        try {
            const response = await axios.get(`/admin/api/profil`);
            const result = await response.data;
            setKaryawanId(result.id)
            setNama(result.nama);
            setNamaAvatar(result.nama);
            setTanggalLahir(moment(result.tanggalLahir).format('YYYY-MM-DD'));
            setTempatLahir(result.tempatLahir);
            setAlamat(result.alamat);
            setHp(result.hp);
            setEmail(result.email);
            setNamadivisi(result.DivisiTb.nama)
            setFotoLama(result?.foto)
            setPreview(result?.foto)
            setDatakaryawan(result)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault()
        const newfoto = preview === fotolama ? 'no' : 'yes'
        try {
            const formData = new FormData()
            formData.append('nama', nama)
            formData.append('tempatlahir', tempatLahir)
            formData.append('tanggallahir', new Date(tanggalLahir).toISOString())
            formData.append('alamat', alamat)
            formData.append('hp', hp)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('newfoto', newfoto)
            formData.append('file', file as File)

            if (newfoto === 'yes') {

                await supabase.storage
                    .from(supabaseBUCKET)
                    .remove([`foto-profil/${fotolama}`]);

                const foto = formData.get('file') as File;
                const namaunik = nama + '-' + Date.now() + '-' + foto.name

                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`foto-profil/${namaunik}`, foto);

                formData.append('namaunik', namaunik)
                setFotoLama(namaunik)
            }

            const xxx = await axios.patch(`/admin/api/profil/${karyawanId}`, formData, {
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
                hapuspass()
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Berhasil diubah',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const hapuspass = () => {
        setPassword('')
    }

    return (
        <div className="row">
            <div className="col-xl-3 col-lg-4">
                <div className="clearfix">
                    <div className="card card-bx profile-card author-profile m-b30">
                        <div className="card-body">
                            <div className="p-5">
                                <div className="author-profile">
                                    <div className="author-media">
                                        {file ? <img src={preview} width={200} className="mb-3 " alt="Responsive image" /> : <img src={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/foto-profil/${preview}`} alt={""} className="mb-3 " width={200} height={200} />}
                                        <div
                                            className="upload-link"
                                            title=""
                                            data-toggle="tooltip"
                                            data-placement="right"
                                            data-original-title="update"
                                        >
                                            <input type="file" className="update-flie" accept="image/png, image/jpeg" onChange={handleFileChange} />
                                            <i className="fa fa-camera" />
                                        </div>
                                    </div>


                                    <div className="author-info">
                                        <h6 className="title">{namaAvatar}</h6>
                                        <span>{namaDivisi}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-list">
                                <ul>
                                    <li>
                                        <a href="app-profile-2.html">Models</a>
                                        <span>36</span>
                                    </li>
                                    <li>
                                        <a href="uc-lightgallery.html">Gallery</a>
                                        <span>3</span>
                                    </li>
                                    <li>
                                        <a href="app-profile-1.html">Lessons</a>
                                        <span>1</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-footer">
                            {/* <div className="input-group mb-3">
                                <div className="form-control rounded text-center bg-white">
                                    Portfolio
                                </div>
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-9 col-lg-8">
                <div className="card profile-card card-bx m-b30">
                    <div className="card-header">
                        <h6 className="card-title">Setting Akun</h6>
                    </div>
                    <form className="profile-form" onSubmit={handleUpdate}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-12 m-b30">
                                    <label className="form-label">Nama</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        value={nama} onChange={(e) => setNama(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6 m-b30">
                                    <label className="form-label">Tempat Lahir</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6 m-b30">
                                    <label className="form-label">Tanggal Lahir</label>
                                    <input
                                        required
                                        type="date"
                                        className="form-control"
                                        value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-12 m-b30">
                                    <label className="form-label">Alamat</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="form-control"
                                        value={alamat} onChange={(e) => setAlamat(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6 m-b30">
                                    <label className="form-label">No Hp</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        value={hp} onChange={(e) => setHp(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6 m-b30">
                                    <label className="form-label">Email</label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="col-sm-6 m-b30">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>


                            </div>
                            <div className="card-footer">
                                <button type='submit' className="btn btn-primary light light">UPDATE</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <Modal
                dialogClassName="modal-s"
                show={show}
                onHide={handleClose}
                backdrop="static"

                keyboard={false}>


                <Modal.Header closeButton>
                    {/* <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Tambah Data Divisi</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    {file && (
                        <div>
                            <div>
                                <AvatarEditor
                                    ref={(ref) => (editor = ref)}
                                    image={file}
                                    width={200}
                                    height={200}
                                    border={50}
                                    color={[255, 255, 255, 0.6]}
                                />
                            </div>
                            <span onClick={handleCrop} className="btn btn-primary shadow btn-xl sharp mt-0">Selesai <i className="fa fa-check"> </i></span>
                        </div>
                    )}

                </Modal.Body>


            </Modal>
        </div>

    )
}

export default Profil