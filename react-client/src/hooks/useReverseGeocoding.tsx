import React, {useEffect} from "react";

type UseReverseGeocodingParams = {
  coords: google.maps.LatLngLiteral | null
  inputRef: React.RefObject<HTMLInputElement | null>
}
export const useReverseGeocoding = ({coords, inputRef}: UseReverseGeocodingParams) => {
  useEffect(() => {
    if(!coords) return
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({location: coords}, (results, status) => {
      if(status === 'OK' && results) {
        const formattedAddress = results[0].formatted_address;
        if(inputRef.current) {
          inputRef.current.value = formattedAddress;
        }
      } else {
        console.error('[useReverseGeocoding] Geocoding failed:', status)
      }
    })
  }, [coords, inputRef])
}