/* eslint-disable no-undef */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Footer from '.';

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

it('в футере показывается текущий год', () => {
  act(() => {
    render(<Footer />, container);
  });
  expect(container.textContent).toBe(
    `Ferma Store @ ${new Date().getFullYear()}`,
  );
});
