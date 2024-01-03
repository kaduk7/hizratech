"use client"
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const Karyawan = () => {
  const [excelData, setExcelData] = useState<string[]>([]);
  const [files, setFiles] = useState(true)

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Konversi lembar kerja Excel menjadi array objek
      const importedData = XLSX.utils.sheet_to_json(worksheet);

      // Gunakan importedData sesuai kebutuhan
      console.log(importedData);
      setExcelData(importedData as string[])
    };
    setFiles(false)
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title" style={{ fontFamily: "initial", fontSize: 25 }}>Coba Coba</h1>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                {files ?
                  <div>
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                  </div>
                  :
                  null
                }
              </div>
              {excelData.length > 0 && (
                <div className="table-responsive">
                  <table className="table primary-table-bordered">
                    <thead className="thead-success">
                      <tr>
                        <th style={{ fontSize: 17, color: "black" }}>NISN</th>
                        <th style={{ fontSize: 17, color: "black" }}>Nama </th>
                        <th style={{ fontSize: 17, color: "black" }}>Password</th>
                        <th style={{ fontSize: 17, color: "black" }}>Jenis Kelamin</th>
                        <th style={{ fontSize: 17, color: "black" }}>Tempat Lahir</th>
                        <th style={{ fontSize: 17, color: "black" }}>Tanggal Lahir</th>
                        <th style={{ fontSize: 17, color: "black" }}>Alamat</th>
                        <th style={{ fontSize: 17, color: "black" }}>Agama</th>
                        <th style={{ fontSize: 17, color: "black" }}>Kelas</th>
                        <th style={{ fontSize: 17, color: "black" }}>Jurusan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Tampilkan setiap baris data */}
                      {excelData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((cell: any, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div >
    </div >


  )
};

export default Karyawan;
