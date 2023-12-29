"use client"
import Add from "./action/Add"
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from "axios"

import { FilterMatchMode } from "primereact/api"

import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

const Karyawan = () => {
  const [datakaryawan, setDatakaryawan] = useState([])

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    'nama': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    karyawan()
  },[datakaryawan])

  async function karyawan() {
    const response = await axios.get(`/admin/api/superadmin`);
    const data = response.data;
    setDatakaryawan(data)
  }

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['nama'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };




  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title" style={{ fontFamily: "initial", fontSize: 30 }}>Data Karyawan</h1>
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
                      value={globalFilterValue}
                      type="text"
                      onChange={onGlobalFilterChange}
                      placeholder="Search..."
                    />
                  </div>
                </div>
              </div>
              <DataTable
                value={datakaryawan}
                paginator
                rows={5}
                filters={filters}
                className="datatable-responsive"
                globalFilterFields={['nama']}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                responsiveLayout="scroll"
              >

                <Column header="No" headerStyle={{ width: '3rem' }} body={(data, options) => options.rowIndex + 1}></Column>
                <Column field="nama" header="Nama Karyawan" style={{ width: 200 }}></Column>
                <Column field="DivisiTb.nama" header="Divisi" style={{ width: 100 }}></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Karyawan