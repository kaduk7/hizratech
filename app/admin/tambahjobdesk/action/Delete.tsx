"use client"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import { JobdeskTb } from "@prisma/client";
import { supabase, supabaseUrl, supabaseBUCKET } from '@/app/helper'

function Delete({ jobdeskId, jobdesk }: { jobdeskId: Number, jobdesk: JobdeskTb }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const router = useRouter()

    const handleDelete = async (jobdeskId: number) => {
        handleClose()
        await supabase.storage
        .from(supabaseBUCKET)
        .remove([`file/${jobdesk.suratTugas}`]);

        await supabase.storage
        .from(supabaseBUCKET)
        .remove([`file/${jobdesk.beritaAcara}`]);

        await supabase.storage
        .from(supabaseBUCKET)
        .remove([`file/${jobdesk.laporanAnggaran}`]);

        await supabase.storage
        .from(supabaseBUCKET)
        .remove([`file/${jobdesk?.file}`]);

        await axios.delete(`/admin/api/tambahjobdesk/${jobdeskId}`)
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Berhasil dihapus',
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(function () {
            router.refresh()
        }, 1500);
    }

    return (
        <>
            <span onClick={handleShow} className="btn btn-danger shadow btn-xl sharp mx-1"><i className="fa fa-trash"></i></span>
            <Modal
                dialogClassName="modal-md"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Body>
                    <h6 className="font-bold" style={{ color: "black" }}>Anda jakin menghapus data ini ?</h6>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-warning light" onClick={handleClose}>Close</button>
                    <button type="button" className="btn btn-danger light" onClick={() => handleDelete(Number(jobdeskId))}>Ya, Hapus</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Delete