# Mini Wallet API

Mini Wallet API adalah aplikasi server sederhana yang dibangun menggunakan Node.js untuk mengelola transaksi dan pelanggan.

## Persyaratan

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Instalasi

1. Clone repositori ini ke komputer Anda:

   ```bash
   git clone https://github.com/username/mini-wallet-api.git
   ```

2. Pindah ke direktori proyek:

   ```bash
   cd mini-wallet-api
   ```

3. Install dependensi menggunakan npm:

   ```bash
   npm install
   ```

4. Salin file `.env_example` dan ubah namanya menjadi `.env`. Sesuaikan pengaturan konfigurasi dalam file `.env` sesuai kebutuhan Anda.

## Menjalankan Server

Untuk menjalankan server, jalankan perintah berikut:

```bash
npm run dev
```

Server akan berjalan pada `http://localhost:3000`.

## Penggunaan

Anda dapat menggunakan Postman untuk mengakses API ini. Import file `MINI-WALLET.postman_collection.json` ke Postman untuk mendapatkan akses ke koleksi endpoint API yang telah disiapkan.

## Endpoint API

- **GET /transactions**: Mendapatkan daftar transaksi.
- **GET /transactions/:id**: Mendapatkan detail transaksi berdasarkan ID.
- **POST /transactions**: Membuat transaksi baru.
  - Body Request:
    ```json
    {
      "customer_id": "customer_id",
      "amount": 100.50,
      "type": "credit"
    }
    ```
- **GET /customers**: Mendapatkan daftar pelanggan.
- **GET /customers/:id**: Mendapatkan detail pelanggan berdasarkan ID.
- **POST /customers**: Membuat pelanggan baru.
  - Body Request:
    ```json
    {
      "name": "Nama Pelanggan",
      "email": "email@example.com"
    }
    ```

Pastikan untuk menyesuaikan data yang diperlukan dalam body request saat menggunakan endpoint API.

Semoga informasi ini membantu! Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk bertanya.