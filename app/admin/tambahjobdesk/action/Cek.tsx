/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect, useRef } from "react"
import { JobdeskTb, KaryawanTb } from "@prisma/client"
import Modal from 'react-bootstrap/Modal';
import moment from "moment"
import { supabaseUrl, supabaseBUCKET } from "@/app/helper";

function Cek({ jobdesk, findkaryawan }: { jobdesk: JobdeskTb, findkaryawan: KaryawanTb }) {

    const [namakaryawan, setNamakaryawan] = useState(findkaryawan.nama)
    const [namaJob, setNamajob] = useState(jobdesk.namaJob)
    const [tanggalMulai, setTanggalMulai] = useState(moment(jobdesk.tanggalMulai).format("DD-MM-YYYY"))
    const [deadline, setDeadline] = useState(moment(jobdesk.deadline).format("DD-MM-YYYY"))
    const [keterangan, setKeterangan] = useState(jobdesk.keterangan)
    const [status, setStatus] = useState(jobdesk.status)
    const [alasan, setAlasan] = useState(jobdesk?.alasan)
    const [tanggalkerjaValue, setTanggalkerjaValue] = useState(moment(jobdesk?.tanggalPelaksanaan).format("DD-MM-YYYY"))
    const [fileValue, setFileValue] = useState(jobdesk?.file)
    const [fileSuratTugasValue, setFileSuratTugasValue] = useState('')
    const [fileBeritaAcaraValue, setFileBeritaAcaraValue] = useState('')
    const [fileAnggaranValue, setFileAnggaranValue] = useState('')
    const [namateam, setNamateam] = useState('');
    const [keteranganAkhirValue, setKeteranganAkhirValue] = useState(jobdesk?.keteranganAkhir)
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = () => {
        setShow(true),
            refreshform()
    }

    const refreshform = () => {
        setFileSuratTugasValue(jobdesk.suratTugas)
        setFileBeritaAcaraValue(jobdesk.beritaAcara)
        setFileAnggaranValue(jobdesk.laporanAnggaran)
        setTanggalkerjaValue(moment(jobdesk?.tanggalPelaksanaan).format("DD-MM-YYYY"))
        setFileValue(jobdesk?.file)
        setStatus(jobdesk.status)
        setKeteranganAkhirValue(jobdesk?.keteranganAkhir)
    }

    useEffect(() => {
        tampilTeam();
    }, [])

    const tampilTeam = async () => {
        const namaTeam = jobdesk.namaTeam
        const dataNamaTeam = JSON.parse(namaTeam);
        const labelArray = dataNamaTeam.map((item: any) => item.label);
        setNamateam(labelArray.join(', '))
    }

    return (
        <>
            <span onClick={handleShow} className="btn btn-info shadow btn-xl sharp mx-1"><i className="fa fa-eye"></i></span>
            <Modal
                dialogClassName="modal-lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}> Data Tugas</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama Karyawan </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {namakaryawan}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Team </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {namateam}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Nama Tugas </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {namaJob}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Deskripsi </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {keterangan}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Tanggal Mulai </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {tanggalMulai}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Deadline </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                {deadline}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Status </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            {status === "Tolak" ?

                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "red" }}>
                                    {status}
                                </div>
                                :
                                status === "Proses" ?
                                    <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "blue" }}>
                                        {status}
                                    </div>
                                    :
                                    status === "Dalam Proses" ?
                                        <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "blue" }}>
                                            {status}
                                        </div>
                                        :
                                        status === "Selesai" ?
                                            <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "green" }}>
                                                {status}
                                            </div>
                                            :
                                            status === "Dalam Proses" ?
                                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "purple" }}>
                                                    {status}
                                                </div>
                                                :
                                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "yellow" }}>
                                                    {status}
                                                </div>
                            }
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Surat Tugas </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <u className="col-sm-7" >
                                <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/file/${fileSuratTugasValue}`} target="_blank" style={{ fontFamily: "initial", fontSize: 20, color: "red" }}>Download</a>
                            </u>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Berita Acara </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <u className="col-sm-7" >
                                <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/file/${fileBeritaAcaraValue}`} target="_blank" style={{ fontFamily: "initial", fontSize: 20, color: "red" }}>Download</a>
                            </u>
                        </div>

                        <div className="mb-3 row">
                            <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Laporan Anggaran </div>
                            <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                            <u className="col-sm-7" >
                                <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/file/${fileAnggaranValue}`} target="_blank" style={{ fontFamily: "initial", fontSize: 20, color: "red" }}>Download</a>
                            </u>
                        </div>

                        {jobdesk.status === "Tolak" ?
                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Alasan </div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                    {alasan}
                                </div>
                            </div>
                            :
                            null
                        }

                        {jobdesk.status === "Selesai" ?
                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Tanggal Pelaksanaan </div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                    {tanggalkerjaValue}
                                </div>
                            </div>
                            :
                            null
                        }

                        {jobdesk.status === "Selesai" ?
                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>File Kegiatan</div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <u className="col-sm-7" >
                                    <a href={`${supabaseUrl}/storage/v1/object/public/${supabaseBUCKET}/file/${fileValue}`} target="_blank" style={{ fontFamily: "initial", fontSize: 20, color: "red" }}>Klik Disini</a>
                                </u>
                            </div>
                            :
                            null
                        }

                        {jobdesk.status === "Selesai" ?
                            <div className="mb-3 row">
                                <div className="col-sm-4" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>Keterangan Akhir</div>
                                <div className="col-sm-1" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>:</div>
                                <div className="col-sm-7" style={{ fontFamily: "initial", fontSize: 20, color: "black" }}>
                                    {/* <div dangerouslySetInnerHTML={{ __html: keteranganAkhirValu
                                    e }}></div>
                                     */}
                                    <div dangerouslySetInnerHTML={{ __html: keteranganAkhirValue || '' }}></div>
                                </div>
                            </div>
                            :
                            null
                        }

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