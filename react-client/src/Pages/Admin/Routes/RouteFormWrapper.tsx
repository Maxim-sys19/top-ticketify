import React, {memo, useMemo} from 'react';
import BaseForm from "../../../Components/Form/BaseForm";
import {FormComponentPropTypes} from "../../../Components/Form/FormComponentPropTypes";
import {CreateRouteInputTypes} from "../../../interfaces/routes/route-handles-interface";
import {useFormHandlers} from "../../../hooks/useFormHandlers";
import RouteGoogleMapWrapper from "./RouteGoogleMapWrapper";
import {useGoogleMapHandlers} from "../../../hooks/useGoogleMapHandlers";

function RouteFormWrapper<T extends CreateRouteInputTypes>({
                                                             loading,
                                                             fields,
                                                             selectValues,
                                                             initialValue,
                                                             onSubmit,
                                                             buttonSubmitTitle,
                                                             errors,
                                                             done
                                                           }: FormComponentPropTypes<T>) {
  const {
    handleSubmit,
    memoHandleDateChange,
    handleChange,
    values,
    setValues
  } = useFormHandlers<CreateRouteInputTypes>({
    initialValue, onSubmit, onDone: done, validators: {
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
  const stableInitialStartEnd = useMemo(() => ({
    start: initialValue.start,
    end: initialValue.end
  }), [initialValue.start, initialValue.end])
  const memoValues = useMemo(() => ({
    routeName: values.routeName,
    departureTime: values.departureTime,
    arrivalTime: values.arrivalTime,
    company: {
      id: values.company?.id,
      transports: values.company?.transports?.map((transport) => ({
        id: transport?.id,
        seatIds: transport?.seatIds
      })),
    },
  }), [values.routeName, values.departureTime, values.arrivalTime, values.company?.id, values.company?.transports])
  // console.log('values --- ', values)
  // console.log('memoValues :', memoValues)
  const {
    routes,
    mapHandleClick,
    isLoaded,
    setMapInstance,
    applyPoint
  } = useGoogleMapHandlers<Pick<T, 'start' | 'end'>>({
    initialRoutes: stableInitialStartEnd,
    onPointChange: (pointType, latLng) => {
      if (pointType === 'start') {
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
  if (!isLoaded) return <p>loading map...</p>
  return <>
    {isLoaded && <RouteGoogleMapWrapper
      setMapInstance={setMapInstance}
      start={routes.start}
      end={routes.end}
      // isLoaded={isLoaded}
      mapHandleClick={mapHandleClick}
      applyPoint={applyPoint}
    />}
    <BaseForm<CreateRouteInputTypes>
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