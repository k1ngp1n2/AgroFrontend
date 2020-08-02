/* eslint-disable no-undef */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import AboutPage from '.';

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

it('страница "О нас" запрашивает данные с сервера', async () => {
  const fakeData = {
    result: {
      page: {
        content: '## О нас',
      },
    },
  };
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeData),
    }),
  );
  await act(async () => {
    render(<AboutPage />, container);
  });
  expect(container.querySelector('h2').textContent).toBe('О нас');

  // выключаем фиктивный fetch, чтобы убедиться, что тесты полностью изолированы
  global.fetch.mockClear();
  delete global.fetch;
});
