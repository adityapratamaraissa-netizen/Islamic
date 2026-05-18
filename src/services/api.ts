const QURAN_API_BASE = 'https://equran.id/api/v2';
const PRAYER_API_BASE = 'https://api.aladhan.com/v1';

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends Surah {
  ayat: Ayat[];
}

export const quranService = {
  async getSurahs(): Promise<Surah[]> {
    const res = await fetch(`${QURAN_API_BASE}/surat`);
    const json = await res.json();
    return json.data;
  },

  async getSurah(nomor: number): Promise<SurahDetail> {
    const res = await fetch(`${QURAN_API_BASE}/surat/${nomor}`);
    const json = await res.json();
    return json.data;
  }
};

export const prayerService = {
  async getTimings(city: string, country: string = 'Indonesia') {
    const res = await fetch(`${PRAYER_API_BASE}/timingsByCity?city=${city}&country=${country}&method=11`);
    const json = await res.json();
    return json.data;
  },
  
  async getTimingsByLatLng(lat: number, lng: number) {
    const res = await fetch(`${PRAYER_API_BASE}/timings?latitude=${lat}&longitude=${lng}&method=11`);
    const json = await res.json();
    return json.data;
  }
};

export interface Doa {
  doa: string;
  ayat: string;
  latin: string;
  artinya: string;
}

export const doaService = {
  async getDoas(): Promise<Doa[]> {
    // Using a reliable static-ish API or fallback
    try {
      const res = await fetch('https://islamic-api-zhirrr.vercel.app/api/doaharian');
      const json = await res.json();
      return json.data;
    } catch (e) {
      // Return a small subset if API fails
      return [
        {
          doa: "Doa Sebelum Tidur",
          ayat: "بِسْمِكَ اللّهُمَّ اَحْيَا وَبِسْمِكَ اَمُوْتُ",
          latin: "Bismika Allahumma ahya wa bismika amut",
          artinya: "Dengan nama-Mu ya Allah aku hidup dan dengan nama-Mu aku mati."
        }
      ];
    }
  }
};
