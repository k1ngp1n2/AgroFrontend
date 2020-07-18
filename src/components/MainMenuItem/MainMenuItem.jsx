import './MainMenuItem.scss';

import React from 'react';
import { Link } from 'react-router-dom';
// Проверка свойств

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
