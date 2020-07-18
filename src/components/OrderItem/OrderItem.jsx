import './OrderItem.scss';

import React from 'react';
import Button from '@material-ui/core/Button/Button';
import moment from 'moment';

// Данные для кнопки Открыть заказ
const openOrderButton = {
  id: 'open_sell_order',
  name: 'Открыть заказ',
};

/**
 * Класс OrderItem - компонент, отображающий строку со сведениями о заказе на странице продавца
 */
export default function OrderItem(props) {
  const { item, showOrderInfo } = props;
  const date = moment(item.order.date).format('DD.MM.YY HH:mm');

  return (
    <p className='seller_item'>
      <span className='order_date'>{date}</span>
      <span className='order_total'>
        Заказ на сумму {item.order.total.toLocaleString('ru')} руб.
      </span>
      <span className='open_order'>
        <Button
          className='edit_button'
          variant='contained'
          color='primary'
          id={openOrderButton.id}
          onClick={() => showOrderInfo(item.order.id)}
        >
          {openOrderButton.name}
        </Button>
      </span>
    </p>
  );
}
