import './BuyerItem.scss';

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button/Button';
import moment from 'moment';

// Данные для кнопки Открыть заказ
const openOrderButton = {
  id: 'open_buy_order',
  name: 'Открыть заказ',
};

/**
 * Класс BuyerItem - компонент, отображающий строку со сведениями о заказе на странице покупателя
 */
export default function BuyerItem(props) {
  const { item, showOrderInfo } = props;
  const date = moment(item.ask.date).format('DD.MM.YY HH:mm');

  return (
    <p className='buyer_item'>
      <span className='order_date'>{date}</span>
      <span className='order_total'>
        Заказ на сумму {item.ask.total.toLocaleString('ru')} руб.
      </span>
      <span className='open_order'>
        <Button
          className='open_order_button'
          variant='contained'
          color='primary'
          id={openOrderButton.id}
          onClick={() => showOrderInfo(item.ask.id)}
        >
          {openOrderButton.name}
        </Button>
      </span>
    </p>
  );
}
BuyerItem.propTypes = {
  // Пункты меню - массив объектов
  item: PropTypes.shape({
    // время заказа
    date: PropTypes.string,
    // общая стоимость заказа
    total: PropTypes.string,
    // состояние заказа
    status: PropTypes.string,
    // ссылка на заказ
    link: PropTypes.string,
  }),
  // Функция отображения сведений о заказе
  showOrderInfo: PropTypes.func,
};
