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

> Skrip turut cipta **satu pentadbir JPN lalai**:
> - Email: `admin@jpnkedah.gov.my`
> - PIN: `123456`
>
> **Tukar PIN ni** selepas log masuk pertama (guna tindakan `tukarPin`), atau reset dari editor dengan `resetPin('admin@jpnkedah.gov.my','pinbaru')`.

## Langkah 4 — Deploy sebagai Web App

1. Dalam editor Apps Script, klik **Deploy → New deployment**.
2. Klik gear ⚙️ → pilih **Web app**.
3. Tetapan:
   - **Execute as:** *Me (akaun anda)*
   - **Who has access:** *Anyone*  ← penting supaya frontend boleh capai
4. Klik **Deploy** → salin **Web app URL**. Ini URL yang frontend akan guna.

> Setiap kali ubah kod, kena **Deploy → Manage deployments → Edit (pensel) → Version: New version → Deploy**. Kalau buat "New deployment" tiap kali, URL akan berubah.

## Langkah 5 — Isi data sekolah & daftar pegawai

**Sekolah:** Isi terus dalam tab `Sekolah` (kolum: `kod_sekolah`, `nama`, `daerah`, `jenis`, `lokasi`, `peringkat`). Pastikan ejaan `daerah` sama macam dalam tab `Konfig`. Kolum `peringkat` ada dropdown Rendah/Menengah.

**Pegawai PPD/JPN:** Cara mudah — daftar terus dari dalam sistem (modul **Urus Pengguna**, Pentadbir sahaja) selepas frontend siap. Atau dari editor Apps Script:

```javascript
tambahPengguna('Nama Pegawai', 'emel@jpnkedah.gov.my', 'PPD', 'Kubang Pasu', '778899');
```

Tiga peranan (`peranan`):

| Nilai | Peranan | Akses | daerah |
|---|---|---|---|
| `ADMIN` | Pentadbir JPN | Tambah/edit projek semua daerah, urus kategori & pengguna | `SEMUA` |
| `JPN` | Pegawai JPN | Pantau semua 10 PPD + dashboard (read-only) | `SEMUA` |
| `PPD` | Pegawai PPD | Tambah/edit projek daerah sendiri | nama daerah |

> **Nota:** akaun lalai `admin@jpnkedah.gov.my` (PIN `123456`) — tukar PIN selepas log masuk pertama melalui menu **Tukar PIN**.

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

// Contoh log masuk
const r = await panggil('login', { email: 'admin@jpnkedah.gov.my', pin: '123456' });
// r.token disimpan, dihantar pada setiap panggilan seterusnya
```

## Senarai tindakan (action) yang ada

| action | Siapa | Kegunaan |
|---|---|---|
| `login` | semua | `{email, pin}` → pulang `token` + info pengguna |
| `tukarPin` | semua | `{email, pinLama, pinBaru}` |
| `getKonfig` | berdaftar | senarai daerah, kategori, status, rmk untuk dropdown |
| `getSekolah` | berdaftar | senarai sekolah (PPD: daerah sendiri sahaja) |
| `getProjek` | berdaftar | `{token, filter:{daerah,rmk,rp,status,kategori}}` |
| `tambahProjek` | **ADMIN + PPD** | `{token, data:{...}}` (Pegawai JPN tak boleh) |
| `kemaskiniProjek` | **ADMIN + PPD** | `{token, id_projek, data:{...}}` (Pegawai JPN tak boleh) |
| `getLogProgress` | berdaftar | `{token, id_projek}` → sejarah kemaskini |
| `getDashboard` | berdaftar | `{token, filter:{rmk}}` → agregat untuk carta |
| `tambahKategori` | **ADMIN sahaja** | `{token, kategori}` |
| `senaraiPengguna` | **ADMIN sahaja** | senarai semua pengguna (tanpa PIN) |
| `daftarPengguna` | **ADMIN sahaja** | `{token, data:{nama,email,peranan,daerah,pin}}` |
| `kemaskiniPengguna` | **ADMIN sahaja** | `{token, data:{id,nama,peranan,daerah,aktif}}` |
| `resetPinPengguna` | **ADMIN sahaja** | `{token, data:{id,pin}}` |
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

Sistem ada tiga senario PIN. Berikut cara kendali setiap satu.

### 1. Tukar PIN sendiri (semua pengguna)

Setiap pegawai boleh tukar PIN sendiri bila-bila masa:

1. Log masuk ke sistem.
2. Klik tab **Tukar PIN**.
3. Masukkan **PIN semasa**, kemudian **PIN baru** (minimum 6 digit) dan sahkan.
4. Klik **Tukar PIN**. Siap — PIN baru terus berkuat kuasa.

Galakkan semua pegawai tukar PIN lalai pada kali pertama log masuk.

### 2. Reset PIN pegawai (Pentadbir JPN)

Bila pegawai lupa PIN atau akaun dikunci, Pentadbir boleh reset tanpa perlu tahu PIN lama:

1. Log masuk sebagai Pentadbir → tab **Urus Pengguna**.
2. Cari pegawai berkenaan → klik **Reset PIN**.
3. Masukkan PIN baru (minimum 6 digit) → **Reset PIN**.
4. Maklumkan PIN baru kepada pegawai (mereka boleh tukar sendiri selepas itu).

Reset PIN juga **buka kunci** akaun secara automatik (kaunter cubaan gagal & tempoh lockout dikosongkan).

### 3. Pemulihan kecemasan — Pentadbir terkunci / lupa PIN

Kalau Pentadbir sendiri tak boleh log masuk (lupa PIN, atau dikunci) dan **tiada Pentadbir lain** untuk reset, gunakan editor Apps Script:

1. Buka Google Sheets → **Extensions → Apps Script**.
2. Pada dropdown fungsi, pilih **`resetPin`**. Tapi fungsi ini perlukan argumen, jadi lebih mudah tampal baris ini di hujung kod, save, dan Run sekali:
   ```javascript
   function pulihAdmin() {
     resetPin('admin@jpnkedah.gov.my', '654321');  // tukar PIN ikut kehendak
   }
   ```
3. Pilih **`pulihAdmin`** → **Run**. PIN admin kini `654321` dan akaun terbuka.
4. Log masuk, kemudian tukar kepada PIN sebenar melalui tab **Tukar PIN**. Padam fungsi `pulihAdmin` selepas selesai.

> Editor Apps Script hanya boleh diakses oleh pemilik Google Sheets — jadi laluan kecemasan ni selamat.

### Nota tentang kunci akaun (lockout)

- Selepas **5 cubaan PIN salah**, akaun dikunci **15 minit**.
- Lockout terbuka sendiri selepas 15 minit, atau serta-merta apabila Pentadbir buat **Reset PIN**.
- Nilai ini boleh diubah dalam objek `TETAPAN` (`MAX_CUBAAN`, `LOCKOUT_MINIT`) di `Code.gs`.

---

## Bukti (Google Drive)

Backend simpan `url_bukti` sahaja (bukan fail). Cadangan aliran: pegawai upload fail ke satu folder Drive yang dikongsi, dapatkan pautan kongsi, dan hantar pautan tu dalam medan `url_bukti` semasa kemaskini projek. (Upload automatik ke Drive boleh ditambah pada fasa frontend nanti kalau perlu.)
