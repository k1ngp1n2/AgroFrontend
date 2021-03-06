import About from 'pages/AboutPage';
import Buyers from 'pages/BuyersPage';
import Sellers from 'pages/SellersPage';
import Delivery from 'pages/DeliveryPage';

/**
 * Маршрутизация приложения
 */
export default [
  // О нас
  {
    path: '/about',
    component: About,
    exact: true,
  },
  // Продавцам
  {
    path: '/sellers',
    component: Sellers,
    exact: true,
  },
  // Покупателям
  {
    path: '/buyers',
    component: Buyers,
    exact: true,
  },
  // Доставка и оплата
  {
    path: '/delivery',
    component: Delivery,
    exact: true,
  },
];