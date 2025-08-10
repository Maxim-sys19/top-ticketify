import {useCallback, useEffect, useRef, useState} from 'react';
import {LatLngLiteral, RoutePoints} from "../interfaces/routes/route-handles-interface";
import {useJsApiLoader} from "@react-google-maps/api";

interface UseGoogleMapHandlersProps {
  initialRoutes: RoutePoints,
  onPointChange?: (pointType: 'start' | 'end', latLng: { lat: number, lng: number }) => void,
  onSetDirectionCallback?: (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => void,
}

export type SourceType = 'click' | 'startAutocomplete' | 'endAutocomplete'
const libraries: ("places")[] = ["places"];

export function useGoogleMapHandlers<T extends RoutePoints>({initialRoutes, onPointChange}: UseGoogleMapHandlersProps) {
  const [routes, setRoutes] = useState<T>({start: initialRoutes.start, end: initialRoutes.end} as T)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const clickStageRef = useRef<'start' | 'end'>('start');

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_PLACES_API_KEY! as string,
    libraries
  });

  const clearDirection = useCallback(() => {
    setDirections(null)
    setRoutes({start: null, end: null} as T)
    clickStageRef.current = 'start';
  }, [])

  const getDirections = useCallback((routePoints: RoutePoints) => {
    if (!routePoints.start || !routePoints.end) {
      clearDirection()
      return
    }
    clearDirection()
    let directionService = new google.maps.DirectionsService();
    directionService.route({
      destination: routePoints.end,
      origin: routePoints.start,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === 'OK' && result) {
        setDirections(result);
        setRoutes(routePoints as T);
      } else {
        clearDirection();
      }
    });
  }, [clearDirection])

  const applyPoint = useCallback((lat: number, lng: number, source: SourceType) => {
    if (source === 'startAutocomplete' || clickStageRef.current === 'start') {
      setRoutes((prev) => ({
        ...prev,
        start: {lat, lng},
        end: null,
      }))
      if (onPointChange) {
        onPointChange(clickStageRef.current, {lat, lng})
        clickStageRef.current = 'end';
      }
    } else if (source === 'endAutocomplete' || clickStageRef.current === 'end') {
      let newRoutes = {start: routes.start, end: {lat, lng}}
      if (onPointChange) {
        onPointChange(clickStageRef.current, {lat, lng})
        setRoutes(newRoutes as T)
        getDirections(newRoutes);
        clickStageRef.current = 'start';
      }
    }
  }, [getDirections, onPointChange, routes.start])
  const mapHandleClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    let lat = e.latLng.lat()
    let lng = e.latLng.lng()
    applyPoint(lat, lng, 'click')
  }, [applyPoint])
  return {routes, mapHandleClick, clearDirection, directions, isLoaded, applyPoint}
}