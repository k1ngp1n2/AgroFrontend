import './SellerClients.scss';

import React, { PureComponent } from 'react';
import MyOrdersIcon from '@material-ui/icons/DateRange';
import PropTypes from 'prop-types';

import SellerClient from 'components/SellerClient';
import {serverAddress} from 'constants/ServerAddress';

/**
 * Класс SellerClients - компонент, отображающий клиентов на странице продавца
 */
export default class SellerClients extends PureComponent {
  constructor(props) {
    super(props);
    
    // значения полей, используемых в render()
    this.state = {
      // Клиенты
      clients: {},
      itemsLoaded: false,
    };
  }

  // Проверка свойств
  static propTypes = {
    // Функция отображения сведений о клиенте
    itemHandle: PropTypes.func,
    jwtToken: PropTypes.string,
  };

  componentDidMount() {
    const {jwtToken} = this.props;
    fetch(`${serverAddress}/api/producer/consumers`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    })
      .then(res => res.json())
      .then(res => {
          this.setState(
            prevState => {
              return {
                ...prevState,
                clients: res.result,
                itemsLoaded: true,
              };
            }
          );
        },
        error => {
          this.setState({
            itemsLoaded: true,
            error,
          });
        });
  }

  render() {
    const {error, clients, itemsLoaded} = this.state;
    const {itemHandle} = this.props;
    if (error) {
      return <p>Ошибка: {error.message}</p>;
    }
    else if (!itemsLoaded) {
      return <p className="load_info">Пожалуйста, подождите, идет загрузка страницы</p>;
    }
    else {
      let content;
      if (clients === undefined || clients.length === 0 || clients.consumers === undefined || clients.consumers.length === 0) {
        content = <div className="load_info">
          <div/>
          <p>К сожалению у Вас еще не было покупателей.</p>
        </div>;
      }
      else
        content = (clients.consumers.map((item, idx) => {
          return (
            <SellerClient item={item} key={idx} itemHandle={itemHandle}/>
          );
        }));
      return (
        <div className="seller_items">
          <div className="seller_items_header">
            <MyOrdersIcon className="my_orders_icon"/>
            <h2>Мои покупатели</h2>
          </div>
          {content}
        </div>
      );
    }
  }
}