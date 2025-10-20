// import React, { useEffect, useState } from 'react';
// import './Weather.css'
// const Weather = () => {
//   const [data,setData]=useState({})
//   const [location,setLocation]=useState("")
//   const search=async()=>{
//     let url=`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=88214c3de1d7c02bbd81a4dab7e106f4`
//     const res=await fetch(url)
//     const data=await res.json()
//     setData(data)
//     setLocation('')
    
//   }
//   useEffect(()=>{
//     const fetchDefaultLocation=async()=>{
//       let url=`https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=88214c3de1d7c02bbd81a4dab7e106f4`
//       const res=await fetch(url)
//       const data=await res.json()
//       setData(data)
//     }
//     fetchDefaultLocation()
//   },[])
//   const handleLocation=(e)=>{
//     setLocation(e.target.value)
//   }
//   const getWeatherIcon=(weatherType)=>{
//     switch(weatherType){
//       case 'Clear':
//         return <i className='bx bxs-sun'></i>
//       case 'Clouds':
//         return <i className='bx bxs-cloud'></i>
//       case 'Rain':
//         return <i className='bx bxs-cloud-rain'></i>
//       case 'Thunderstorm':
//         return <i className='bx bxs-cloud-lightning'></i>
//       case 'Snow':
//         return <i className='bx bxs-cloud-snow'></i>
//       case 'Haze':
//       case 'Mist':
//         return <i className='bx bxs-cloud'></i>
//       default :
//         return<i className='bx bxs-cloud'></i>

//     }
//   }
//   return (
//     <div className='weather'>
//       <div className="search">
//         <div className="search-top">
//           <i className='fa-solid fa-location-dot'></i>
//           <div className="location">{data.name}</div>
//         </div>
//         <div className="search-location">
//             <input type="text" placeholder='search location' value={location} 
//             onChange={handleLocation}/>
//             <i className='fa-solid fa-magnifying-glass' onClick={search}></i>
//           </div>
//       </div>
//       <div className="weather-data">
//           {
//             data.weather&&data.weather[0]&&getWeatherIcon(data.weather[0].main)
//           }
//           <div className="weather-type">{data?.weather?.[0]?.main}</div>
//           <div className="temp">{data.main?`${data?.main?.temp}°`:null}</div>
//         </div>
//     </div>
//   );
// }

// export default Weather;

import React, { useEffect, useState } from 'react';
import './Weather.css';

const Weather = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');

  const search = async () => {
    if (!location) return;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=88214c3de1d7c02bbd81a4dab7e106f4&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    setData(data);
    setLocation('');
  };

  useEffect(() => {
    const fetchWeatherByCoords = async (lat, lon) => {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=88214c3de1d7c02bbd81a4dab7e106f4&units=metric`;
      const res = await fetch(url);
      const data = await res.json();
      setData(data);
    };

    if (navigator.geolocation) {
      fetchWeatherByCoords(15.8281, 78.0373); // Always fetch Kurnool

    } else {
      console.error("Geolocation not supported. Showing Kurnool by default.");
      fetchWeatherByCoords(15.8281, 78.0373);
    }
  }, []);

  const handleLocation = (e) => {
    setLocation(e.target.value);
  };

  const getWeatherIcon = (weatherType) => {
    switch (weatherType) {
      case 'Clear':
        return <i className='bx bxs-sun'></i>;
      case 'Clouds':
        return <i className='bx bxs-cloud'></i>;
      case 'Rain':
        return <i className='bx bxs-cloud-rain'></i>;
      case 'Thunderstorm':
        return <i className='bx bxs-cloud-lightning'></i>;
      case 'Snow':
        return <i className='bx bxs-cloud-snow'></i>;
      case 'Haze':
      case 'Mist':
        return <i className='bx bxs-cloud'></i>;
      default:
        return <i className='bx bxs-cloud'></i>;
    }
  };

  return (
    <div className='weather'>
      <div className="search">
        <div className="search-top">
          <i className='fa-solid fa-location-dot'></i>
          <div className="location">{data.name||"kurnool"}</div>
        </div>

        <div className="search-location">
          <input
            type="text"
            placeholder='Search location'
            value={location}
            onChange={handleLocation}
          />
          <i
            className='fa-solid fa-magnifying-glass'
            onClick={search}
            style={{ cursor: 'pointer' }}
          ></i>
        </div>
      </div>

      <div className="weather-data">
        {data.weather && data.weather[0] && getWeatherIcon(data.weather[0].main)}
        <div className="weather-type">{data?.weather?.[0]?.main}</div>
        <div className="temp">
          {data.main ? `${Math.round(data.main.temp)}°C` : null}
        </div>
      </div>
    </div>
  );
};

export default Weather;

