export const MAP_CONFIG = {
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  defaultCenter: [52.0, 19.0] as [number, number],
  defaultZoom: 6,
  markerIconSize: [40, 40] as [number, number],
};
