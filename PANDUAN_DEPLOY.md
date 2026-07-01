# Panduan Deploy — Sistem Pemantauan Projek RMK

Sistem ada dua bahagian: **backend** (Google Apps Script + Sheets — pintu auth, logik, pangkalan data) dan **frontend** (`index.html` di GitHub Pages — antara muka pengguna). Bahagian A pasang backend; Bahagian B pasang frontend.

---

# BAHAGIAN A — BACKEND

---

## Langkah 1 — Sediakan Google Sheets

1. Buka [sheets.new](https://sheets.new) untuk cipta satu Google Sheets baru.
2. Namakan fail, contoh: **Pangkalan Data Pemantauan RMK**.
3. Biarkan kosong dulu — skrip akan cipta semua tab secara automatik.

## Langkah 2 — Tampal kod backend

1. Dalam Sheets tu, klik menu **Extensions → Apps Script**.
2. Padam semua kod contoh dalam `Code.gs`.
3. Tampal **seluruh** isi fail `Code.gs` yang disertakan.
4. Klik ikon **Save** (atau `Ctrl+S`).

## Langkah 3 — Jana struktur pangkalan data

1. Di bahagian atas editor, pada dropdown fungsi, pilih **`setupSpreadsheet`**.
2. Klik **Run**.
3. Kali pertama, Google akan minta kebenaran → **Review permissions → pilih akaun → Advanced → Go to (nama projek) → Allow**.
4. Balik ke Sheets — sekarang dah ada 5 tab: `Pengguna`, `Sekolah`, `Projek`, `Log_Progress`, `Konfig`.

> Skrip turut cipta **12 akaun kongsi lalai** dalam tab `Pengguna` (1 Admin, 1 Pengguna JPN, 10 Pengguna PPD). Semua PIN lalai ialah **`123456`**.
>
> **Tukar semua PIN ini** — edit terus kolum `pin` dalam tab `Pengguna` ikut setiap PPD.

## Langkah 4 — Deploy sebagai Web App

1. Dalam editor Apps Script, klik **Deploy → New deployment**.
2. Klik gear ⚙️ → pilih **Web app**.
3. Tetapan:
   - **Execute as:** *Me (akaun anda)*
   - **Who has access:** *Anyone*  ← penting supaya frontend boleh capai
4. Klik **Deploy** → salin **Web app URL**. Ini URL yang frontend akan guna.

> Setiap kali ubah kod, kena **Deploy → Manage deployments → Edit (pensel) → Version: New version → Deploy**. Kalau buat "New deployment" tiap kali, URL akan berubah.

## Langkah 5 — Isi data sekolah & tetapkan PIN

**Sekolah:** Isi terus dalam tab `Sekolah` (kolum: `kod_sekolah`, `nama`, `daerah`, `jenis`, `lokasi`, `peringkat`). Pastikan ejaan `daerah` sama macam dalam tab `Konfig`. Kolum `peringkat` ada dropdown Rendah/Menengah.

**Akaun & PIN:** Sistem guna **model log masuk dropdown** — 12 akaun kongsi tetap dalam tab `Pengguna`. Cikgu cuma perlu **edit kolum `pin`** ikut setiap baris:

| peranan | daerah | PIN |
|---|---|---|
| ADMIN | SEMUA | (pin admin) |
| JPN | SEMUA | (pin pengguna JPN) |
| PPD | Baling | (pin PPD Baling) |
| PPD | Kota Setar | (pin PPD Kota Setar) |
| … | … | … 10 PPD |

Pengguna log masuk dengan pilih **Jenis Pengguna** (Admin / Pengguna JPN / Pengguna PPD) → pilih **PPD** (jika PPD) → masukkan **PIN**. Tiga peranan:

| Peranan | Akses |
|---|---|
| Admin | Tambah/edit projek semua daerah, urus kategori & PIN akaun |
| Pengguna JPN | Pantau semua 10 PPD + dashboard (read-only) |
| Pengguna PPD | Tambah/edit projek daerah sendiri sahaja |

> **PIN disimpan sebagai teks biasa** dalam Sheet (mudah diurus). Sebab hanya pemilik Sheet ada akses, ia sesuai untuk kegunaan dalaman. Elakkan PIN bermula dengan `0`.

---

# BAHAGIAN B — FRONTEND (`index.html`)

## Langkah 6 — Masukkan URL Web App

1. Buka fail `index.html` dalam editor teks.
2. Di bahagian atas blok `<script>`, cari:
   ```javascript
   const CONFIG = { URL: 'URL_WEB_APP_ANDA' };
   ```
3. Ganti `URL_WEB_APP_ANDA` dengan URL Web App `.../exec` dari Langkah 4. Simpan.

## Langkah 7 — Naik ke GitHub Pages

Sistem ini PWA, jadi **semua fail di bawah mesti dimuat naik ke akar (root) repo yang sama**:

```
index.html              manifest.webmanifest    sw.js
icon-192.png            icon-512.png            icon-maskable-512.png
apple-touch-icon.png    favicon-32.png
```

1. Cipta repository baru di GitHub (boleh **Private**).
2. Muat naik **kesemua 8 fail** di atas ke repo (drag & drop → Commit).
3. Pergi **Settings → Pages**.
4. Di **Source**, pilih branch `main` (folder `/root`) → **Save**.
5. Tunggu seminit, GitHub akan beri pautan `https://USERNAME.github.io/NAMA-REPO/`.
6. Buka pautan tu — skrin log masuk dengan logo RMK Observer akan muncul. Masuk dengan akaun admin.

## Langkah 8 — Pasang ke telefon (PWA)

Sebaik sahaja dibuka melalui pautan GitHub Pages (HTTPS), app boleh dipasang ke skrin utama:

- **Android (Chrome):** menu ⋮ → **Add to Home screen / Install app**.
- **iPhone (Safari):** butang Kongsi → **Add to Home Screen**.

Selepas dipasang, app buka skrin penuh (tanpa bar pelayar) dengan ikon emblem RMK Observer — rasa macam aplikasi biasa.

## Langkah 9 — Semakan akhir

- Log masuk sebagai admin → uji Dashboard, tambah satu projek ujian, lihat sejarah kemajuan.
- Daftar satu pegawai PPD melalui **Urus Pengguna** → log keluar → log masuk sebagai PPD → pastikan dia nampak daerah sendiri sahaja & tiada tab Urus Pengguna.
- Uji status **Tergendala** tanpa catatan → sistem patut tolak.
- Pasang ke telefon dan pastikan ikon + skrin penuh berfungsi.

---

## Kemaskini app (versi baharu)

App ada **semakan kemaskini automatik**. Bila anda ubah mana-mana fail frontend:

1. Buka `sw.js`, naikkan nombor **VERSI** (cth `rmk-observer-v1` → `rmk-observer-v2`).
2. Muat naik fail yang diubah (termasuk `sw.js`) ke repo.
3. Pada peranti pengguna, app akan kesan versi baharu dan papar bar **"Versi baharu tersedia · Muat semula"** di bawah skrin. Pengguna klik **Muat semula** untuk dapat versi terkini.

> Penting: setiap kali kemaskini, **mesti naikkan nombor VERSI dalam `sw.js`** — itulah pencetus notifikasi kemaskini. Kalau lupa, sesetengah peranti mungkin masih guna versi lama (cache).

Semakan dibuat secara automatik setiap kali app dibuka semula (difokus) dan setiap 30 minit.

---

## Rujukan teknikal — cara frontend bercakap dengan backend

Hantar **POST** dengan body JSON. Guna `Content-Type: text/plain` supaya elak masalah CORS preflight GAS:

```javascript
const URL = 'https://script.google.com/macros/s/XXXX/exec';

async function panggil(action, params = {}) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...params }),
  });
  return res.json();
}

// Contoh log masuk (Admin/JPN guna daerah 'SEMUA'; PPD guna nama daerah)
const r = await panggil('login', { peranan: 'PPD', daerah: 'Baling', pin: '123456' });
// r.token disimpan, dihantar pada setiap panggilan seterusnya
```

## Senarai tindakan (action) yang ada

| action | Siapa | Kegunaan |
|---|---|---|
| `login` | semua | `{peranan, daerah, pin}` → pulang `token` + info pengguna |
| `tukarPin` | berdaftar | `{token, pinLama, pinBaru}` |
| `getKonfig` | berdaftar | senarai daerah, kategori, status, rmk untuk dropdown |
| `getSekolah` | berdaftar | senarai sekolah (PPD: daerah sendiri sahaja) |
| `getProjek` | berdaftar | `{token, filter:{daerah,rmk,rp,status,kategori}}` |
| `tambahProjek` | **ADMIN + PPD** | `{token, data:{...}}` (Pengguna JPN tak boleh) |
| `kemaskiniProjek` | **ADMIN + PPD** | `{token, id_projek, data:{...}}` (Pengguna JPN tak boleh) |
| `getLogProgress` | berdaftar | `{token, id_projek}` → sejarah kemaskini |
| `getDashboard` | berdaftar | `{token, filter:{rmk}}` → agregat untuk carta |
| `tambahKategori` | **ADMIN sahaja** | `{token, kategori}` |
| `senaraiPengguna` | **ADMIN sahaja** | senarai 12 akaun (tanpa PIN) |
| `kemaskiniPengguna` | **ADMIN sahaja** | `{token, data:{peranan,daerah,aktif?,bukaKunci?}}` |
| `resetPinPengguna` | **ADMIN sahaja** | `{token, data:{peranan,daerah,pin}}` |
| `logout` | berdaftar | `{token}` |

Setiap panggilan selepas login mesti sertakan `token`. Kalau token tamat tempoh, respons akan ada `sesiTamat: true` — frontend patut paksa log masuk semula.

---

## Peraturan logik yang dah terbina

- **Tiga peranan:** Pentadbir JPN (edit semua + urus sistem), Pegawai JPN (pantau read-only), Pegawai PPD (edit daerah sendiri).
- **Tapis ikut peranan:** PPD hanya nampak & edit daerah sendiri; ADMIN & JPN nampak semua 10 PPD; hanya ADMIN & PPD boleh edit.
- **Tergendala wajib catatan:** kalau status ditetap `Tergendala` tanpa catatan, sistem tolak.
- **Lockout:** 5 cubaan PIN gagal → akaun dikunci 15 minit.
- **Sesi:** token sah 8 jam.
- **Setiap kemaskini direkod** dalam `Log_Progress` (jejak audit penuh).

Tetapan di atas boleh ubah dalam objek `TETAPAN` di bahagian atas `Code.gs`.

## Pengurusan PIN

PIN disimpan sebagai teks biasa dalam tab `Pengguna`. Ada beberapa cara urus.

### 1. Cara paling mudah — edit terus di Sheet

Buka tab `Pengguna`, cari baris akaun (ikut `peranan` + `daerah`), edit kolum `pin`. Selesai — terus berkuat kuasa.

### 2. Tukar PIN dari dalam app (semua pengguna)

1. Log masuk → tab **Tukar PIN**.
2. Masukkan **PIN semasa**, **PIN baru** (min. 6 digit), sahkan → **Tukar PIN**.

> Nota: akaun dikongsi satu pejabat — menukar PIN mengubahnya untuk seluruh pejabat/daerah tersebut.

### 3. Set PIN / buka kunci (Pentadbir)

1. Log masuk sebagai Admin → tab **Urus Pengguna**.
2. Untuk mana-mana akaun: klik **Set PIN** (tetapkan PIN baru), **Buka Kunci** (jika dikunci), atau **Aktif/Nyahaktif**.

Set PIN juga membuka kunci akaun secara automatik.

### 4. Pemulihan kecemasan — Admin terkunci / lupa PIN

Kalau akaun Admin tak boleh log masuk, edit terus kolum `pin` baris **ADMIN / SEMUA** dalam tab `Pengguna`, dan kosongkan kolum `masa_lockout` + `cubaan_gagal`. Atau dari editor Apps Script:

```javascript
function pulihAdmin() {
  resetPin('ADMIN', 'SEMUA', '654321');  // tukar PIN ikut kehendak
}
```

Pilih **`pulihAdmin`** → **Run**. PIN admin kini `654321` dan akaun terbuka. Padam fungsi ni selepas selesai.

> Editor Apps Script & Sheet hanya boleh diakses oleh pemilik — jadi laluan kecemasan ni selamat.

### Nota tentang kunci akaun (lockout)

- Selepas **5 cubaan PIN salah**, akaun dikunci **15 minit**.
- Lockout terbuka sendiri selepas 15 minit, atau serta-merta apabila Admin **Set PIN** / **Buka Kunci**.
- Nilai ini boleh diubah dalam objek `TETAPAN` (`MAX_CUBAAN`, `LOCKOUT_MINIT`) di `Code.gs`.

---

## Bertukar dari versi lama (model emel)

Kalau Cikgu dah jalankan versi lama (login guna emel), tab `Pengguna` masih struktur lama. Jalankan sekali dari editor untuk bina semula kepada model 12 akaun:

1. Tampal `Code.gs` terkini, save.
2. Pilih fungsi **`binaSemulaAkaun`** → **Run**.
3. Tab `Pengguna` dibina semula: 12 akaun, PIN lalai `123456`. Kemudian set PIN sebenar.

> **Amaran:** `binaSemulaAkaun()` gantikan semua baris dalam tab `Pengguna`.

---

## Bukti (Google Drive)

Backend simpan `url_bukti` sahaja (bukan fail). Cadangan aliran: pegawai upload fail ke satu folder Drive yang dikongsi, dapatkan pautan kongsi, dan hantar pautan tu dalam medan `url_bukti` semasa kemaskini projek. (Upload automatik ke Drive boleh ditambah pada fasa frontend nanti kalau perlu.)
