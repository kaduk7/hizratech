/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import Select from 'react-select';
import { supabase, supabaseBUCKET, supabaseUrl, StyleSelect } from "@/app/helper";

function Add({ reload }: { reload: Function }) {
    const [namaJob, setNamajob] = useState("")
    const [tanggalMulai, setTanggalMulai] = useState("")
    const [deadline, setDeadline] = useState("")
    const [keterangan, setKeterangan] = useState("")
    const [status, setStatus] = useState("")
    const [rincian, setRincian] = useState("Ya")
    const [divisiId, setDivisiId] = useState("")
    const [karyawanId, setKaryawanId] = useState("")
    const [selectdivisi, setSelectdivisi] = useState([])
    const [selectkaryawan, setSelectkaryawan] = useState([])
    const [fileSuratTugas, setFileSurattugas] = useState<File | null>()
    const [fileBeritaAcara, setFileBeritaacara] = useState<File | null>()
    const [fileAnggaran, setFileAnggaran] = useState<File | null>()
    const router = useRouter()
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const [team, setTeam] = useState<string[]>([]);
    const [namaterpilih, setNamaterpilih] = useState('');
    const [dataKaryawan, setDataKaryawan] = useState([])

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

    const handleSelectChange = (selectedOptions: any) => {
        setTeam(selectedOptions.map((option: any) => option.value));
        const terpilih = JSON.stringify(selectedOptions)
        setNamaterpilih(terpilih)
    };

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

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
        setDivisiId(e.target.value)
        const xxx = await axios.get(`/admin/api/karyawan/${e.target.value}`)
        setSelectkaryawan(xxx.data)
    }

    const onKaryawan = async (e: any) => {
        setKaryawanId(e.target.value);
        const response = await axios.get(`/admin/api/notkaryawan/${e.target.value}`);
        const data = response.data;
        const options = data.map((item: any) => ({
            value: item.id,
            label: item.nama,
        }));
        setDataKaryawan(options)
    }

    function clearForm() {
        setNamajob('')
        setTanggalMulai('')
        setDeadline('')
        setKeterangan('')
        setStatus('')
        setKaryawanId('')
        setDivisiId('')
        setSelectkaryawan([])
        setTeam([])
        setNamaterpilih('')
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsLoading(true)

        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('namaJob', namaJob)
            formData.append('keterangan', keterangan)
            formData.append('status', status)
            formData.append('rincian', rincian)
            formData.append('tanggalMulai', new Date(tanggalMulai).toISOString())
            formData.append('deadline', new Date(deadline).toISOString())
            formData.append('karyawanId', karyawanId)
            formData.append('team', String(team))
            formData.append('namaterpilih', namaterpilih)
            formData.append('fileSuratTugas', fileSuratTugas as File)
            formData.append('fileBeritaAcara', fileBeritaAcara as File)
            formData.append('fileAnggaran', fileAnggaran as File)

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

            const xxx = await axios.post(`/admin/api/tambahjobdesk`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setTimeout(function () {

                if (xxx.data.pesan == 'berhasil') {
                    handleClose();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Berhasil Simpan',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    clearForm();
                    reload()
                    setIsLoading(false)

                }
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <div>
            <button onClick={handleShow} type="button" className="btn btn-success btn-icon-text">
                <i className=""></i>Buat Tugas</button>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Tambah Data Tugas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Pilih Karyawan</label>
                                <div className="row">
                                    <div className="col-md-6">
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
                                    <div className="col-md-6">
                                        <select
                                            required
                                            style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                            className="form-control"
                                            value={karyawanId} onChange={onKaryawan}>
                                            <option value={''}> Pilih Karyawan</option>
                                            {selectkaryawan?.map((item: any, i) => (
                                                <option key={i} value={item.id} >{item.nama}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {karyawanId !== '' ?
                            <div className="row">
                                <div className="mb-3 col-md-12">
                                    <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Team</label>
                                    <Select
                                        required
                                        isMulti
                                        options={dataKaryawan}
                                        value={dataKaryawan.filter((option: any) => team.includes(option.value))}
                                        onChange={handleSelectChange}
                                        styles={StyleSelect}
                                    />
                                </div>
                            </div> :
                            null
                        }


                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Nama Tugas</label>
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
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Deskripsi</label>
                                <textarea
                                    required
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={keterangan} onChange={(e) => setKeterangan(e.target.value)}
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

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Status</label>
                                <select
                                    required
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    className="form-control"
                                    value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value={''}></option>
                                    <option value={'Proses'}>Proses</option>
                                    <option value={'Verifikasi'}>Verifikasi</option>

                                </select>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Rincian</label>
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <div className="form-check ">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="customRadioBox1"
                                                name="optradioCustom"
                                                value={rincian}
                                                checked={rincian === 'Ya'}
                                                onChange={() => setRincian('Ya')}
                                            />
                                            <label className="form-check-label" htmlFor="customRadioBox1">
                                                Ya
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-3 col-md-6">
                                        <div className="form-check ">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="customRadioBox2"
                                                name="optradioCustom"
                                                value={rincian}
                                                checked={rincian === 'Tidak'}
                                                onChange={() => setRincian('Tidak')}

                                            />
                                            <label className="form-check-label" htmlFor="customRadioBox2">
                                                Tidak
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
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

                            <div className="mb-3 col-md-6">
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
                            <div className="mb-3 col-md-6">
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
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                        <button type="submit" className="btn btn-primary light">Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default Add