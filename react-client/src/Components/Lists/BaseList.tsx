import React from 'react';
import {ListGroup} from 'react-bootstrap';

export interface IBaseList<T> {
  data: T[] | null
  renderItem?: (item: T, index: number) => React.ReactNode
  keyExtractor?: (item: T) => string | number
}

function BaseList<T>({data, keyExtractor, renderItem}: IBaseList<T>) {
  return (
    <ListGroup>
      {data?.map((item: T, index: number) => {
        let key = keyExtractor ? keyExtractor(item) : index;
        return <ListGroup.Item key={key}>{renderItem !== undefined && renderItem(item, index)}</ListGroup.Item>
      })}
    </ListGroup>
  )
}

export default BaseList;