// src/components/GoogleMap.tsx
'use client';

import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  apiKey: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  markerPosition?: {
    lat: number;
    lng: number;
  };
}

// ประกาศ type สำหรับ window.initMap
declare global {
  interface Window {
    initMap: () => void;
  }
}

export default function GoogleMap({
  apiKey,
  center,
  zoom,
  markerPosition = center
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  useEffect(() => {
    // สร้างฟังก์ชัน callback
    window.initMap = () => {
      if (mapRef.current && !mapInstanceRef.current && window.google) {
        // สร้างแผนที่ใหม่
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#242f3e"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#746855"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#242f3e"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#d59563"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#d59563"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#263c3f"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#6b9a76"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#38414e"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#212a37"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9ca5b3"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#746855"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#1f2835"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#f3d19c"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#2f3948"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#d59563"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#17263c"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#515c6d"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#17263c"
                }
              ]
            }
          ]
        });
        
        // เพิ่ม marker
        const marker = new window.google.maps.Marker({
          position: markerPosition,
          map: map,
          title: 'ColdChain Logistics',
          animation: window.google.maps.Animation.DROP
        });
        
        // Info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: '<div><strong>ColdChain Logistics</strong><p>123 Cold Storage Building<br>Digital Park, Sukhumvit Road<br>Bangkok 10110, Thailand</p></div>'
        });
        
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
        
        mapInstanceRef.current = map;
      }
    };
    
    // โหลด Google Maps API script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      window.initMap();
    }
    
    return () => {
      // Cleanup
      window.initMap = () => {};
    };
  }, [apiKey, center, zoom, markerPosition]);
  
  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '100%' }}
      className="rounded-lg overflow-hidden"
    ></div>
  );
}