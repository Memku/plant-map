# Plants Map MVP

A local-first web application for capturing and mapping plant photos using React, TypeScript, and OpenStreetMap.

## Features

- **Photo Capture/Upload**: Take photos with your device camera or upload existing images
- **Location Mapping**: Automatically detect GPS location or manually select on the map
- **Local Storage**: All data stored locally in IndexedDB (offline-first)
- **Interactive Map**: View all plants as pins with photo thumbnails on OpenStreetMap
- **Plant Management**: Add, view, edit, and delete plant entries
- **Image Optimization**: Automatic photo compression and thumbnail generation
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Maps**: React-Leaflet + OpenStreetMap
- **Database**: Dexie.js (IndexedDB wrapper)
- **State Management**: Zustand
- **Styling**: CSS Modules

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview production build locally
npm run preview
```

## Project Structure

```
plants-map/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── map/             # Map-related components
│   │   ├── plant/           # Plant management components
│   │   ├── photo/           # Photo capture/upload components
│   │   └── layout/          # Layout components
│   ├── services/
│   │   ├── database/        # Dexie database configuration
│   │   ├── photo/           # Photo compression service
│   │   └── geolocation/     # Geolocation service
│   ├── hooks/               # Custom React hooks
│   │   └── useDatabase/     # Database CRUD hooks
│   ├── store/               # Zustand state stores
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── config/              # App configuration
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Usage

### Adding a Plant

1. Click the "Add Plant" button in the header
2. Choose to take a photo or upload an existing one
3. Select the plant's location:
   - Click "Use My Location" for GPS auto-detection
   - Or click on the map to manually select a location
4. Optionally add a name and notes
5. Click "Save Plant"

### Viewing Plants

- All plants appear as circular photo markers on the map
- Click any marker to see plant details in a popup
- The map shows all plants with their photo thumbnails

### Editing/Deleting Plants

- Click a plant marker to open its details
- Use the Edit button to modify the name or notes
- Use the Delete button to remove the plant (with confirmation)

## Key Features Explained

### Local-First Architecture

- All data is stored in IndexedDB using Dexie.js
- No backend server required
- Data persists across browser sessions
- Fully functional offline (except map tiles)

### Photo Optimization

- Automatic compression to <500KB per photo
- Thumbnail generation (150x150px) for map markers
- Base64 encoding for simple storage
- Maintains good quality while managing storage quota

### Geolocation

- Primary: GPS auto-detection with high accuracy
- Fallback: Manual map selection
- Stores accuracy information
- Tracks location source (GPS vs manual)

### Component Architecture

- Single responsibility principle
- Feature-based organization
- Reusable common components
- Type-safe with TypeScript

## Browser Support

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Browser Features

- IndexedDB
- getUserMedia API (for camera)
- Geolocation API (for GPS)

## Storage Limits

- IndexedDB quota varies by browser (typically 50MB-1GB)
- Each plant with compressed photo uses ~500KB
- Can store approximately 100-2000 plants depending on browser

## Future Enhancements

The architecture supports:
- Export/Import data (JSON)
- Search and filtering
- Plant categories/tags
- Cloud synchronization
- Multi-user features
- Offline map tile caching

## Troubleshooting

### Camera not working
- Check browser permissions for camera access
- Use "Upload Photo" as an alternative
- Some browsers require HTTPS for camera access

### Geolocation not working
- Check browser permissions for location access
- Use manual map selection as fallback
- GPS may be inaccurate indoors

### Storage quota exceeded
- Delete old plants to free up space
- Future: Export and archive old data

## License

MIT

## Contributing

This is an MVP project. Contributions are welcome!

## Contact

For questions or feedback, please open an issue in the repository.
