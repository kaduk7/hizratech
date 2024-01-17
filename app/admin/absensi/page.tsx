"use client"
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const FilterComponent = ({ filterText, onFilter, onClear }: { filterText: any, onFilter: any, onClear: any }) => (
  <>
    <input
      id="search"
      type="text"
      placeholder="Filter By Name"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <button type="button" onClick={onClear}>
      X
    </button>
  </>
);

const columns = [
  {
    name: 'Id',
    selector: (row: any) => row.id,
    sortable: true,
  },
  {
    name: 'Nama',
    selector: (row: any) => row.nama,
    sortable: true,
  },

];

const Karyawan = () => {
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
  const [datadivisi, setDatadivisi] = useState([])

  useEffect(() => {
    reload()
  }, [])

  const reload = async () => {
    const response = await fetch(`/admin/api/divisi`);
    const result = await response.json();
    setDatadivisi(result);
  }

  const filteredItems = datadivisi.filter(
    (item: any) => item.nama && item.nama.toLowerCase().includes(filterText.toLowerCase()),
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent onFilter={(e: any) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
    );
  }, [filterText, resetPaginationToggle]);

 

  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title" style={{ fontFamily: "initial", fontSize: 25 }}>Coba Coba</h1>
            </div>
            <DataTable
              title="Contact List"
              columns={columns}
              data={filteredItems}
              pagination
              paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              selectableRows
              persistTableHead
            />


          </div>
        </div>
      </div >
    </div >


  )
};

export default Karyawan;
