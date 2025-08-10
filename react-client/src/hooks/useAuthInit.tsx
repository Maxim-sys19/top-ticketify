import {useCallback, useEffect, useRef} from "react";
import {profileAction} from "../redux/api/profile/profile.api.service";
import {useAppDispatch, useAppSelector} from "./useApiHooks"
const durationRefetchInterval = 5 * 60 * 1000;
export function useAuthInit() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.jwtToken.token)
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  const fetchProfile = useCallback(async () => {
    await dispatch(profileAction());
  }, [dispatch]);
  const startInterval = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      dispatch(profileAction());
    }, durationRefetchInterval)
  }, [dispatch])
  useEffect(() => {
    if (token) {
      fetchProfile()
      startInterval()
      const handleVisibility = () => {
        if(document.visibilityState === 'visible') {
          console.log('Visibility is visible')
          dispatch(profileAction());
          startInterval()
        } else {
          console.log('Visibility is not visible')
        }
      }
      window.addEventListener('visibilitychange', handleVisibility);
      return () => {
        window.removeEventListener("visibilitychange", handleVisibility)
      }
    }
  }, [token, fetchProfile, startInterval, dispatch])
}