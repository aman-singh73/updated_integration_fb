import React, { useState } from 'react';
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import axios from 'axios';

const Home = () => {
  const [map, setMap] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [coords, setCoords] = useState('');
  const defaultCenter = { lat: 22.5726, lng: 88.3639 };

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const handleCoordsChange = (e) => {
    setCoords(e.target.value);
  };

  const parseCoords = (coordsString) => {
    return coordsString.split(';').map((coord) => {
      const [lat, lng] = coord.split(',').map(Number);
      return { lat, lng };
    });
  };

  const validateCoordinates = (coordsArray) => {
    for (let i = 0; i < coordsArray.length - 1; i++) {
      const latDiff = Math.abs(coordsArray[i].lat - coordsArray[i + 1].lat);
      const lngDiff = Math.abs(coordsArray[i].lng - coordsArray[i + 1].lng);
      if (latDiff > 0.09 || lngDiff > 0.09) {
        return false;
      }
    }
    return true;
  };

  const createPolygon = () => {
    const coordsArray = parseCoords(coords);
    if (!validateCoordinates(coordsArray)) {
      alert(
        'The difference between consecutive latitude or longitude values should not be greater than 0.09.'
      );
      return;
    }
    setPolygon(coordsArray);
    fitMapToPolygon(coordsArray);
  };

  const removePolygon = () => {
    setPolygon(null);
  };

  const fitMapToPolygon = (coordsArray) => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();
      coordsArray.forEach((coord) => bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng)));
      map.fitBounds(bounds);
    }
  };

  const searchCoordinates = () => {
    const coordsArray = parseCoords(coords);
    if (coordsArray.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      coordsArray.forEach((coord) => bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng)));
      map.fitBounds(bounds);
    }
  };

  const saveImage = () => {
    const coordsArray = parseCoords(coords);
    if (coordsArray.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      coordsArray.forEach((coord) => bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng)));
      const center = bounds.getCenter();
      const zoom = map.getZoom();
      const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat()},${center.lng()}&zoom=${zoom}&size=600x400&maptype=satellite&key=AIzaSyB4mze3dCYLlVzGEWO-cyHZYEiV01JD6iM`;
      const imgElement = document.createElement('img');
      imgElement.src = staticMapUrl;
      imgElement.alt = 'Satellite Image';
      document.getElementById('mapImage').innerHTML = ''; // Clear previous image
      document.getElementById('mapImage').appendChild(imgElement);
    }
  };

  








  // const savePolygon = async () => {
  //   try {
  //     await axios.post('http://localhost:5000/api/save_polygon', {
  //       coordinates: coords,
  //       user_id: 1, // Replace with actual user ID after implementing authentication
  //     });
  //     alert('Polygon saved successfully');
  //   } catch (error) {
  //     console.error('Error saving polygon:', error);
  //     alert('Error saving polygon');
  //   }
  // };

  const savePolygon = async () => {
    try {
      const coordsArray = parseCoords(coords);
      if (coordsArray.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        coordsArray.forEach((coord) =>
          bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng))
        );
        const center = bounds.getCenter();
        const zoom = map.getZoom();
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat()},${center.lng()}&zoom=${zoom}&size=600x400&maptype=satellite&key=AIzaSyB4mze3dCYLlVzGEWO-cyHZYEiV01JD6iM`;
        
        await axios.post('http://localhost:5000/api/save_polygon', {
          coordinates: coords,
          imageUrl: staticMapUrl,
          user_id: 1, // Replace with actual user ID after implementing authentication
        });
        alert('Polygon and image saved successfully');
      } else {
        alert('Please enter valid coordinates.');
      }
    } catch (error) {
      console.error('Error saving polygon:', error);
      alert('Error saving polygon');
    }
  };
  








  return (
    <div className="h-screen flex flex-col items-center">
      <div className="w-full flex-grow p-4">
        <h1 className='font-bold text-3xl mb-2'>
          Select Area
        </h1>
        <h3 className='text-xl mb-3'>
          Select an Area on the map to estimate the solar energy potential for rooftops.
        </h3>
        <LoadScript googleMapsApiKey="AIzaSyB4mze3dCYLlVzGEWO-cyHZYEiV01JD6iM">
          <GoogleMap
            mapContainerStyle={{ height: '40vh', width: '100%' }}
            center={defaultCenter}
            zoom={10}
            onLoad={handleMapLoad}
          >
            {polygon && <Polygon paths={polygon} options={{ strokeColor: '#FF0000', strokeOpacity: 0.8, strokeWeight: 2, fillColor: '#FF0000', fillOpacity: 0.35 }} />}
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="p-4 w-full mt-1">
        <div className="flex flex-col items-center space-y-4">
          <label htmlFor="coords" className="block text-gray-700">Enter coordinates (lat,lng; lat,lng; ...):</label>
          <input
            type="text"
            id="coords"
            value={coords}
            onChange={handleCoordsChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
          <div className="flex space-x-2">
            <button onClick={searchCoordinates} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Search</button>
            <button onClick={createPolygon} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Create Polygon</button>
            <button onClick={removePolygon} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Remove Polygon</button>
            <button onClick={saveImage} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700">Save Satellite Image</button>
            <button onClick={savePolygon} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700">Save Polygon</button>
          </div>
        </div>
        <div id="mapImage" className="p-4 mt-4"></div>
      </div>
    </div>
  );
};

export default Home;

























