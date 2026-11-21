# Server notifikasi

Endpoint kecil untuk mengirim notifikasi lewat Expo Push API. Dipakai karena
Cloud Functions memerlukan paket Blaze.

## Alur

1. Aplikasi memanggil `POST /api/notifikasi` setelah aksi berhasil.
2. Server memverifikasi Firebase ID token pemanggil.
3. Server memastikan pemanggil adalah asisten pemilik sesi.
4. Server mengambil token Expo penerima dari koleksi `tokenPerangkat`.
5. Server mengirim ke Expo Push API.
6. Event dicatat di `peristiwaNotifikasi` agar tidak terkirim dua kali.

## Badan permintaan

```json
{ "tipe": "sesi-dibuka", "sesiId": "abc123" }
```

Tipe yang diterima:

| Tipe | Penerima |
|---|---|
| `sesi-dibuka` | Semua peserta kelas |
| `jadwal-berubah` | Semua peserta kelas |
| `izin-diajukan` | Asisten pemilik sesi |
| `izin-disetujui` | Praktikan pengaju, wajib kirim `praktikanId` |
| `izin-ditolak` | Praktikan pengaju, wajib kirim `praktikanId` |

## Environment variable di Vercel

| Nama | Isi |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Seluruh isi file service account, satu baris JSON |

Jangan pernah menaruh file service account di repo. Buat kunci baru di
Firebase Console, salin isinya ke environment variable, lalu hapus file lokal.

## Deploy

```bash
cd server
npm install
npx vercel@latest
npx vercel@latest --prod
```

Saat pertama kali, Vercel menanyakan nama project dan direktori. Pilih `server`
sebagai root, biarkan pengaturan lain default. Setelah selesai, catat URL
produksi, misalnya `https://praktikumku-notifikasi.vercel.app`.

Tambahkan URL itu ke environment aplikasi:

```
EXPO_PUBLIC_NOTIFIKASI_URL=https://praktikumku-notifikasi.vercel.app
```

Lalu jalankan ulang Metro agar variabel terbaca.

## Prasyarat Expo Push

Expo Push tetap memerlukan kredensial push di sisi Expo:

```bash
npx eas-cli credentials
```

Pilih Android, lalu unggah FCM V1 service account key. Pilih iOS, lalu unggah
APNs key. Tanpa ini, Expo Push menerima permintaan tetapi perangkat tidak
menerima notifikasi.

## Uji manual

```bash
curl -X POST https://<url-vercel>/api/notifikasi \
  -H "Authorization: Bearer <firebase-id-token>" \
  -H "Content-Type: application/json" \
  -d '{"tipe":"sesi-dibuka","sesiId":"<sesi-id>"}'
```

`firebase-id-token` bisa dicetak sementara dari aplikasi setelah login dengan
`auth.currentUser.getIdToken()`.
