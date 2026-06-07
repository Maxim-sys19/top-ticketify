import React, {useCallback, useMemo} from 'react';
import {Button} from 'react-bootstrap';
import CreateRouteModal from "../../../Components/Modal/BaseModal"
import useOpenModal from "../../../hooks/useOpenModal";
import {useCreateRouteMutation} from "../../../redux/api/admin/routes/routes.api.service";
import {parseErrors} from "../../../helpers/parseErrors";
import {CreateRouteInputTypes} from '../../../interfaces/routes/route-handles-interface';
import RouteFormWrapper from "./RouteFormWrapper";
import {createRouteFields} from "./inputFields/createRouteFields";
import {
  useGetAllCompaniesWithTransportsAndSeatsQuery
} from "../../../redux/api/admin/company/company.with.transports.api.service";


function CreateRoute() {
  const {data: companies} = useGetAllCompaniesWithTransportsAndSeatsQuery({})

  const [createRoute, {isLoading, error, data}] = useCreateRouteMutation()
  const errors = parseErrors(error)
  const done = data && data === true
  const {show, close, open} = useOpenModal()
  const submitHandler = useCallback(async (value: CreateRouteInputTypes) => {
    const data = {
      ...value,
      departureTime: value.departureTime?.toISOString(),
      arrivalTime: value.arrivalTime?.toISOString(),
      company: {id: Number(value.company?.id)},
      transports: value.company?.transports?.map((t) => ({id: Number(t.id), seatIds: t.seatIds})) ?? [],
    }
    await createRoute(data)
  }, [createRoute])
  const initialValue = useMemo<CreateRouteInputTypes>(() => ({
    routeName: '',
    start: null,
    end: null,
    departureTime: new Date(),
    arrivalTime: new Date(),
    company: {id: 0, transports: [{id: 0, seatIds: []}],},
  }), [])
  return (
    <div>
      <Button onClick={() => open('create')}>+</Button>
      <CreateRouteModal backdrop="static" title="Create route" show={show === 'create'} onHide={close}>
        <>
          <RouteFormWrapper<CreateRouteInputTypes>
            done={done}
            errors={errors}
            fields={createRouteFields}
            loading={isLoading}
            buttonSubmitTitle="create route"
            initialValue={initialValue}
            onSubmit={submitHandler}
            selectValues={companies as any[]}
          />
        </>
      </CreateRouteModal>
    </div>
  );
}

export default CreateRoute;