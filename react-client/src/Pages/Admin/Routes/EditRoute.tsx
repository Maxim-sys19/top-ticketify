import React, {memo, useMemo} from 'react';
import EditRouteModal from '../../../Components/Modal/BaseModal';
import {IEditEntityProps} from '../../../interfaces/create-entitie-interfaces';
import EditForm from '../../../Components/Form/BaseForm'
import {routesFields} from './CreateRoute';
import {RoutesInputTypes} from '../../../interfaces/routes/route-handles-interface';
import {useUpdateRouteMutation} from '../../../redux/api/admin/routes/routes.api.service';
import {parseErrors} from '../../../helpers/parseErrors';
import RouteFormWrapper from "./RouteFormWrapper";

function EditRoute<T extends Record<string, any>>({entity, show, onClose}: IEditEntityProps<T>) {
  const [updateRoute, {error, isLoading}] = useUpdateRouteMutation()
  const errors = error && parseErrors(error)
  const initialValues = useMemo(() => {
    return {
      start: entity?.start,
      end: entity?.end,
      departureTime: entity?.departureTime,
      arrivalTime: entity?.arrivalTime
    }
  }, [entity?.start, entity?.end, entity?.departureTime, entity?.arrivalTime])
  const handleUpdate = async (body: RoutesInputTypes) => {
    const data = {
      id: entity?.id,
      ...body,
      departureTime: typeof body.departureTime === 'string' ? new Date(body.departureTime)?.toISOString() : body.departureTime?.toISOString(),
      arrivalTime: typeof body.arrivalTime === 'string' ? new Date(body.arrivalTime)?.toISOString() : body.arrivalTime?.toISOString(),
    }
    await updateRoute(data)
  }
  return (<></>
    // <EditRouteModal title="Edit Route" show={show} backdrop="static" onHide={onClose}>
    //   <RouteFormWrapper<RoutesInputTypes>
    //     errors={errors}
    //     fields={routesFields}
    //     initialValue={initialValues}
    //     buttonSubmitTitle="Update Route"
    //     loading={isLoading}
    //     onSubmit={handleUpdate}
    //   />
    // </EditRouteModal>
  )
}

export default memo(EditRoute) as <T extends Record<string, any>>(props: IEditEntityProps<T>) => JSX.Element;