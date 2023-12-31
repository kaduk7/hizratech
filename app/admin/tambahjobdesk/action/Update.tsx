/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import { JobdeskTb, KaryawanTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import Select from 'react-select';
import { supabase,supabaseBUCKET,supabaseUrl,StyleSelect } from "@/app/helper"

function Update({ jobdesk, karyawan }: { jobdesk: JobdeskTb, karyawan: KaryawanTb }) {

    const [namaJob, setNamajob] = useState(jobdesk.namaJob)
    const [tanggalMulai, setTanggalMulai] = useState(moment(jobdesk.tanggalMulai).format("YYYY-MM-DD"))
    const [deadline, setDeadline] = useState(moment(jobdesk.deadline).format("YYYY-MM-DD"))
    const [keterangan, setKeterangan] = useState(jobdesk.keterangan)
    const [status, setStatus] = useState(jobdesk.status)
    const [divisiId, setDivisiId] = useState(String(karyawan.divisiId))
    const [karyawanId, setKaryawanId] = useState(String(jobdesk.karyawanId))
    const [selectdivisi, setSelectdivisi] = useState([])
    const [selectkaryawan, setSelectkaryawan] = useState([])
    const [fileSuratTugas, setFileSurattugas] = useState<File | null>()
    const [fileBeritaAcara, setFileBeritaacara] = useState<File | null>()
    const [fileAnggaran, setFileAnggaran] = useState<File | null>()

    const [previewSurat, setPreviewSurat] = useState(jobdesk.suratTugas)
    const [cekpreviewSurat, setCekPreviewSurat] = useState(jobdesk.suratTugas)
    const [previewBerita, setPreviewBerita] = useState(jobdesk.beritaAcara)
    const [cekpreviewBerita, setCekPreviewBerita] = useState(jobdesk.beritaAcara)
    const [previewAnggaran, setPreviewAnggaran] = useState(jobdesk.laporanAnggaran)
    const [cekpreviewAnggaran, setCekPreviewAnggaran] = useState(jobdesk.laporanAnggaran)
    const router = useRouter()
    const [show, setShow] = useState(false);

    const [team, setTeam] = useState<string[]>(["1"]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [namaterpilih, setNamaterpilih] = useState('');

    const [dataKaryawan, setDataKaryawan] = useState([])

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => {
        setShow(true);
        setPreviewSurat(jobdesk.suratTugas)
        setCekPreviewSurat(jobdesk.suratTugas)
        setPreviewBerita(jobdesk.beritaAcara)
        setCekPreviewBerita(jobdesk.beritaAcara)
        setPreviewAnggaran(jobdesk.laporanAnggaran)
        setCekPreviewAnggaran(jobdesk.laporanAnggaran)
    }

    useEffect(() => {
        divisi();
        daftarkaryawan();
        carikaryawan();
        const namaTeam = jobdesk.namaTeam
        const dataNamaTeam = JSON.parse(namaTeam);
        const valuesArray = dataNamaTeam.map((item: any) => item.value);
        setTeam(valuesArray)
        setNamaterpilih(namaTeam)
    }, [])

    async function divisi() {
        const response = await axios.get(`/admin/api/divisi`);
        const data = response.data;
        setSelectdivisi(data)
    }

    async function carikaryawan() {
        const xxx = await axios.get(`/admin/api/karyawan/${karyawan.divisiId}`)
        setSelectkaryawan(xxx.data)
        setKaryawanId(String(jobdesk.karyawanId))
    }

    async function daftarkaryawan() {
        const response = await axios.get(`/admin/api/notkaryawan/${jobdesk.karyawanId}`);
        const data = response.data;
        const options = data.map((item: any) => ({
            value: item.id,
            label: item.nama,
        }));
        setDataKaryawan(options)
    }

    useEffect(() => {
        if (!fileSuratTugas) {
            setPreviewSurat(jobdesk.suratTugas)
            return
        }
        const objectUrlSurat = URL.createObjectURL(fileSuratTugas)
        setPreviewSurat(objectUrlSurat)

        return () => URL.revokeObjectURL(objectUrlSurat)
    }, [fileSuratTugas])

    useEffect(() => {
        if (!fileBeritaAcara) {
            setPreviewBerita(jobdesk.beritaAcara)
            return
        }
        const objectUrlBerita = URL.createObjectURL(fileBeritaAcara)
        setPreviewBerita(objectUrlBerita)

        return () => URL.revokeObjectURL(objectUrlBerita)
    }, [fileBeritaAcara])

    useEffect(() => {
        if (!fileAnggaran) {
            setPreviewAnggaran(jobdesk.laporanAnggaran)
            return
        }
        const objectUrlAnggaran = URL.createObjectURL(fileAnggaran)
        setPreviewAnggaran(objectUrlAnggaran)

        return () => URL.revokeObjectURL(objectUrlAnggaran)
    }, [fileAnggaran])

    useEffect(() => {
        const selectedData = dataKaryawan.filter((option: any) => team.includes(option.value));
        setSelectedOptions(selectedData);
    }, [team, dataKaryawan]);

    const handleSelectChange = (selectedOptions: any) => {
        setTeam(selectedOptions.map((option: any) => option.value));
        const terpilih = JSON.stringify(selectedOptions)
        setNamaterpilih(terpilih)
    };

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

    const refreshform = () => {
        setNamajob(jobdesk.namaJob)
        setKeterangan(jobdesk.keterangan)
        setTanggalMulai(moment(jobdesk.tanggalMulai).format("YYYY-MM-DD"))
        setDeadline(moment(jobdesk.deadline).format("YYYY-MM-DD"))
        setKaryawanId(String(jobdesk.karyawanId))
        setDivisiId(String(karyawan.divisiId))
        const dataNamaTeam = JSON.parse(jobdesk.namaTeam);
        const valuesArray = dataNamaTeam.map((item: any) => item.value);
        setTeam(valuesArray)
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        e.preventDefault()
        const newsurat = previewSurat === cekpreviewSurat ? 'no' : 'yes'
        const newberita = previewBerita === cekpreviewBerita ? 'no' : 'yes'
        const newanggaran = previewAnggaran === cekpreviewAnggaran ? 'no' : 'yes'
        try {
            const formData = new FormData()
            formData.append('namaJob', namaJob)
            formData.append('keterangan', keterangan)
            formData.append('tanggalMulai', new Date(tanggalMulai).toISOString())
            formData.append('deadline', new Date(deadline).toISOString())
            formData.append('karyawanId', karyawanId)
            formData.append('status', status)
            formData.append('divisiId', divisiId)
            formData.append('team', String(team))
            formData.append('namaterpilih', namaterpilih)
            formData.append('newsurat', newsurat)
            formData.append('newberita', newberita)
            formData.append('newanggaran', newanggaran)
            formData.append('fileSuratTugas', fileSuratTugas as File)
            formData.append('fileBeritaAcara', fileBeritaAcara as File)
            formData.append('fileAnggaran', fileAnggaran as File)

            if (newsurat === 'yes') {
                await supabase.storage
                .from(supabaseBUCKET)
                .remove([`file/${jobdesk.suratTugas}`]);

                const fileSuratTugas2 = formData.get('fileSuratTugas') as File;
                const namaunikSurat = Date.now() + '-' + fileSuratTugas2.name
                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`file/${namaunikSurat}`, fileSuratTugas2);
                formData.append('namaunikSurat', namaunikSurat)
            }

            if (newberita=== 'yes') {
                await supabase.storage
                .from(supabaseBUCKET)
                .remove([`file/${jobdesk.beritaAcara}`]);

                const fileBeritaAcara2 = formData.get('fileBeritaAcara') as File;
                const namaunikBerita = Date.now() + '-' + fileBeritaAcara2.name
                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`file/${namaunikBerita}`, fileBeritaAcara2);
                formData.append('namaunikBerita', namaunikBerita)
            }

            if (newanggaran=== 'yes') {
                await supabase.storage
                .from(supabaseBUCKET)
                .remove([`file/${jobdesk.laporanAnggaran}`]);

                const fileAnggaran2 = formData.get('fileAnggaran') as File;
                const namaunikAnggaran = Date.now() + '-' + fileAnggaran2.name
                await supabase.storage
                    .from(supabaseBUCKET)
                    .upload(`file/${namaunikAnggaran}`, fileAnggaran2);
                formData.append('namaunikAnggaran', namaunikAnggaran)
            }

            const xxx = await axios.patch(`/admin/api/tambahjobdesk/${jobdesk.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
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
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Update Data Tugas</Modal.Title>
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
                                        value={selectedOptions}
                                        onChange={handleSelectChange}
                                        styles={StyleSelect}
                                    />
                                </div>
                            </div> :
                            null
                        }


                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Nama Jobdesk</label>
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
                            <div className="mb-3 col-md-4">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Tanggal Mulai</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-4">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Deadline</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={deadline} onChange={(e) => setDeadline(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 col-md-4">
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
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Upload Surat Tugas</label>
                                <input

                                    type="file"
                                    name="file"
                                    className="form-control"
                                    onChange={(e) => setFileSurattugas(e.target.files?.[0])}
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Upload Berita Acara</label>
                                <input

                                    type="file"
                                    name="file"
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

                                    type="file"
                                    name="file"
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
        </>
    )
}

export default Update