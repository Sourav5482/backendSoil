# Soil Monitoring Mobile App (Full Stack)

This workspace contains:

- `mobile-app` (Expo React Native)
- `backend` (Node.js + Express + MongoDB + Google Drive image storage)
npm --prefix e:\fianalsoil\mobile-app start -- --tunnel -c --port 8092
### npx expo start --tunnel
## Folder Structure

```text
soil-monitoring/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
  mobile-app/
    src/
      components/
      constants/
      screens/
      services/
      utils/
```

## Backend Setup

1. Go to backend:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Create env file:
   - Copy `.env.example` to `.env`
4. Run server:
   - `npm run dev`

Backend runs on port 5000 by default.

## Mobile Setup

1. Go to mobile app:
   - `cd mobile-app`
2. Install dependencies:
   - `npm install`
3. Update API URL in `src/constants/config.js` with your machine local IP.
4. Start app:
   - `npm start`

## BLE Notes

`react-native-ble-plx` requires a custom dev client (native module).

Use:

- `npx expo prebuild`
- `npx expo run:android` or `npx expo run:ios`

Then launch the app with the dev client.

## API Endpoints

- `POST /api/upload-images`
- `POST /api/save-data`
- `GET /api/history/ref/:refId`
- `GET /api/history/location/:location`

## Data Save Logic

- If refId exists: append to `records` array
- If refId does not exist: create new document

## Google Drive Requirements

Service account needs access to target folder.

Steps:

1. Create service account in Google Cloud
2. Enable Google Drive API
3. Share the Google Drive folder with service account email
4. Add credentials in backend `.env`

## Validation Included

- Ref ID required before submit
- At least 1 image required
- Max 3 images
- BLE errors handled with alerts
- Loading indicators on collection/search/submit
