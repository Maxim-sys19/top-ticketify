import {useEffect, useMemo, useRef, useState} from 'react';
import {RoutePoints} from "../interfaces/routes/route-handles-interface";
import {useJsApiLoader} from "@react-google-maps/api";

interface UseGoogleMapHandlersProps {
  initialRoutes: RoutePoints,
  onPointChange?: (pointType: 'start' | 'end', latLng: { lat: number, lng: number }) => void,
  onSetDirectionCallback?: (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => void,
}

export type SourceType = 'click' | 'startAutocomplete' | 'endAutocomplete'
const libraries: ("places" | "marker")[] = ["places", "marker"];

export function useGoogleMapHandlers<T extends RoutePoints>({initialRoutes, onPointChange}: UseGoogleMapHandlersProps) {
  const [routes, setRoutes] = useState<T>({start: initialRoutes.start, end: initialRoutes.end} as T)
  const [mapIsReady, setMapIsReady] = useState<boolean>(false)
  const markerRef = useRef<any[]>([])
  const mapRef = useRef<google.maps.Map | null>(null)
  const directionRef = useRef<google.maps.DirectionsRenderer[]>([]);
  const clickStageRef = useRef<'start' | 'end'>('start');
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_PLACES_API_KEY! as string,
    libraries
  });

  const setMapInstance = (map: google.maps.Map) => {
    map.setOptions({
      mapId: process.env.REACT_APP_GOOGLE_MAP_ID!
    })
    mapRef.current = map
    setMapIsReady(true)
  }
  const clearMarkers = () => {
    markerRef.current.forEach((m) => m.setMap(null));
    markerRef.current = []
  }

  const clearDirection = () => {
    if (directionRef.current) {
      directionRef.current.forEach((d) => d.setMap(null))
      directionRef.current = []
    }
  }

  const clearAll = () => {
    clearMarkers()
    clearDirection()
    setRoutes({start: null, end: null} as T)
    clickStageRef.current = 'start';
  }

  const addMarker = (pos: google.maps.LatLngLiteral, label: string) => {
    if (!mapRef.current) return
    if (isLoaded) {
      const marker = new (google.maps as any).marker.AdvancedMarkerElement({
        position: pos,
        map: mapRef.current,
        title: label
      })
      markerRef.current.push(marker)
      return marker;
    }
  }

  const removeMakerByTitle = (title: string) => {
    markerRef.current.forEach((m) => {
      if(m.title === title) {
        m.setMap(null)
        return false
      }
      return true
    })
    markerRef.current = markerRef.current.filter((m) => m.title !== title)
  }

  const renderDirection = (start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral) => {
    if (!mapRef.current) return
    clearDirection()
    let directionService = new google.maps.DirectionsService();
    directionService.route({
      destination: end,
      origin: start,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === 'OK' && result) {
        const renderer = new google.maps.DirectionsRenderer({
          map: mapRef.current!,
          suppressMarkers: true
        })
        renderer.setDirections(result)
        directionRef.current.push(renderer)
        removeMakerByTitle("A")
        removeMakerByTitle("B")
        addMarker(start, "A");
        addMarker(end, "B");
      } else {
        clearAll();
      }
    })
  }

  const applyPoint = (lat: number, lng: number, source: SourceType) => {
    if (source === 'startAutocomplete' || clickStageRef.current === 'start') {
      removeMakerByTitle("A")
      addMarker({lat, lng}, 'A')
      setRoutes(prev => ({...prev, start: {lat, lng}}));
      if (onPointChange) {
        onPointChange(clickStageRef.current, {lat, lng})
      }
      clickStageRef.current = 'end';
    } else if (source === 'endAutocomplete' || clickStageRef.current === 'end') {
      removeMakerByTitle("B")
      addMarker({lat, lng}, 'B')
      setRoutes((prev) => {
        let newRoutes = {...prev, end: {lat, lng}}
        renderDirection(newRoutes.start!, newRoutes.end!)
        return newRoutes
      })
      if (onPointChange) {
        onPointChange(clickStageRef.current, {lat, lng})
      }
      clickStageRef.current = 'start';
    }
  }
  const mapHandleClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    let lat = e.latLng.lat()
    let lng = e.latLng.lng()
    applyPoint(lat, lng, 'click')
  }
  useEffect(() => {
    if (!isLoaded || !mapIsReady) return
    if (initialRoutes.start?.lat !== undefined &&
      initialRoutes.start?.lng !== undefined &&
      initialRoutes.end?.lat !== undefined &&
      initialRoutes.end?.lng !== undefined) {
      clearAll();
      renderDirection(initialRoutes.start, initialRoutes.end);
      setRoutes(initialRoutes as T);
    }
  }, [isLoaded, initialRoutes, mapIsReady]);
  const memoRoutes = useMemo(() => routes, [routes])
  return {routes: memoRoutes, mapHandleClick, clearAll, setMapInstance, isLoaded, applyPoint}
}