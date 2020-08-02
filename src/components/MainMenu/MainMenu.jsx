import './MainMenu.scss';

import React from 'react';
// Проверка свойств
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import MainMenuItem from 'components/MainMenuItem';

const menu = [
  {
    class: 'goto_about',
    title: 'О нас',
    url: '/about',
  },
  {
    class: 'goto_sellers',
    title: 'Продавцам',
    url: '/sellers',
  },
  {
    class: 'goto_buyers',
    title: 'Покупателям',
    url: '/buyers',
  },
  {
    class: 'goto_delivery',
    title: 'Доставка и оплата',
    url: '/delivery',
  },
];

/**
 * Класс MainMenu - компонент, отображающий главное меню в шапке на всех страницах сайта
 */
export default function MainMenu(props) {
  const { indicator, handleChange } = props;
  return (
    <Tabs
      variant='fullWidth'
      className='main_menu'
      value={indicator}
      onChange={handleChange}
      centered
    >
      {menu.map((item, idx) => {
        return <MainMenuItem item={item} key={idx} />;
      })}
    </Tabs>
  );
}

MainMenu.propTypes = {
  // активный пункт меню
  indicator: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  // функция выбора активного пункта меню
  handleChange: PropTypes.func,
};
