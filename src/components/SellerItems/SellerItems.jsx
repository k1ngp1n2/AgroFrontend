import './SellerItems.scss';

import React, { PureComponent } from 'react';
import MyOrdersIcon from '@material-ui/icons/DateRange';
import Button from '@material-ui/core/Button/Button';
import IconButton from '@material-ui/core/IconButton';
import FirstPage from '@material-ui/icons/FirstPage';
import PrevPage from '@material-ui/icons/ChevronLeft';
import NextPage from '@material-ui/icons/ChevronRight';
import LastPage from '@material-ui/icons/LastPage';
import PropTypes from 'prop-types';

import SellerItem from 'components/SellerItem';
import {serverAddress} from 'constants/ServerAddress';

// Данные для кнопки Добавить объявление
const newSellButton = {
  id: 'sell_item',
  name: 'Добавить товар',
};

/**
 * Класс SellerItems - компонент, отображающий список продаваемых товаров на странице продавца
 */
export default class SellerItems extends PureComponent {
  constructor(props) {
    super(props);
    
    // значения полей, используемых в render()
    this.state = {
      sellerItems: {},
      itemsForSell: 0,
      itemsLoaded: false,
      // текущая страница
      currentPage: 1,
      // последняя страница
      lastPage: 1,
      firstPageEnable: false,
      prevPageEnable: false,
      nextPageEnable: false,
      lastPageEnable: false,
    };
  }

  // Проверка свойств
  static propTypes = {
    // Функция отображения формы редактирования или создания товара
    itemHandle: PropTypes.func,
    jwtToken: PropTypes.string,
    getID: PropTypes.func,
    id: PropTypes.number,
  };

  componentDidMount() {
    const {jwtToken} = this.props;
    fetch(`${serverAddress}/api/producer/products`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        const lastPage = res.result.pagination.last_page;
        this.setState(
          prevState => {
            return {
              ...prevState,
              sellerItems: res.result,
              lastPage: lastPage,
              nextPageEnable: lastPage > 1,
              lastPageEnable: lastPage > 1,
            };
          }
        );
      },
      error => {
        this.setState({
          itemsLoaded: true,
          error,
        });
      })
      .then(
        () => fetch(`${serverAddress}/api/producer/dashboard`, {
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
                    itemsForSell: res.result.dashboard.products_count,
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
            }));
  }

  // обработка щелчков по кнопке Удалить товар
  handleDeleteItem = item_id => {
    const { currentPage } = this.state;
    const { jwtToken } = this.props;
    this.setState(
      prevState => {
        return {
          ...prevState,
          itemsLoaded: false,
        };
      }
    );
    fetch(`${serverAddress}/api/producer/products/${item_id}`, {
      method: 'delete',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    })
      .then(() => {
        this.changeList(currentPage);
      });
  };

  changeList = page => {
    const { jwtToken } = this.props;
    this.setState(
      prevState => {
        return {
          ...prevState,
          itemsLoaded: false,
        };
      }
    );
    fetch(`${serverAddress}/api/producer/products?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        const lastPage = res.result.pagination.last_page;
        this.setState(
          prevState => {
            return {
              ...prevState,
              currentPage: page,
              lastPage: lastPage,
              firstPageEnable: page > 1,
              prevPageEnable: page > 1,
              nextPageEnable: page < lastPage,
              lastPageEnable: page < lastPage,
              sellerItems: res.result,
              itemsLoaded: true,
            };
          }
        );
          if (res.result.products.length === 0 && page > 1 && this.state.lastPage > 1) {
            this.changeList(page - 1);
          }
          else
          if (res.result.products.length === 0 && page === 1 && this.state.lastPage > 1) {
            this.changeList(page + 1);
          }
      },
      error => {
        this.setState({
          itemsLoaded: true,
          error,
        });
      });
  };

  render() {
    const { error, sellerItems, itemsLoaded, itemsForSell, currentPage, lastPage, firstPageEnable, prevPageEnable, nextPageEnable, lastPageEnable } = this.state;
    const { itemHandle, getID } = this.props;
    let paginationButtons = '';
    if (error) {
      return <p>Ошибка: {error.message}</p>;
    }
    else
      if (!itemsLoaded) {
        return <p className="load_info">Пожалуйста, подождите, идет загрузка страницы</p>;
      }
      else {
        let content;
        if (sellerItems === undefined || sellerItems.length === 0 || sellerItems.products === undefined || sellerItems.products.length === 0) {
          content = <div className="load_info">
            <div/>
            <p>Вы можете добавить товары на продажу с помощью кнопки {newSellButton.name}</p>
          </div>;
        }
        else {
          if (lastPage > 1) {
            paginationButtons = (
              <div className="pagination">
                <IconButton
                  disabled={!firstPageEnable}
                  onClick={() => this.changeList(1)}
                >
                  <FirstPage/>
                </IconButton>
                <IconButton
                  disabled={!prevPageEnable}
                  onClick={() => this.changeList(currentPage - 1)}
                >
                  <PrevPage/>
                </IconButton>
                <span className="currentPage">
                  {currentPage}
                </span>
                <IconButton
                  disabled={!nextPageEnable}
                  onClick={() => this.changeList(currentPage + 1)}
                >
                  <NextPage/>
                </IconButton>
                <IconButton
                  disabled={!lastPageEnable}
                  onClick={() => this.changeList(lastPage)}
                >
                  <LastPage/>
                </IconButton>
              </div>
            );
          }
          content = sellerItems.products.map((item, idx) => {
            return (
              <SellerItem
                item={item}
                key={idx}
                itemHandle={itemHandle}
                getID={getID}
                handleDeleteItem={this.handleDeleteItem}
              />
            );
          });
        }
        return (
          <div className="seller_items">
            <div className="seller_items_header">
              <MyOrdersIcon className="my_orders_icon"/>
              <h2>Товары, выставленные на продажу</h2>
            </div>
            {content}
            {paginationButtons}
            <p className="total_items">
              Всего на продажу выставлено {itemsForSell} товаров.
            </p>
            <p>
              <Button
                className="sell_button"
                variant="contained"
                color="primary"
                id={newSellButton.id}
                onClick={() => itemHandle('new_product')}
              >
                {newSellButton.name}
              </Button>
            </p>
          </div>
        );
      }

  }
}