import './OrderStatus.scss';

import React from 'react';

/**
 * Класс OrderStatus - компонент, отображающий статус заказа
 */
export default function OrderStatus(props) {
  const { orderStatus } = props;
  return (
    <p className='order_status'>Статус исполнения заказа: {orderStatus}</p>
  );
}
