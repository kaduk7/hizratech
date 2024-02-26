"use client"
import { useEffect, useState } from 'react';

const DownloadLogData = () => {
  const [ip, setIp] = useState('192.168.1.201');
  const [key, setKey] = useState('0');
  const [data, setData] = useState([]);

  useEffect(() => {
    handleDownload()
  }, [])

  const handleDownload = async () => {
    try {
      const response = await fetch(`/admin/api/absen`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error downloading data:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#caffcb' }}>
      <h3>Download Log Data</h3>
      <form>
        IP Address:{' '}
        <input type="text" name="ip" value={ip} onChange={(e) => setIp(e.target.value)}/>
        <br />
        Comm Key:{' '}
        <input type="text" name="key" value={key} onChange={(e) => setKey(e.target.value)}  />
        <br />
        <br />
        <button type="button" onClick={handleDownload}>
          Download
        </button>
      </form>
      <br />

      {/* {data.length > 0 && ( */}
        <table >
          <thead>
            <tr >
              <td>
                <b>UserID</b>
              </td>
              <td width="200">
                <b>Tanggal & Jam</b>
              </td>
              <td>
                <b>Verifikasi</b>
              </td>
              <td>
                <b>Status</b>
              </td>
            </tr>
          </thead>
          <tbody>
            {data.map((item:any) => (
              <tr  key={item.PIN}>
                <td>{item.PIN}</td>
                <td>{item.DateTime}</td>
                <td>{item.Verified}</td>
                <td>{item.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      {/* )} */}
    </div>
  );
};

export default DownloadLogData;