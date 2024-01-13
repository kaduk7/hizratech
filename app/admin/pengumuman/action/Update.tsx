/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, SyntheticEvent, useEffect } from "react"
import { DivisiTb, PengumumanTb } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2"
import moment from "moment"
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';
import { StyleSelect } from "@/app/helper"

function Update({ pengumuman }: { pengumuman: PengumumanTb }) {
    const [judul, setJudul] = useState(pengumuman.judul)
    const [tanggalPengumuman, setTanggalPengumuman] = useState(moment(pengumuman.tanggalPengumuman).format("YYYY-MM-DD"))
    const [isi, setIsi] = useState(pengumuman.isi)
    const [pengumumanId, setPengumumanId] = useState(pengumuman.id)

    const [divisiId, setDivisiId] = useState<string[]>([]);
    const [selectdivisiId, setSelectDivisiId] = useState<string[]>([]);
    const [patokan, setPatokan] = useState<string[]>([]);
    const [datadivisi, setDataDivisi] = useState([])
    const [selectedOptions, setSelectedOptions] = useState([]);

    const router = useRouter()
    const [show, setShow] = useState(false)

    const handleClose = () => {
        setShow(false);
        refreshform()
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        divisi();
        mencaridivisi();
    }, [])

    useEffect(() => {
        const selectedData = datadivisi.filter((option: any) => divisiId.includes(option.value));
        setSelectedOptions(selectedData);
    }, [divisiId, datadivisi]);

    async function divisi() {
        const response = await axios.get(`/admin/api/divisi`);
        const data = response.data;
        const options = data.map((item: any) => ({
            value: item.id,
            label: item.nama,
        }));
        setDataDivisi(options)
    }

    const handleSelectChange = (selectedOptions: any) => {
        setDivisiId(selectedOptions.map((option: any) => option.value));
        setSelectDivisiId(selectedOptions)
    };

    async function mencaridivisi() {
        const response = await axios.get(`/admin/api/pengumuman/${pengumuman.id}`);
        const data = response.data;
        const options = data.map((item: any) => ({
            value: item.divisiId,
            label: item.divisiTb.nama,

        }));
        const valuesArray = options.map((item: any) => item.value);
        setDivisiId(valuesArray)
        setSelectDivisiId(options)
        setPatokan(options)
    }

    const refreshform = async () => {
        setJudul(pengumuman.judul)
        setTanggalPengumuman(moment(pengumuman.tanggalPengumuman).format("YYYY-MM-DD"))
        setIsi(pengumuman.isi)
        mencaridivisi()
    }

    const handleEditorChange = (content: any, editor: any) => {
        setIsi(content);;
    }

    const handleUpdate = async (e: SyntheticEvent) => {
        Swal.fire({
            title: "Mohon tunggu!",
            html: "Sedang validasi data",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },

        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
            }
        });

        e.preventDefault()
        const newdivisi = selectdivisiId === patokan ? 'no' : 'yes'
        const formData = new FormData()
        formData.append('judul', judul)
        formData.append('tanggalPengumuman', new Date(tanggalPengumuman).toISOString())
        formData.append('isi', isi)
        formData.append('newdivisi', newdivisi)
        formData.append('pengumumanId', String(pengumumanId))
        formData.append('selected', JSON.stringify(selectedOptions))

        const xxx = await axios.patch(`/admin/api/pengumuman/${pengumuman.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        setTimeout(function () {
            mencaridivisi()
            setShow(false);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Berhasil Simpan',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(function () {

                router.refresh()

            }, 1500);
        }, 1500);
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
                        <Modal.Title style={{ fontFamily: "initial", fontSize: 30, color: "black" }}>Edit Data Pengumuman</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row">
                            <div className="mb-3 col-md-8">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Divisi</label>
                                <Select
                                    required
                                    isMulti
                                    options={datadivisi}
                                    value={selectedOptions}
                                    onChange={handleSelectChange}
                                    styles={StyleSelect}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontWeight: 'bold', backgroundColor: 'white', fontSize: 15, color: "black", borderColor: "grey" }}>Judul</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={judul} onChange={(e) => setJudul(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Tanggal</label>
                                <input
                                    required
                                    type="date"
                                    className="form-control"
                                    style={{ fontFamily: "initial", backgroundColor: 'white', fontSize: 20, color: "black", borderColor: "grey" }}
                                    value={tanggalPengumuman} onChange={(e) => setTanggalPengumuman(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label className="form-label" style={{ fontFamily: "initial", fontSize: 15, fontWeight: 'bold', color: "black" }}>Isi</label>
                                <Editor
                                    value={isi}
                                    initialValue=""
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | blocks |formatselect | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                    onEditorChange={handleEditorChange}
                                />
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger light" onClick={handleClose}>Close</button>
                        <button type="submit" className="btn btn-primary light">Simpan</button>
                    </Modal.Footer>
                </form>
            </Modal >
        </>
    )
}

export default Update