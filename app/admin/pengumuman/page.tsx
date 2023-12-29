"use client"
import Add from "./action/Add"
import Update from "./action/Update"
import Delete from "./action/Delete"
import React, { useState, useEffect } from 'react';
import { Pagination, } from 'react-bootstrap';
import moment from "moment";


const Pengumuman = () => {
  const [datapengumuman, setDatapengumuman] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchDataPengumuman()
  }, [datapengumuman])

  const fetchDataPengumuman = async () => {
    try {
      const response = await fetch(`/admin/api/pengumuman`);
      const result = await response.json();
      setDatapengumuman(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredData = datapengumuman.filter((item: any) =>
    item.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const globalIndex = (index: any) => indexOfFirstItem + index + 1;
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e: any) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pageNumbers = [];
  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(startPage + 2, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  }
  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title" style={{ fontFamily: "initial", fontSize: 25 }}>Data Pengumuman</h1>
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
                      <th style={{ fontSize: 17, color: "black" }}>Judul</th>
                      <th style={{ fontSize: 17, color: "black" }}>Tanggal</th>
                      <th style={{ fontSize: 17, color: "black" }}>Action</th>
                    </tr>
                  </thead>
                  {datapengumuman.length === 0 ?
                    <tbody>
                      <tr >
                        <td className="text-center">No data available</td>
                      </tr>
                    </tbody>
                    :
                    <tbody>
                      {currentItems.map((x: any, index) => (
                        <tr className="hover" key={x.id}>
                          <td style={{ fontFamily: "initial", fontSize: 17, color: "black" }} width={80}>{globalIndex(index)}</td>
                          <td style={{ fontFamily: "initial", fontSize: 17, color: "black" }}>{x.judul}</td>
                          <td style={{ fontFamily: "initial", fontSize: 17, color: "black" }}>{moment(x.tanggalPengumuman).format("DD-MM-YYYY")}</td>

                          <td width={100}>
                            <div className="d-flex">
                              <Update pengumuman={x} />
                              <Delete pengumumanId={x.id} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  }
                </table>
              </div>

              {datapengumuman.length > 0 ?
                <div className="row mb-3">
                  <div className="col-md-12 d-flex justify-content-end">
                    <Pagination>
                      <li>
                        <label className="col-sm-12 col-form-label mx-2" style={{ fontWeight: "bold" }} >Row per page</label>
                      </li>

                      <li>
                        <div className="col-sm-12 mt-2 mx-2">
                          <select
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

                      <li className="page-item page-indicator ">
                        <a className="page-link"
                          onClick={() => setCurrentPage(1)}
                          style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
                        >
                          <i className="la la-angle-double-left"></i></a>
                      </li>

                      <li className="page-item page-indicator ">
                        <a className="page-link"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
                        >
                          <i className="la la-angle-left"></i></a>
                      </li>

                      {pageNumbers.map((number) => (
                        <Pagination.Item
                          key={number}
                          active={number === currentPage}
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </Pagination.Item>
                      ))}

                      <li className="page-item page-indicator">
                        <a className="page-link"
                          onClick={() => setCurrentPage((next) => Math.min(next + 1, Math.ceil(filteredData.length / itemsPerPage)))}
                          style={{ pointerEvents: currentPage === Math.ceil(filteredData.length / itemsPerPage) ? 'none' : 'auto' }}
                        >
                          <i className="la la-angle-right"></i></a>
                      </li>

                      <li className="page-item page-indicator">
                        <a className="page-link"
                          onClick={() => setCurrentPage(Math.ceil(filteredData.length / itemsPerPage))}
                          style={{ pointerEvents: currentPage === Math.ceil(filteredData.length / itemsPerPage) ? 'none' : 'auto' }}
                        >
                          <i className="la la-angle-double-right"></i></a>
                      </li>

                    </Pagination>
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

export default Pengumuman