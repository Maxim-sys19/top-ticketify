import React, {memo, useMemo} from 'react';
import EditRouteModal from '../../../Components/Modal/BaseModal';
import {IEditEntityProps} from '../../../interfaces/create-entitie-interfaces';
import {routesFields} from './CreateRoute';
import {CreateRouteInputTypes} from '../../../interfaces/routes/route-handles-interface';
import {useUpdateRouteMutation} from '../../../redux/api/admin/routes/routes.api.service';
import {parseErrors} from '../../../helpers/parseErrors';
import RouteFormWrapper from "./RouteFormWrapper";

function EditRoute<T extends Record<string, any>>({entity, show, onClose}: IEditEntityProps<T>) {
  const [updateRoute, {error, isLoading}] = useUpdateRouteMutation()
  const errors = error && parseErrors(error)
  const initialValues = useMemo(() => {
    return {
      routeName: entity.routeName,
      start: {lat: entity.start.lat, lng: entity.start.lng},
      end: {lat: entity.end.lat, lng: entity.end.lng},
      departureTime: entity.departureTime,
      arrivalTime: entity.arrivalTime
    }
  }, [entity.start, entity.end, entity.departureTime, entity.arrivalTime, entity.routeName])
  // console.log(initialValues)
  const handleUpdate = async (body: CreateRouteInputTypes) => {
    const data = {
      id: entity!.id,
      ...body,
      routeName: body.routeName,
      departureTime: typeof body.departureTime === 'string' ? new Date(body.departureTime)?.toISOString() : body.departureTime?.toISOString(),
      arrivalTime: typeof body.arrivalTime === 'string' ? new Date(body.arrivalTime)?.toISOString() : body.arrivalTime?.toISOString(),
    }
    console.log('update route body :', data)
    await updateRoute(data)
  }
  return (
    <EditRouteModal title="Edit Route" show={show} backdrop="static" onHide={onClose}>
      <RouteFormWrapper<CreateRouteInputTypes>
        errors={errors}
        fields={routesFields}
        initialValue={initialValues}
        buttonSubmitTitle="Update Route"
        loading={isLoading}
        onSubmit={handleUpdate}
      />
    </EditRouteModal>
  )
}

export default memo(EditRoute) as <T extends Record<string, any>>(props: IEditEntityProps<T>) => JSX.Element;