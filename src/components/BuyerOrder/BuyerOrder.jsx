import './BuyerOrder.scss';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MyOrdersIcon from '@material-ui/icons/DateRange';
import moment from 'moment';

import { serverAddress } from 'constants/ServerAddress';
import OrderStatus from 'components/OrderStatus';
import Loading from 'components/Loading';

/**
 * Класс BuyerOrder - компонент, отображающий подробные сведения о заказе на странице покупателя
 */
export default class BuyerOrder extends PureComponent {
  constructor(props) {
    super(props);

    // значения полей, используемых в render()
    this.state = {
      order: {},
      itemsLoaded: false,
      orderStatus: '',
    };
  }

  // Проверка свойств
  static propTypes = {
    id: PropTypes.number,
    jwtToken: PropTypes.string,
  };

  componentDidMount() {
    const { id, jwtToken } = this.props;
    fetch(`${serverAddress}/api/member/asks/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(res => res.json())
      .then(
        res => {
          this.setState(prevState => {
            return {
              ...prevState,
              order: res.result.ask,
              itemsLoaded: true,
              orderStatus: res.result.ask.status,
            };
          });
        },
        error => {
          this.setState({
            itemsLoaded: true,
            error,
          });
        },
      );
  }

  render() {
    const { error, order, itemsLoaded, orderStatus } = this.state;
    const rub = ' руб.';
    let content = '';
    moment.locale('ru');

    if (error) {
      return <p>Ошибка: {error.message}</p>;
    } else if (!itemsLoaded) {
      return <Loading />;
    } else {
      if (order.orders.length > 1)
        content = (
          <span className='seller_item'>
            Общая сумма заказа по всем продавцам:{' '}
            {order.sum.toLocaleString('ru') + rub}
          </span>
        );

      return (
        <div className='seller_items order_info'>
          <div className='seller_items_header'>
            <MyOrdersIcon className='my_orders_icon' />
            <h2>
              Заказ № {order.id} от {moment(order.date).format('LL')}
            </h2>
          </div>
          <OrderStatus orderStatus={orderStatus} />
          <div className='product seller_item'>
            <div>
              <span>Название продукта</span>
            </div>
            <div>
              <span>Количество</span>
            </div>
            <div>
              <span>Цена</span>
            </div>
            <div>
              <span>Сумма</span>
            </div>
          </div>
          {order.orders.map((items, index) => {
            return (
              <div key={index}>
                <span className='seller_status'>
                  {index + 1}. Статус заказа по продавцу{' '}
                  {items.order.producer_name} : {items.order.status}
                </span>
                {items.order.order_items.map((item, idx) => {
                  return (
                    <div className='product seller_item' key={idx}>
                      <div>
                        <span>{item.product_name}</span>
                      </div>
                      <div>
                        <span>{item.quantity}</span>
                      </div>
                      <div>
                        <span>
                          {item.product_price.toLocaleString('ru') + rub}
                        </span>
                      </div>
                      <div>
                        <span>{item.sum.toLocaleString('ru') + rub}</span>
                      </div>
                    </div>
                  );
                })}
                <span className='seller_item'>
                  Общая сумма заказа по продавцу:{' '}
                  {items.order.total.toLocaleString('ru') + rub}
                </span>
              </div>
            );
          })}
          <span className='seller_item'>
            Общая стоимость доставки заказа:{' '}
            {order.delivery_cost.toLocaleString('ru') + rub}
          </span>
          {content}
          <span className='seller_item'>
            Общая сумма заказа по всем продавцам с доставкой:{' '}
            {order.total.toLocaleString('ru') + rub}
          </span>
        </div>
      );
    }
  }
}
