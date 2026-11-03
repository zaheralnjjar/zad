import { PrayerKey, PrayerTime } from '../types';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

// Default location (Makkah al-Mukarramah) if geolocation is not available yet
export const DEFAULT_LOCATION: LocationCoordinates = {
  latitude: 21.4225,
  longitude: 39.8262,
  city: 'مكة المكرمة',
  country: 'المملكة العربية السعودية',
};

// Calculation method angles
export const CALCULATION_METHODS = {
  Makkah: { fajrAngle: 18.5, ishaInterval: 90, name: 'جامعة أم القرى (مكة المكرمة)' },
  MWL: { fajrAngle: 18, ishaAngle: 17, name: 'رابطة العالم الإسلامي' },
  Egypt: { fajrAngle: 19.5, ishaAngle: 17.5, name: 'الهيئة المصرية العامة للمساحة' },
  ISNA: { fajrAngle: 15, ishaAngle: 15, name: 'الاتحاد الإسلامي لأمريكا الشمالية' },
};

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

// Compute Qibla direction in degrees clockwise from North
export function computeQiblaDirection(lat: number, lng: number): number {
  const makkahLat = toRadians(21.4225);
  const makkahLng = toRadians(39.8262);
  const userLat = toRadians(lat);
  const userLng = toRadians(lng);

  const deltaLng = makkahLng - userLng;
  const y = Math.sin(deltaLng);
  const x = Math.cos(userLat) * Math.tan(makkahLat) - Math.sin(userLat) * Math.cos(deltaLng);
  let qibla = toDegrees(Math.atan2(y, x));
  return (qibla + 360) % 360;
}

// Astronomical calculation of solar position & prayer times
export function calculatePrayerTimes(
  coords: LocationCoordinates,
  date: Date = new Date(),
  methodKey: keyof typeof CALCULATION_METHODS = 'Makkah'
): Record<PrayerKey | 'sunrise', string> {
  const method = CALCULATION_METHODS[methodKey] || CALCULATION_METHODS.Makkah;
  const lat = coords.latitude;
  const lng = coords.longitude;

  // Day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Time zone offset in hours
  const timeZoneOffset = -date.getTimezoneOffset() / 60;

  // Fractional year (radians)
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1);

  // Equation of time in minutes
  const eqtime = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );

  // Solar declination in radians
  const decl = 0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Solar noon in hours (UTC + offset)
  const noon = 12 + (timeZoneOffset - lng / 15) - (eqtime / 60);

  // Sun hour angle helper
  function hourAngle(altitudeDeg: number): number {
    const altRad = toRadians(altitudeDeg);
    const latRad = toRadians(lat);
    const cosHA = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return Math.PI;
    return Math.acos(cosHA);
  }

  // Sunrise/Sunset altitude is -0.833 degrees
  const haSunrise = toDegrees(hourAngle(-0.833)) / 15;
  const sunrise = noon - haSunrise;
  const sunset = noon + haSunrise;

  // Fajr
  const haFajr = toDegrees(hourAngle(-method.fajrAngle)) / 15;
  const fajr = noon - haFajr;

  // Dhuhr is noon + ~2 minutes after zenith
  const dhuhr = noon + (2 / 60);

  // Asr (Shafi'i/Hanbali/Maliki: shadow length = 1 + noon shadow)
  const latRad = toRadians(lat);
  const noonAltRad = (Math.PI / 2) - Math.abs(latRad - decl);
  const asrAlt = toDegrees(Math.atan(1 / (1 + Math.tan((Math.PI / 2) - noonAltRad))));
  const haAsr = toDegrees(hourAngle(asrAlt)) / 15;
  const asr = noon + haAsr;

  // Maghrib is sunset + 2 minutes
  const maghrib = sunset + (2 / 60);

  // Isha
  let isha = 0;
  if ('ishaInterval' in method && method.ishaInterval) {
    isha = maghrib + (method.ishaInterval / 60);
  } else if ('ishaAngle' in method && method.ishaAngle) {
    const haIsha = toDegrees(hourAngle(-method.ishaAngle)) / 15;
    isha = noon + haIsha;
  } else {
    isha = maghrib + 1.5;
  }

  function formatTime(hours: number): string {
    const totalMinutes = Math.round(((hours % 24) + 24) % 24 * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  return {
    fajr: formatTime(fajr),
    sunrise: formatTime(sunrise),
    dhuhr: formatTime(dhuhr),
    asr: formatTime(asr),
    maghrib: formatTime(maghrib),
    isha: formatTime(isha),
    jumuah: formatTime(dhuhr),
    all: formatTime(dhuhr),
  };
}

export function getUpcomingPrayerInfo(
  times: Record<PrayerKey | 'sunrise', string>,
  currentDate: Date = new Date()
): { nextPrayer: PrayerKey; minutesRemaining: number; currentPrayer: PrayerKey; prayerList: PrayerTime[] } {
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const isFriday = currentDate.getDay() === 5;

  const prayers: { key: PrayerKey; name: string; time: string; minutes: number }[] = [
    { key: 'fajr', name: 'الفجر', time: times.fajr, minutes: parseToMinutes(times.fajr) },
    { key: isFriday ? 'jumuah' : 'dhuhr', name: isFriday ? 'الجمعة' : 'الظهر', time: times.dhuhr, minutes: parseToMinutes(times.dhuhr) },
    { key: 'asr', name: 'العصر', time: times.asr, minutes: parseToMinutes(times.asr) },
    { key: 'maghrib', name: 'المغرب', time: times.maghrib, minutes: parseToMinutes(times.maghrib) },
    { key: 'isha', name: 'العشاء', time: times.isha, minutes: parseToMinutes(times.isha) },
  ];

  function parseToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  let nextPrayer = prayers[0].key;
  let minutesRemaining = 0;
  let currentPrayer = prayers[prayers.length - 1].key;

  let found = false;
  for (let i = 0; i < prayers.length; i++) {
    if (prayers[i].minutes > currentMinutes) {
      nextPrayer = prayers[i].key;
      minutesRemaining = prayers[i].minutes - currentMinutes;
      currentPrayer = i > 0 ? prayers[i - 1].key : prayers[prayers.length - 1].key;
      found = true;
      break;
    }
  }

  if (!found) {
    // Past Isha, next is tomorrow's Fajr
    nextPrayer = 'fajr';
    minutesRemaining = (24 * 60 - currentMinutes) + prayers[0].minutes;
    currentPrayer = 'isha';
  }

  const prayerList: PrayerTime[] = prayers.map(p => ({
    key: p.key,
    arabicName: p.name,
    time: p.time,
    isNext: p.key === nextPrayer,
    minutesLeft: p.key === nextPrayer ? minutesRemaining : 0,
  }));

  return { nextPrayer, minutesRemaining, currentPrayer, prayerList };
}
