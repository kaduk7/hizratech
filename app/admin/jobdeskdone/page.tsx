"use client"
import Cek from "./action/Cek";
import React, { useState, useEffect } from 'react';
import { Pagination, Badge } from 'react-bootstrap';
import { warnastatus } from "@/app/helper";
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';

const TambahJobdesk = () => {
  const [datajobdesk, setDatajobdesk] = useState([])
  const [filterText, setFilterText] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    reload()
  }, [])

  const reload = async () => {
    const response = await fetch(`/admin/api/tambahjobdesk`);
    const result = await response.json();
    setDatajobdesk(result);
  }

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = datajobdesk.filter(
    (item: any) => item.namaJob && item.namaJob.toLowerCase().includes(filterText.toLowerCase()),
  );

  const columns = [
    {
      name: 'No',
      cell: (row: any, index: number) => <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>,
      sortable: false,
      width: '80px'
    },
    {
      name: 'Nama Karyawan',
      selector: (row: any) => row.KaryawanTb.nama,
      sortable: true,
      width: '320px'
    },
    {
      name: 'Nama Tugas',
      selector: (row: any) => row.namaJob,
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      cell: (row:any) => (
        <div
          style={{
            backgroundColor: warnastatus(row.status),
            padding: '8px',
            borderRadius: '4px',
            color: 'black',
          }}
        >
          {row.status}
        </div>
      ),
      width: '150px'
    },
    {
      name: 'Action',
      cell: (row: any) => (
        <div className="d-flex">
          <Cek jobdesk={row} findkaryawan={row.KaryawanTb} />
        </div>
      ),
      width: '150px'
    },

  ];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DataKaryawan');
    XLSX.writeFile(workbook, 'Data Karyawan.xlsx');
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title" style={{ fontFamily: "initial", fontSize: 20 }}>Semua Tugas</h1>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-9">
                 
                </div>
                <div className="col-md-3">
                  <div className="input-group mb-3  input-success">
                    <span className="input-group-text border-0"><i className="mdi mdi-magnify"></i></span>
                    <input
                      id="search"
                      type="text"
                      placeholder="Search..."
                      aria-label="Search Input"
                      value={filterText}
                      onChange={(e: any) => setFilterText(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                persistTableHead
                responsive
                paginationPerPage={itemsPerPage}
                paginationTotalRows={filteredItems.length}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={handleRowsPerPageChange}
                paginationRowsPerPageOptions={[5, 10, 20]}
                customStyles={{
                  headRow: {
                    style: {
                      backgroundColor: '#53d0b2',
                      fontSize: 15,
                      fontWeight: 'bold',
                      fontFamily:'initial'
                    },
                  },
                  cells: {
                    style: {
                      fontSize: 15,
                      fontFamily: 'initial',
                    },
                  },
                }}
              />
              {datajobdesk.length > 0 ?
                <div className="row mb-3">
                  <div className="col-md-3">
                    <button type='button' onClick={exportToExcel} className="btn btn-success btn-icon-text">
                      Ekspor ke Excel
                    </button>
                  </div>
                 

                </div>
                :
                null
              }
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default TambahJobdesk