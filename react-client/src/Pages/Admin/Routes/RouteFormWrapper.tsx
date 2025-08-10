import React, {memo, useMemo, useRef} from 'react';
import BaseForm from "../../../Components/Form/BaseForm";
import {FormComponentPropTypes} from "../../../Components/Form/FormComponentPropTypes";
import {RoutesInputTypes} from "../../../interfaces/routes/route-handles-interface";
import {useFormHandlers} from "../../../hooks/useFormHandlers";
import RouteGoogleMapWrapper from "./RouteGoogleMapWrapper";
import {useGoogleMapHandlers} from "../../../hooks/useGoogleMapHandlers";

function RouteFormWrapper<T extends RoutesInputTypes>({
                                                        loading,
                                                        fields,
                                                        selectValues,
                                                        // initialValue,
                                                        onSubmit,
                                                        buttonSubmitTitle,
                                                        errors,
                                                        done
                                                      }: FormComponentPropTypes<T>) {
  // console.log(2)
  const memoInitialValues: RoutesInputTypes = useMemo(() => ({
    routeName: '',
    start: null,
    end: null,
    departureTime: new Date(),
    arrivalTime: new Date(),
  }), [])
  const {
    handleSubmit,
    memoHandleDateChange,
    handleChange,
    values,
    setValues
  } = useFormHandlers<RoutesInputTypes>({
    initialValue: memoInitialValues, onSubmit, onDone: done, validators: {
      arrivalTime: (val, prev): Partial<T> => {
        if (val) {
          const selectedDate = new Date(val)
          selectedDate.setHours(0, 0, 0, 0)
          if (selectedDate < prev.departureTime!) {
            return {arrivalTime: prev.departureTime} as Partial<T>
          }
        }
        return {}
      },
      departureTime: (val, prev) => {
        if (val) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const selectedDate = new Date(val)
          selectedDate.setHours(0, 0, 0, 0)
          if (selectedDate < today) {
            return {departureTime: prev.departureTime}
          }
        }
        return {}
      }
    }
  })
  const stableInitialStartEnd = useRef({
    start: values.start,
    end: values.end
  });
  const memoValues = useMemo(() => ({
    routeName: values.routeName,
    departureTime: values.departureTime,
    arrivalTime: values.arrivalTime,
  }), [values.routeName, values.departureTime, values.arrivalTime])
  const {
    routes,
    mapHandleClick,
    clearDirection,
    directions,
    isLoaded,
    applyPoint
  } = useGoogleMapHandlers<Pick<T, 'start' | 'end'>>({
    initialRoutes: {start: stableInitialStartEnd.current.start, end: stableInitialStartEnd.current.end},
    onPointChange: (pointType, latLng) => {
      if(pointType === 'start') {
        setValues((prev) => ({
          ...prev,
          start: latLng,
        }))
      } else if (pointType === 'end') {
        setValues((prev) => {
          return {
            ...prev,
            end: latLng,
          }
        })
      }
    }
  })
  return <>
    <RouteGoogleMapWrapper
      start={routes.start}
      end={routes.end}
      directions={directions}
      isLoaded={isLoaded}
      mapHandleClick={mapHandleClick}
      clearDirection={clearDirection}
      applyPoint={applyPoint}
    />
    <BaseForm<RoutesInputTypes>
      buttonSubmitTitle={buttonSubmitTitle}
      loading={loading}
      values={memoValues}
      onChange={handleChange}
      memoHandleDateChange={memoHandleDateChange}
      fields={fields}
      onSubmit={handleSubmit}
      errors={errors}
      selectValues={selectValues}
    />
  </>
}

const MemoRouteFormWrapper = memo(RouteFormWrapper) as <T>(props: FormComponentPropTypes<T>) => React.JSX.Element;
export default MemoRouteFormWrapper