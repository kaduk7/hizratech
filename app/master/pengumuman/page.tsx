"use client"
import moment from "moment";
import Cek from "./action/Cek";
import React, { useState, useEffect, useRef } from 'react';
import { Pagination } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

const PengumumanDivisi = () => {
  const [datapengumuman, setDatapengumuman] = useState([])
  const [filterText, setFilterText] = React.useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchDataPengumuman()
  },[])
  

  const fetchDataPengumuman = async () => {
    try {
      const response = await fetch(`/master/api/pengumuman`);
      const result = await response.json();
      setDatapengumuman(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(page);
  };

  const filteredItems = datapengumuman.filter(
    (item: any) => item.pengumumanTb.judul && item.pengumumanTb.judul.toLowerCase().includes(filterText.toLowerCase()),
  );

  const columns = [
    {
      name: 'No',
      cell: (row: any, index: number) => <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>,
      sortable: false,
      width: '80px'
    },
    {
      name: 'Judul',
      selector: (row: any) => row.pengumumanTb.judul,
      sortable: true,
      width: '420px'
    },
    {
      name: 'Tanggal',
      selector: (row: any) => moment(row.pengumumanTb.tanggalPengumuman).format("DD-MM-YYYY"),
    },
    {
      name: 'Action',
      cell: (row: any) => (
        <div className="d-flex">
          <Cek pengumuman={row.pengumumanTb} />
        </div>
      ),
      width: '150px'
    },

  ];

  return (
    <div>
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title" style={{ fontFamily: "initial", fontSize: 20 }}>Pengumuman</h1>
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
                    fontFamily: 'initial'
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
          </div>
        </div>
      </div>
    </div >
  </div >
  )
}

export default PengumumanDivisi