import './MainMenuItem.scss';

import React from 'react';
import { Link } from 'react-router-dom';
// Проверка свойств
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';

/**
 * Класс MainMenuItem - компонент, отображающий элемент меню в шапке страницы
 */
export default function MainMenuItem(props) {
  // получаем переданные свойства пункта главного меню сайта
  const { item } = props;
  return (
    <Tab
      component={Link}
      label={item.title}
      to={item.url}
      className={item.class}
      {...props}
    />
  );
}
MainMenuItem.propTypes = {
  // Пункты меню - массив объектов
  item: PropTypes.shape({
    // название пункта
    name: PropTypes.string,
    // адрес
    path: PropTypes.string,
  }),
};
