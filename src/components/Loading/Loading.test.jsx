/* eslint-disable no-undef */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Loading from '.';

let container = null;
beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // подчищаем после завершения
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('Loading показывает сообщение о загрузке', () => {
  act(() => {
    render(<Loading />, container);
  });
  expect(container.textContent).toBe(
    'Пожалуйста, подождите, идет загрузка страницы',
  );
});
