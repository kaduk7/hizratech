"use client"
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const MyComponent = () => {
  const [originalText, setOriginalText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');

  const encryptText = () => {
    const key = 'Bismillahirrahmanirrahim Allahuakbar ZikriAini'; // Ganti dengan kunci rahasia yang kuat
    const encrypted = CryptoJS.AES.encrypt(originalText, key).toString();
    setEncryptedText(encrypted);
  };

  const decryptText = () => {
    const key = 'Bismillahirrahmanirrahim Allahuakbar ZikriAini'; // Gunakan kunci yang sama dengan yang digunakan untuk enkripsi
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
    setDecryptedText(decrypted);
  };

  return (
    <div>
      <textarea
        placeholder="Masukkan teks"
        value={originalText}
        onChange={(e) => setOriginalText(e.target.value)}
      />
      <button onClick={encryptText}>Enkripsi</button>
      <div>
        <strong>Teks Terenkripsi:</strong> {encryptedText}
      </div>
      <button onClick={decryptText}>Dekripsi</button>
      <div>
        <strong>Teks Terdekripsi:</strong> {decryptedText}
      </div>
    </div>
  );
};

export default MyComponent;