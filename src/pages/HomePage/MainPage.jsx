import './MainPage.scss';

import React, { PureComponent } from 'react';
import LeftMenu from 'components/LeftMenu';
import SearchForm from 'components/SearchForm';
import CatalogList from 'components/CatalogList';
import CatalogItem from 'components/CatalogItem';
import {serverAddress} from 'constants/ServerAddress';
import PropTypes from 'prop-types';

/**
 * Класс HomePage - компонент, отображающий главную страницу
 */
export default class MainPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // пункты меню каталога
      menuItems: [],
      // состояние загрузки пунктов меню каталога
      menuLoaded: false,
      // при входе на страницу ни один из разделов каталога не выбран, загружается случайный набор товаров
      openedSection: '/api/products?scope=samples',
      // адрес открытого товара каталога
      openedItem: '',
      // ошибка загрузки
      error: null,
      // TODO добавить пагинацию для вывода товаров каталога
      // флаг включения пагинации on / off
      pagination: 'off',
      // режим отображения catalogList / catalogItem
      mode: 'catalogList',
    };
  }

  // Проверка свойств
  static propTypes = {
    // ID корзины на сервере
    basketID: PropTypes.number,
  };

  componentDidMount() {
    fetch(`${serverAddress}/api/categories`)
      .then(res => res.json())
      .then(res => {
        this.setState(
          prevState => {
            return {
              ...prevState,
              menuItems: res.result,
              menuLoaded: true,
            };
          }
        );
      },
      error => {
        this.setState({
          menuLoaded: true,
          error,
        });
      });
  }

  handleItemSearch = template => {
    this.setState(
      prevState => {
        return {
          ...prevState,
          // загружаем найденные товары
          openedSection: `/api/products?search=${template.item}`,
          // переходим в режим отображения Каталог товаров
          mode: 'catalogList',
        };
      }
    );
  };

  /**
   * Получает из LeftMenu и сохраняет в state адрес текущего открытого раздела каталога товаров
   * @param sectionID id выбранного пользователем раздела каталога товаров
   */
  changeSection = sectionID => {
    this.setState(
      prevState => {
        return {
          ...prevState,
          openedSection: `/api/categories/${sectionID}/products`,
          // переходим в режим отображения Каталог товаров
          mode: 'catalogList',
        };
      }
    );
  };

  // Пользователь открывает карточку товара
  openItem = (event, itemID) => {
    this.setState(
      prevState => {
        return {
          ...prevState,
          openedItem: `/api/products/${itemID}`,
          // переходим в режим отображения Карточки товара
          mode: 'catalogItem',
        };
      }
    );
  };

  // Пользователь возвращается в каталог из просмотра карточки товара
  closeItem = () => {
    this.setState(
      prevState => {
        return {
          ...prevState,
          openedItem: '',
          // переходим в режим отображения Каталога товаров
          mode: 'catalogList',
        };
      }
    );
  };

  render() {
    const { error, menuLoaded, menuItems, openedSection, mode, openedItem } = this.state;
    const { basketID } = this.props;
    if (error) {
      return <p>Ошибка: {error.message}</p>;
    }
    else
      if (!menuLoaded) {
        return <p className="load_info">Пожалуйста, подождите, идет загрузка страницы</p>;
      }
      else {
        let content;
        if (mode === 'catalogList') {
          content = <CatalogList section={openedSection} itemHandle={this.openItem}/>;
        }
        if (mode === 'catalogItem') {
          content = <CatalogItem item={openedItem} actionBack={this.closeItem} basketID={basketID}/>;
        }
        return (
          <div className="main_page">
            <div/>
            <LeftMenu menu={menuItems} section={this.changeSection} className="left_menu"/>
            <div>
              <SearchForm onSend={this.handleItemSearch}/>
              {content}
            </div>
            <div/>
          </div>
        );
      }
  }
}