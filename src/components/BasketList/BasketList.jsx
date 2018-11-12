import './BasketList.scss';

import React, { PureComponent} from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteIcon from '@material-ui/icons/DeleteOutlineRounded';
import BasketIcon from '@material-ui/icons/ShoppingCartOutlined';
import {serverAddress} from 'constants/ServerAddress';
import PropTypes from 'prop-types';

/**
 * Класс BasketList - компонент, отображающий товары на странице Корзина
 */
export default class BasketList extends PureComponent {
  // Проверка свойств
  static propTypes = {
    // Описание товара - объект
    basketItems: PropTypes.shape({
      products: PropTypes.arrayOf(PropTypes.shape({
        // название товара
        product_name: PropTypes.string,
        // цена товара
        product_price: PropTypes.number,
        // количество товара
        product_quantity: PropTypes.number,
        // изображение товара
        product_image: PropTypes.string,
      })),
    }),
    // ID корзины на сервере
    basketID: PropTypes.number,
    // Функция увеличения количества товаров в корзине
    handleAddClick: PropTypes.func,
    // Функция уменьшения количества товаров в корзине
    handleRemoveClick: PropTypes.func,
    // Функция удаления товаров в корзине
    handleDeleteItem: PropTypes.func,
  };

  render() {
    const { basketItems, handleAddClick, handleRemoveClick, handleDeleteItem } = this.props;
      const sum = basketItems.products.map(item => {
        // создаем массив из произведений цены и количества товара
        return item.product_price * item.product_quantity;
      })
        .reduce((price, current) => {
          // складываем все цены созданного массива
          return price + current;
        });
      return (
        <div className="basket_list">
          <h2>
            <BasketIcon className="basket_icon"/>
            Корзина
          </h2>
          {basketItems.products.map((item, idx) => {
            return (
              <p key={idx}>
                <img
                  src={serverAddress + item.product_image}/>
                <span className="item_name">
                  {item.product_name}
                </span>
                <span className="item_price">
                  {item.product_price} руб.
                </span>
                <Button
                  variant="fab"
                  mini
                  color="secondary"
                  aria-label="Add"
                  onClick={() => handleAddClick(idx)}
                >
                  <AddIcon/>
                </Button>
                <span className="item_quantity">
                  {item.product_quantity}
                </span>
                <Button
                  variant="fab"
                  mini
                  color="secondary"
                  aria-label="Remove"
                  onClick={() => handleRemoveClick(idx)}
                >
                  <RemoveIcon/>
                </Button>
                <span className="item_full_price">
                  {item.product_price * item.product_quantity} руб.
                </span>
                <Button
                  variant="fab"
                  mini
                  color="secondary"
                  aria-label="Delete"
                  onClick={() => handleDeleteItem(idx)}
                >
                  <DeleteIcon/>
                </Button>
              </p>
            );
          })}
          <p className="order_total">
            Общая стоимость товаров в корзине: {sum} руб.
          </p>
        </div>
      );
  }
}