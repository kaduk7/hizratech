/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import { BeritaTb, KaryawanTb } from "@prisma/client";

function Komentar({ berita, karyawan }: { berita: BeritaTb, karyawan: KaryawanTb }) {
    const [beritaId, setBeritaId] = useState(berita.id)
    const [karyawanId, setKaryawanId] = useState('')
    const [divisiadmin, setDivisiAdmin] = useState('')
    const [dataKaryawan, setDataKaryawan] = useState([])
    const [dataKomentarBerita, setDataKomentarBerita] = useState([])
    const [previewAvatar, setPreviewAvatar] = useState(karyawan?.foto)
    const [previewAvatarUser, setPreviewAvatarUser] = useState('')
    const [preview, setPreview] = useState(berita?.foto)
    const [namaKaryawan, setNamaKaryawan] = useState(karyawan.nama)
    const [tanggaldibuat, setTanggaldibuat] = useState(berita.createdAt)
    const [judul, setJudul] = useState(berita.judul)
    const [isi, setIsi] = useState(berita.isi)
    const [komentar, setKomentar] = useState('');

    const [currentTime, setCurrentTime] = useState(new Date());

    const router = useRouter()
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchDataTOKEN()
        fetchDataKomentarberita()
    }, [dataKomentarBerita])

    const fetchDataTOKEN = async () => {
        try {
            const response = await axios.get(`/admin/api/tokenkaryawan`);
            const result = await response.data;
            setDataKaryawan(result)
            setKaryawanId(result.id)
            setDivisiAdmin(result.DivisiTb.nama)
            setPreviewAvatarUser(result?.foto)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchDataKomentarberita = async () => {
        try {
            const response = await fetch(`/admin/api/komentar/${berita.id}`);
            const result = await response.json();
            setDataKomentarBerita(result)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (event: any) => {
        setKomentar(event.target.value);
    };

    const calculateRows = () => {
        const lineBreaks = (komentar.match(/\n/g) || []).length;
        // Set minimal rows to 1
        return Math.max(lineBreaks + 1, 1);
    };

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setShow(false);
    }

    const clearform = () => {
        setKomentar('')
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('isi', komentar)
            formData.append('beritaId', String(beritaId))
            formData.append('karyawanId', String(karyawanId))

            const xxx = await axios.post(`/admin/api/komentar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (xxx.data.pesan == 'berhasil') {
                clearform()
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const KalkulasiWaktu = (newsTime: any) => {
        const timeDifference = currentTime.getTime() - new Date(newsTime).getTime();
        const Hari = Math.floor(timeDifference / (24 * 1000 * 60 * 60));
        const Jam = Math.floor(timeDifference / (1000 * 60 * 60));
        const Menit = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const Detik = Math.floor((timeDifference % (1000 * 60)) / 1000);

        if (Hari <= 0 && Jam <= 0 && Menit <= 0) {
            return ` Baru saja`;
        }
        if (Hari <= 0 && Jam <= 0) {
            return ` ${Menit} menit yang lalu`;
        }
        if (Hari <= 0 && Jam > 0) {
            return ` ${Jam} jam yang lalu`;
        }
        if (Hari > 0 && Hari <= 30) {
            return `${Hari} hari yang lalu`;
        }

        if (Hari > 30 && Hari <= 360) {
            const bulan = Math.floor(timeDifference / (24 * 1000 * 60 * 60) / 30);
            return `${bulan} bulan yang lalu`;
        }

        if (Hari > 360) {
            const tahun = Math.floor(timeDifference / (24 * 1000 * 60 * 60) / 360);
            return `${tahun} tahun yang lalu`;
        }
    };




    return (
        <div>
            <label className="me-3">
                <a type="button" onClick={handleShow}>
                    <i className="fa-regular fa-message me-2" />
                    Comment
                </a>
            </label>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ textAlign: 'center', fontFamily: "initial", fontSize: 30, color: "black" }}>Post Berita</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <div>
                            <div className="col-xl-12" >
                                <div className="card">
                                    <div className="card-header border-0">
                                        <div className="products">
                                            <img
                                                src={`https://mxvdfimkvwoeqxlkycai.supabase.co/storage/v1/object/public/uploadfile/foto-profil/${previewAvatar}`}
                                                className="avatar avatar-md rounded-circle"
                                                alt=""
                                            />
                                            <div>
                                                <h5 className="mb-0">
                                                    <a href="#" className="text-black" style={{ fontSize: 17 }}>
                                                        <u> {namaKaryawan}</u>
                                                    </a>
                                                </h5>
                                                <span>{KalkulasiWaktu(tanggaldibuat)}</span>
                                            </div>
                                        </div>

                                        <div className="dropdown custom-dropdown ">
                                            <div
                                                className="btn sharp btn-primary light tp-btn  ms-3"
                                                data-bs-toggle="dropdown"
                                            >
                                                <svg
                                                    width={15}
                                                    height={15}
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13.5202 17.4167C13.5202 18.81 12.3927 19.9375 10.9994 19.9375C9.60601 19.9375 8.47852 18.81 8.47852 17.4167C8.47852 16.0233 9.60601 14.8958 10.9994 14.8958C12.3927 14.8958 13.5202 16.0233 13.5202 17.4167ZM9.85352 17.4167C9.85352 18.0492 10.3669 18.5625 10.9994 18.5625C11.6319 18.5625 12.1452 18.0492 12.1452 17.4167C12.1452 16.7842 11.6319 16.2708 10.9994 16.2708C10.3669 16.2708 9.85352 16.7842 9.85352 17.4167Z"
                                                        fill="#2696FD"
                                                    />
                                                    <path
                                                        d="M13.5202 4.58369C13.5202 5.97699 12.3927 7.10449 10.9994 7.10449C9.60601 7.10449 8.47852 5.97699 8.47852 4.58369C8.47852 3.19029 9.60601 2.06279 10.9994 2.06279C12.3927 2.06279 13.5202 3.19029 13.5202 4.58369ZM9.85352 4.58369C9.85352 5.21619 10.3669 5.72949 10.9994 5.72949C11.6319 5.72949 12.1452 5.21619 12.1452 4.58369C12.1452 3.95119 11.6319 3.43779 10.9994 3.43779C10.3669 3.43779 9.85352 3.95119 9.85352 4.58369Z"
                                                        fill="#2696FD"
                                                    />
                                                    <path
                                                        d="M13.5202 10.9997C13.5202 12.393 12.3927 13.5205 10.9994 13.5205C9.60601 13.5205 8.47852 12.393 8.47852 10.9997C8.47852 9.6063 9.60601 8.4788 10.9994 8.4788C12.3927 8.4788 13.5202 9.6063 13.5202 10.9997ZM9.85352 10.9997C9.85352 11.6322 10.3669 12.1455 10.9994 12.1455C11.6319 12.1455 12.1452 11.6322 12.1452 10.9997C12.1452 10.3672 11.6319 9.8538 10.9994 9.8538C10.3669 9.8538 9.85352 10.3672 9.85352 10.9997Z"
                                                        fill="#2696FD"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a className="dropdown-item" >
                                                    Option 1
                                                </a>
                                                <a className="dropdown-item" >
                                                    Option 2
                                                </a>
                                                <a className="dropdown-item" >
                                                    Option 3
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="card-body pt-0">
                                        <div className="post-img">
                                            <img src={`https://mxvdfimkvwoeqxlkycai.supabase.co/storage/v1/object/public/uploadfile/berita-images/${preview}`} alt="" />
                                        </div>
                                        <div className="post-see d-flex align-items-center mt-3">
                                            <div className="avatar-list avatar-list-stacked">

                                            </div>
                                            <a className="mb-0 ms-3"><h2>{judul}</h2></a>
                                        </div>
                                        <div className="mt-3 ms-3">
                                            <div className='col'>
                                                <a>
                                                    <span style={{ fontSize: 15 }} className={''} dangerouslySetInnerHTML={{ __html: isi }} />
                                                </a>
                                            </div>

                                        </div>

                                        <ul className="post-comment d-flex mt-3">
                                            <li>
                                                <label className="me-3">
                                                    <a href="">
                                                        <i className="fa-regular fa-heart me-2" />
                                                        Like
                                                    </a>
                                                </label>
                                            </li>
                                            <li>
                                                {/* <Komentar berita={x} /> */}
                                            </li>
                                            <li>
                                                <label className="me-3">
                                                    <a href="">
                                                        <i className="fa-solid fa-share me-2" />
                                                        Share
                                                    </a>
                                                </label>{" "}
                                            </li>
                                        </ul>

                                    </div>


                                </div>

                                {dataKomentarBerita.map((x: any, index) => (
                                    <div className="blog-post" key={x.id}>
                                        <div className="post-1">
                                            <img src={`https://mxvdfimkvwoeqxlkycai.supabase.co/storage/v1/object/public/uploadfile/foto-profil/${x.KaryawanTb.foto}`} className="avatar rounded-circle me-2 custome-avatar" alt="" />
                                            <div className="post-data">
                                                <span className="badge badge-secondary light border-0 badge-sm">{x.KaryawanTb.nama}</span>
                                                <h4 dangerouslySetInnerHTML={{ __html: x.isi }}></h4>
                                                <div>
                                                    <span>{KalkulasiWaktu(x.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                ))}

                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ justifyContent: 'flex-start' }}>
                        <div className="col-xl-12" >
                            <form onSubmit={handleSubmit}>
                                <div className="input-group mb-3  input-info">
                                    <span className=" mx-2">
                                        <img
                                            src={`https://mxvdfimkvwoeqxlkycai.supabase.co/storage/v1/object/public/uploadfile/foto-profil/${previewAvatarUser}`}
                                            className="avatar avatar-md rounded-circle"
                                            alt=""
                                        />
                                    </span>
                                    <textarea
                                        autoFocus
                                        value={komentar}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Tulis Komentar..."
                                        rows={calculateRows()}
                                        style={{
                                            overflowY: 'scroll',
                                        }}
                                    />
                                    <a type="submit" onClick={handleSubmit} className="input-group-text border-0">
                                        <svg className="ms-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.555 5.44976L6.73936 9.30612L2.39962 6.59178C1.77783 6.20276 1.90718 5.25829 2.61048 5.05262L12.9142 2.03518C13.5582 1.84642 14.155 2.44855 13.9637 3.09466L10.9154 13.3912C10.7066 14.0955 9.76747 14.2213 9.38214 13.5968L6.73734 9.3068" stroke="#000" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </a>
                                </div>
                            </form>
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>


    )
}

export default Komentar