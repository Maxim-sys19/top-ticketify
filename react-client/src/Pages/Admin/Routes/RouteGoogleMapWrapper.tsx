import React, {useEffect, useRef} from 'react';
import {BaseGoogleMap, BaseGoogleMapProps} from "../../../Components/Map/BaseGoogleMap";
import {LatLngLiteral} from "../../../interfaces/routes/route-handles-interface";
import {SourceType} from "../../../hooks/useGoogleMapHandlers";
import {Autocomplete, DirectionsRenderer, Marker} from "@react-google-maps/api";
import {useReverseGeocoding} from "../../../hooks/useReverseGeocoding";

interface RouteGoogleMapWrapperProps extends BaseGoogleMapProps {
  start: LatLngLiteral | null,
  end: LatLngLiteral | null,
  directions: google.maps.DirectionsResult | null,
  clearDirection: () => void,
  isLoaded: boolean,
  applyPoint: (lat: number, lng: number, source: SourceType) => void
}

function RouteGoogleMapWrapper({
                                 start,
                                 end,
                                 applyPoint,
                                 clearDirection,
                                 directions,
                                 isLoaded,
                                 mapHandleClick
                               }: RouteGoogleMapWrapperProps) {
  const startAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const endAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const startInputRef = useRef<HTMLInputElement | null>(null);
  const endInputRef = useRef<HTMLInputElement | null>(null);
  useReverseGeocoding({coords: start, inputRef: startInputRef})
  useReverseGeocoding({coords: end, inputRef: endInputRef})
  useEffect(() => {
    const fixStyles = () => {
      const pacs = document.querySelectorAll('.pac-container');
      pacs.forEach((pac) => {
        const el = pac as HTMLElement;
        el.style.zIndex = '9999';
      });
    }
    const observer = new MutationObserver(fixStyles)
    observer.observe(window.document.body, {childList: true, subtree: true});
    fixStyles()
    return () => observer.disconnect();
  }, []);
  const onStartPlaceChanged = () => {
    console.log('onStartPlaceChanged');
    const ac = startAutocompleteRef.current
    if (!ac) return
    const place = ac.getPlace()
    if (!place.geometry) return
    if (!place.geometry.location) return
    const lat = place.geometry.location.lat();
    const lng = place?.geometry.location.lng();
    console.log('startPlace lat: ', lat);
    console.log('startPlace lng: ', lng);
    applyPoint(lat, lng, 'startAutocomplete')
  }
  const onEndPlaceChanged = () => {
    console.log('onEndPlaceChanged')
    const ac = endAutocompleteRef.current
    if (!ac) return
    const place = ac.getPlace()
    if (!place.geometry) return
    if (!place.geometry.location) return
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    console.log('end place lat :', lat)
    console.log('end place lng :', lng)
    applyPoint(lat, lng, 'endAutocomplete')
  }
  if (!isLoaded) return (<p>... google map loading</p>)
  return (
    <>
      {isLoaded && (
        <>
          <Autocomplete onLoad={(ref) => (startAutocompleteRef.current = ref)} onPlaceChanged={onStartPlaceChanged}>
            <input ref={startInputRef} type="text" placeholder="start route" className="form-control mb-3" />
          </Autocomplete>
          <Autocomplete onLoad={(ref) => (endAutocompleteRef.current = ref)} onPlaceChanged={onEndPlaceChanged}>
            <input ref={endInputRef} disabled={!start} type="text" placeholder="end route" className="form-control mb-3" />
          </Autocomplete>
          <BaseGoogleMap mapHandleClick={mapHandleClick}>
            {() => (<>
              {!directions && start && <Marker position={start} label="A" />}
              {!directions && end && <Marker position={end} label="B" />}
              {directions && <DirectionsRenderer directions={directions} />}
            </>)}
          </BaseGoogleMap>
        </>
      )}
    </>
  )
}

const MemoRouteGoogleMapWrapper = React.memo(RouteGoogleMapWrapper) as (props: RouteGoogleMapWrapperProps) => React.JSX.Element
export default MemoRouteGoogleMapWrapper