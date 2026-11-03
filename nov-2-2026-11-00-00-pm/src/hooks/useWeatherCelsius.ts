import { useState, useEffect } from 'react';

export interface WeatherCelsiusData {
  temperatureCelsius: number;
  conditionText: string;
  isLoading: boolean;
  isError: boolean;
}

export function useWeatherCelsius(latitude: number, longitude: number): WeatherCelsiusData {
  const [temperature, setTemperature] = useState<number>(() => {
    // Sensible default temperature in Celsius (around 26°C-28°C)
    return 27;
  });
  const [conditionText, setConditionText] = useState<string>('معتدل');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchWeather() {
      setIsLoading(true);
      setIsError(false);

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error('Weather API error');

        const data = await res.json();
        if (data && data.current && typeof data.current.temperature_2m === 'number') {
          if (!isCancelled) {
            setTemperature(Math.round(data.current.temperature_2m));
            
            // Map common WMO weather codes to Arabic descriptions
            const code = data.current.weather_code || 0;
            if (code === 0) setConditionText('صحو');
            else if (code <= 3) setConditionText('غائم جزئياً');
            else if (code >= 51 && code <= 67) setConditionText('ماطر');
            else setConditionText('معتدل');

            setIsLoading(false);
            return;
          }
        }
        throw new Error('Invalid weather data');
      } catch {
        if (!isCancelled) {
          // Fallback realistic Celsius temperature based on location
          const hour = new Date().getHours();
          const baseTemp = (latitude >= 20 && latitude <= 25) ? (hour >= 11 && hour <= 16 ? 32 : 27) : 24;
          setTemperature(baseTemp);
          setConditionText('معتدل');
          setIsError(true);
          setIsLoading(false);
        }
      }
    }

    fetchWeather();

    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [latitude, longitude]);

  return {
    temperatureCelsius: temperature,
    conditionText,
    isLoading,
    isError,
  };
}
