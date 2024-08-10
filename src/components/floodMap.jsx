import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const center = [13.0827, 80.2707];
const coastalPoint = [13.0827, 80.2707];

const floodData = [
  { lat: 13.0023, lng: 80.2550, rainfall: 60, hour: 1, name: 'Adyar' },
  { lat: 13.000242, lng: 80.266838, rainfall: 30, hour: 2, name: 'Besant Nagar' },
  { lat: 13.0047, lng: 80.2637, rainfall: 45, hour: 3, name: 'Mylapore' },
  { lat: 12.8976, lng: 80.1838, rainfall: 50, hour: 4, name: 'Chrompet' },
  { lat: 12.9750, lng: 80.2285, rainfall: 55, hour: 5, name: 'Velachery' },
  { lat: 13.0715, lng: 80.2774, rainfall: 40, hour: 6, name: 'Royapettah' },
  { lat: 13.0833, lng: 80.2707, rainfall: 60, hour: 7, name: 'Anna Nagar' },
  { lat: 13.0470, lng: 80.2336, rainfall: 35, hour: 8, name: 'T Nagar' },
  { lat: 13.0051, lng: 80.2477, rainfall: 65, hour: 9, name: 'Kotturpuram' },
  { lat: 13.0378, lng: 80.2368, rainfall: 70, hour: 10, name: 'Nungambakkam' }
];

// Function to check proximity to the coast
const isNearCoast = (lat, lng) => {
  const coastalDistance = L.latLng(lat, lng).distanceTo(coastalPoint);
  return coastalDistance < 10000; // 10 km
};

// Function to get elevation
const getElevation = async (lat, lng) => {
  const response = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`);
  const data = await response.json();
  return data.elevation;
};

// Function to analyze flood risk
const analyzeFloodRisk = async (lat, lng, rainfall, hour, name) => {
  const coastalRisk = isNearCoast(lat, lng);
  const elevation = await getElevation(lat, lng);
  const thresholds = getThresholdsForLocation(name);
  const rainfallThreshold = thresholds[hour] || 0;
  const elevationThreshold = 5; // Assuming this threshold is constant for all
  return rainfall > rainfallThreshold && coastalRisk && elevation < elevationThreshold;
};

// Define thresholds for locations
const rainfallThresholdsAdyarBesantNagarMylapore = {
  1: 0.4,
  2: 1.5,
  3: 2.1,
  4: 3,
  5: 3.3,
  6: 3.7,
  7: 4.2,
  8: 4.8,
  9: 5.1,
  10: 5.6,
  11: 6.2,
  12: 6.7,
  13: 7.1,
  14: 7.6,
  15: 8,
  16: 8.4,
  17: 8.9,
  18: 9.3,
  19: 9.8,
  20: 10.2,
  21: 10.7,
  22: 11.1,
  23: 11.6,
  24: 12,
};

const rainfallThresholdsChrompetVelacheryRoyapettah = {
  1: 0.7,
  2: 1.8,
  3: 2.7,
  4: 3.5,
  5: 3.9,
  6: 4.3,
  7: 4.8,
  8: 5.3,
  9: 5.7,
  10: 6.1,
  11: 6.7,
  12: 7.2,
  13: 7.5,
  14: 7.9,
  15: 8.4,
  16: 8.9,
  17: 9.4,
  18: 9.7,
  19: 10.2,
  20: 10.5,
  21: 10.9,
  22: 11.3,
  23: 11.8,
  24: 12.5,
};

const rainfallThresholdsAnnaNagarKotturpuramTNagarNungambakkam = {
  1: 1.1,
  2: 1.9,
  3: 3.7,
  4: 4.9,
  5: 6.0,
  6: 6.5,
  7: 6.9,
  8: 7.7,
  9: 8.9,
  10: 10.0,
  11: 11.1,
  12: 12.3,
  13: 13.5,
  14: 14.7,
  15: 15.8,
  16: 17.0,
  17: 17.8,
  18: 18.9,
  19: 20.0,
  20: 22.0,
  21: 23.7,
  22: 24.2,
  23: 24.9,
  24: 25,
};

const getThresholdsForLocation = (name) => {
  if (['Chrompet', 'Velachery', 'Royapettah'].includes(name)) {
    return rainfallThresholdsChrompetVelacheryRoyapettah;
  }
  if (['Anna Nagar', 'Kotturpuram', 'T Nagar', 'Nungambakkam'].includes(name)) {
    return rainfallThresholdsAnnaNagarKotturpuramTNagarNungambakkam;
  }
  return rainfallThresholdsAdyarBesantNagarMylapore;
};

const MapUpdater = ({ location, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView(location, zoom);
    }
  }, [location, zoom, map]);

  return null;
};

const MapComponent = () => {
  const [floodRisks, setFloodRisks] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(center);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    const fetchFloodRisks = async () => {
      const risks = await Promise.all(
        floodData.map(async ({ lat, lng, rainfall, hour, name }) => {
          const risk = await analyzeFloodRisk(lat, lng, rainfall, hour, name);
          return { lat, lng, rainfall, risk, name };
        })
      );
      setFloodRisks(risks);
    };

    fetchFloodRisks();
  }, []);

  const handleLocationChange = (event) => {
    const selectedName = event.target.value;
    const location = floodData.find(data => data.name === selectedName);
    if (location) {
      setSelectedLocation([location.lat, location.lng]);
      setZoom(15); // Zoom in when a location is selected
    }
  };

  return (
    <div>
      <select onChange={handleLocationChange} defaultValue="">
        <option value="" disabled>Select a location</option>
        {floodData.map(({ name }, index) => (
          <option key={index} value={name}>{name}</option>
        ))}
      </select>

      <MapContainer center={selectedLocation} zoom={zoom} className='w-full h-[550px]'>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {floodRisks.map(({ lat, lng, rainfall, risk, name }, index) => (
          <Circle
            key={index}
            center={[lat, lng]}
            radius={200}
            color={risk ? 'blue' : 'green'}
            fillColor={risk ? 'blue' : 'green'}
            fillOpacity={0.5}
          >
            <Popup>
              {name}<br />
              Rainfall: {rainfall} cm<br />
              Risk: {risk ? 'High' : 'Low'}
            </Popup>
          </Circle>
        ))}
        {floodData.map(({ lat, lng, name }, index) => (
          <Marker key={index} position={[lat, lng]}>
            <Popup>{name}</Popup>
          </Marker>
        ))}
        <MapUpdater location={selectedLocation} zoom={zoom} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;