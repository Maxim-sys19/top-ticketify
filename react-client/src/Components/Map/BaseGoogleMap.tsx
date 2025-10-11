import React from 'react';
import {GoogleMap} from "@react-google-maps/api";

export interface BaseGoogleMapProps {
  mapHandleClick?: (e: google.maps.MapMouseEvent) => void,
  setMapInstance: (map: google.maps.Map) => void,
  children?: () => React.ReactNode
}

const containerStyle = {
  width: '100%',
  height: '500px'
};
const center = {
  lat: 47.0105,
  lng: 28.8638
};
export const BaseGoogleMap = ({children, mapHandleClick, setMapInstance}: BaseGoogleMapProps) => {
  return (
    <div className="mb-3">
      <GoogleMap onLoad={setMapInstance} mapContainerStyle={containerStyle} center={center} zoom={10} onClick={mapHandleClick}>
        {children ? children() : null}
      </GoogleMap>
    </div>
  )
}