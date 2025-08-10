'use client'

import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function MapPage() {
  useEffect(() => {
    const interval = setInterval(() => {
      const L = (window as any).L;
      if (L && L.Draw) {
        clearInterval(interval);
        const map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new L.Control.Draw({
          edit: { featureGroup: drawnItems },
        });
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, (e: any) => {
          const layer = e.layer;
          const type = prompt('Enter feature type (building, road, water):') || '';
          const country = prompt('Enter country code:') || '';
          layer.bindPopup(`Type: ${type}<br/>Country: ${country}`);
          layer.feature = { properties: { type, country } };
          drawnItems.addLayer(layer);
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css"
        />
      </Head>
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="beforeInteractive" />
      <Script src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js" strategy="beforeInteractive" />
      <div id="map" className="w-full h-screen" />
    </>
  );
}

