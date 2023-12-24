"use client"
import Add from "./action/Add"
import Update from "./action/Update"
import Delete from "./action/Delete"
import Cek from "./action/Cek";
import React, { useState, useEffect } from 'react';
import { Pagination, Badge } from 'react-bootstrap';

const Pengajuan = () => {
  const [datajobdesk, setDatajobdesk] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchDataRequestJobdesk()
  },[datajobdesk])

  const fetchDataRequestJobdesk = async () => {
    try {
      const response = await fetch(`/master/api/requestjobdesk`);
      const result = await response.json();
      setDatajobdesk(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredData = datajobdesk.filter((item: any) =>
    item.namaJob.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e: any) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const getSeverity = (status: any) => {
    switch (status) {

      case 'Proses':
        return 'info';

      case 'Selesai':
        return 'success';

      case 'Tolak':
        return 'danger';

      case 'Verifikasi':
        return 'warning';

      case 'Dalam Proses':
        return 'info';

    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title" style={{ fontFamily: "initial", fontSize: 25 }}>Pengajuan Tugas</h1>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-9">
                  <Add />
                </div>
                <div className="col-md-3">
                  <div className="input-group mb-3  input-success">
                    <span className="input-group-text border-0"><i className="mdi mdi-magnify"></i></span>
                    <input
                      className="form-control"
                      value={searchTerm}
                      type="text"
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search..."
                    />
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table primary-table-bordered">
                  <thead className="thead-success">
                    <tr>
                      <th style={{ fontSize: 17, color: "black" }}>No</th>
                      <th style={{ fontSize: 17, color: "black" }}>Nama Tugas</th>
                      <th style={{ fontSize: 17, color: "black" }}>Status</th>
                      <th style={{ fontSize: 17, color: "black" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((x: any, index) => (
                      <tr className="hover" key={x.id}>
                        <td style={{ fontFamily: "initial", fontSize: 17, color: "black" }} width={100}>{index + 1}</td>
                        <td style={{ fontFamily: "initial", fontSize: 17, color: "black" }}>{x.namaJob}</td>
                        <td style={{ fontFamily: "initial", fontSize: 17, color: "black" }}> <Badge bg={getSeverity(x.status) || ''}>
                          {x.status}
                        </Badge></td>
                        <td width={100}>
                          <div className="d-flex">
                            <Update jobdesk={x} />
                            <Delete jobdeskId={x.id} />
                            <Cek jobdesk={x} findkaryawan={x.KaryawanTb} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">

                </div>

                <div className="col-md-8">
                  <Pagination>
                    <li className="page-item page-indicator ">
                      <a className="page-link"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
                      >
                        <i className="la la-angle-left"></i></a>
                    </li>

                    {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}

                    <li className="page-item page-indicator">
                      <a className="page-link"
                        onClick={() => setCurrentPage((next) => Math.min(next + 1, Math.ceil(filteredData.length / itemsPerPage)))}
                        style={{ pointerEvents: currentPage === Math.ceil(filteredData.length / itemsPerPage) ? 'none' : 'auto' }}
                      >
                        <i className="la la-angle-right"></i></a>
                    </li>

                    <li>
                      <label className="col-sm-12 col-form-label mx-2" style={{ fontWeight: "bold" }} >Show</label>
                    </li>

                    <li>
                      <div className="col-sm-12">
                        <select
                          className="form-control"
                          style={{ backgroundColor: 'white', color: "black", borderColor: "grey" }}
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                        </select>
                      </div>
                    </li>

                  </Pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Pengajuan