import React from 'react';
import {GoogleMap} from "@react-google-maps/api";

export interface BaseGoogleMapProps {
  mapHandleClick?: (e: google.maps.MapMouseEvent) => void,
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
export const BaseGoogleMap = ({children, mapHandleClick}: BaseGoogleMapProps) => {
  return (
    <div className="mb-3">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onClick={mapHandleClick}>
        {children ? children() : null}
      </GoogleMap>
    </div>
  )
}