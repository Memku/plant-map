export const MAP_CONFIG = {
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  defaultCenter: [51.505, -0.09] as [number, number],
  defaultZoom: 13,
  markerIconSize: [40, 40] as [number, number],
};
