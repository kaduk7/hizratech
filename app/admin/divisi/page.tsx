"use client"
import Add from "./action/Add"
import Update from "./action/Update"
import Delete from "./action/Delete"
import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';

const Divisi = () => {
  const [datadivisi, setDatadivisi] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchDataDivisi()
  },[datadivisi])

  const fetchDataDivisi = async () => {
    try {
      const response = await fetch(`/admin/api/divisi`);
      const result = await response.json();
      setDatadivisi(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredData = datadivisi.filter((item: any) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e: any) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title" style={{ fontFamily: "initial", fontSize: 25 }}>Data Divisi</h1>
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
                      <th style={{ fontSize: 17,color: "black"  }}>No</th>
                      <th style={{ fontSize: 17,color: "black"  }}>Nama Divisi</th>
                      <th style={{ fontSize: 17,color: "black"  }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((x: any, index) => (
                      <tr className="hover" key={x.id}>
                        <td style={{ fontFamily: "initial", fontSize: 17, color: "black" }} width={100}>{index + 1}</td>
                        <td style={{ fontFamily: "initial", fontSize: 17, color: "black" }}>{x.nama}</td>
                        <td width={100}>
                          <div className="d-flex">
                            <Update divisi={x} />
                            <Delete divisiId={x.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row mb-3">
                <div className="col-md-5">

                </div>

                <div className="col-md-7">
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

export default Divisi