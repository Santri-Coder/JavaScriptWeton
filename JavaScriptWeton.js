#!/usr/bin/env node
'use strict';

const readline = require('readline');

/* ================= WARNA TERMINAL ================= */
const IJO = '\x1b[92m';
const RESET = '\x1b[0m';

/* ================= DATA DINTEN & PASARAN ================= */
const dintenJawa = {
  senin: 4,
  selasa: 3,
  rabu: 7,
  kamis: 8,
  jumat: 6,
  sabtu: 9,
  minggu: 5
};

const pasaranJawa = {
  legi: 5,
  pahing: 9,
  pon: 7,
  wage: 4,
  kliwon: 8
};

/* ================= ANCHOR PASARAN =================
   19 Februari 2000 = Setu Kliwon
*/
const PASARAN_REF = ['legi', 'pahing', 'pon', 'wage', 'kliwon'];
const REF_DATE = new Date(2000, 1, 19);
const REF_PASARAN_INDEX = PASARAN_REF.indexOf('kliwon');

/* ================= WATAK & REJEKI ================= */
const watakRejeki = {
  7:  ['Meneng, jujur, setya', 'Rejeki alit nanging tetep'],
  8:  ['Teteg, sregep', 'Rejeki cekap saking usaha'],
  9:  ['Wicaksana, kritis', 'Rejeki munggah mudhun'],
  10: ['Teduh lan wibawa', 'Rejeki lancar'],
  11: ['Wicaksana, ngayomi', 'Rejeki ageng sethithik-sethithik'],
  12: ['Optimis, mantep', 'Rejeki deres'],
  13: ['Teliti lan landhep', 'Rejeki ageng nanging abot'],
  14: ['Bakat pemimpin', 'Rejeki mapan'],
  15: ['Karismatik', 'Rejeki kathah'],
  16: ['Ambisius', 'Rejeki ageng nanging kathah ujian'],
  17: ['Kiyat spiritual', 'Rejeki kiyat'],
  18: ['Pemimpin sejati', 'Rejeki sanget ageng']
};

/* ================= PRIMBON PERJODOHAN ================= */
const primbonJodoh = {
  14: 'Pegat – rawan pisahan',
  15: 'Ratu – kinurmatan',
  16: 'Jodho – cocog sanget',
  17: 'Topo – bahagia ing wekasan',
  18: 'Tinari – rejeki lancar',
  19: 'Padu – asring padudon',
  20: 'Sujanan – rawan godaan',
  21: 'Pesthi – tentrem',
  22: 'Pegat – abot lelampahan',
  23: 'Ratu – kinurmatan luhur',
  24: 'Jodho – harmonis',
  25: 'Topo – kathah cobaan',
  26: 'Tinari – makmur',
  27: 'Padu – cekcok alit',
  28: 'Sujanan – godaan ageng',
  29: 'Pesthi – ayem',
  30: 'Pegat – watak keras',
  31: 'Ratu – diajeni',
  32: 'Jodho – kiyat',
  33: 'Topo – cobaan abot',
  34: 'Tinari – sugih',
  35: 'Padu – rembug panas',
  36: 'Pesthi – langgeng'
};

/* ================= FUNGSI ITUNG WETON ================= */
function hitungWeton(tgl, bln, thn) {
  const date = new Date(thn, bln - 1, tgl);
  if (
    date.getFullYear() !== thn ||
    date.getMonth() !== bln - 1 ||
    date.getDate() !== tgl
  ) {
    console.log('\n❌ Tanggal boten sah');
    process.exit(1);
  }

  const dintenMap = ['minggu','senin','selasa','rabu','kamis','jumat','sabtu'];
  const dinten = dintenMap[date.getDay()];

  const selisih = Math.floor(
    (date.getTime() - REF_DATE.getTime()) / 86400000
  );

  let idx = (REF_PASARAN_INDEX + selisih) % 5;
  if (idx < 0) idx += 5;

  const pasaran = PASARAN_REF[idx];
  const neptu = dintenJawa[dinten] + pasaranJawa[pasaran];
  const [watak, rejeki] = watakRejeki[neptu] || ['-', '-'];

  return { dinten, pasaran, neptu, watak, rejeki };
}

/* ================= UI ================= */
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const tanya = q => new Promise(r => rl.question(q, a => r(a)));

