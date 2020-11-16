import axios from "axios";

export const getWeather = (lattitude, longitude) =>
  axios({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather`,
    params: {
      lat: `${encodeURI(lattitude)}`,
      lon: `${encodeURI(longitude)}`,
      units: `metric`,
      appid: `${process.env.OPEN_KEY}`,
    },
  });
export const getLattitude = (place) =>
  axios({
    method: "GET",
    url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
      place
    )}.json?access_token=${process.env.MAPBOX_KEY}&limit=1`,
  });
