import React, { useEffect, useState } from "react";
import axios from "axios";

// Ваши данные для доступа к Adafruit IO
const ADAFRUIT_IO_USERNAME = "sergaybass";
const ADAFRUIT_IO_KEY = import.meta.env.VITE_ADAFRUIT_IO_KEY;

// Имена фидов
const FEEDS = {
  temperature: "temperature",
  humidity: "humidity"
};

const AdafruitDataDisplay = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Запросы для получения данных из фидов
      const [tempResponse, humResponse] = await Promise.all([
        axios.get(`https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${FEEDS.temperature}/data`, {
          headers: { "X-AIO-Key": ADAFRUIT_IO_KEY },
        }),
        axios.get(`https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${FEEDS.humidity}/data`, {
          headers: { "X-AIO-Key": ADAFRUIT_IO_KEY },
        }),
      ]);

      // Устанавливаем последние значения из фидов
       setTemperature(tempResponse.data[0].value);
      
       setHumidity(humResponse.data[0].value);
       console.log(humResponse.data[0].value)
    } catch (err) {
      setError("Ошибка при получении данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Обновляем данные каждые 30 секунд
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Загрузка данных...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h1>Данные с датчиков</h1>
      <p>🌡 Температура: <strong>{temperature ? `${temperature} °C` : "Нет данных"}</strong></p>
      <p>💧 Влажность: <strong>{humidity ? `${humidity} %` : "Нет данных"}</strong></p>
    </div>
  );
};

export default AdafruitDataDisplay;