(async () => {
  console.log(IJO + '=== PRIMBON WETON JAWA ===' + RESET);

  console.log(IJO + 'Mangga lebokaken tanggal lair panjenengan\n');
  const t = parseInt(await tanya('Tanggal : '));
  const b = parseInt(await tanya('Wulan   : '));
  const y = parseInt(await tanya('Taun    : '));

  const anda = hitungWeton(t, b, y);

  console.log(IJO + '\nASILING WETON PANJENENGAN');
  console.log('Dinten  : ' + anda.dinten);
  console.log('Pasaran : ' + anda.pasaran);
  console.log('Neptu   : ' + anda.neptu);
  console.log('Watak   : ' + anda.watak);
  console.log('Rejeki  : ' + anda.rejeki);

  console.log('\n=== KANGGE MRINGSA PERJODOHAN ===');
  console.log('\nMangga lebokaken tanggal lair pasangan panjenengan');

  const tp = parseInt(await tanya('Tanggal : '));
  const bp = parseInt(await tanya('Wulan   : '));
  const yp = parseInt(await tanya('Taun    : '));

  const pasangan = hitungWeton(tp, bp, yp);
  const total = anda.neptu + pasangan.neptu;
  const asil = primbonJodoh[total] || 'Boten kapanggih';

  console.log(IJO + '\nASILING KARAKTER PERJODOHAN');
  console.log('Neptu weton panjenengan : ' + anda.neptu);
  console.log('Neptu weton pasangan    : ' + pasangan.neptu);
  console.log('Jumlah neptu weton      : ' + total);
  console.log('Primbon perjodohan      : ' + asil);

/* ================= UI AKSARA JAWA ================= */
  console.log(IJO + `
________________________________________________
ꦥ꧀ꦫꦆꦩ꧀ꦧꦎꦤ꧀ꦮꦌꦠꦎꦤ꧀ꦗꦎꦮꦎ
ꦩꦤ꧀ꦒ꧀ꦒꦭꦺꦧꦺꦴꦏꦏꦺꦤ꧀ꦠꦤ꧀ꦒ꧀ꦒꦭ꧀ꦭꦻꦂꦥꦤ꧀ꦗꦺꦤꦺꦤ꧀ꦒꦤ꧀
ꦠꦤ꧀ꦒ꧀ꦒꦭ꧀  : ${t}
ꦮꦸꦭꦤ꧀      : ${b}
ꦠꦲꦸꦤ꧀      : ${y}

ꦄꦱꦆꦭꦆꦤ꧀ꦒ꧀ꦮꦌꦠꦎꦤ꧀ꦥꦄꦤ꧀ꦗꦌꦤꦌꦤ꧀ꦒꦄꦤ꧀
ꦢꦶꦤ꧀ꦠꦺꦤ꧀  : ${anda.dinten}
ꦥꦱꦫꦤ꧀    : ${anda.pasaran}
ꦤꦺꦥ꧀ꦠꦸ    : ${anda.neptu}
ꦮꦠꦏ꧀     : ${anda.watak}
ꦫꦺꦗꦺꦏꦶ    : ${anda.rejeki}

ꦄꦱꦆꦭꦆꦤ꧀ꦒ꧀ꦏꦄꦫꦄꦏ꧀ꦠꦌꦂꦥꦌꦂꦗꦎꦢꦎꦲꦄꦤ꧀
ꦤꦺꦥ꧀ꦠꦸꦮꦺꦠꦺꦴꦤ꧀ꦥꦤ꧀ꦗꦺꦤꦺꦤ꧀ꦒꦤ꧀ : ${anda.neptu}
ꦤꦺꦥ꧀ꦠꦸꦮꦺꦠꦺꦴꦤ꧀ꦥꦱꦤ꧀ꦒꦤ꧀      : ${pasangan.neptu}
ꦗꦸꦩ꧀ꦭꦃꦤꦺꦥ꧀ꦠꦸꦮꦺꦠꦺꦴꦤ꧀        : ${total}
ꦥ꧀ꦫꦶꦩ꧀ꦧꦺꦴꦤ꧀ꦥꦺꦂꦗꦺꦴꦢꦺꦴꦲꦤ꧀    : ${asil}
` + RESET);
console.log(IJO + '\n________________________________________________');

  rl.close();
})();
