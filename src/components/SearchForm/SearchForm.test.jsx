/* eslint-disable no-undef */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';

import SearchForm from '.';

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

it('SearchForm обрабатывает ввод текста в строке поиска', () => {
  const handleOnSend = jest.fn();
  act(() => {
    render(<SearchForm onSend={handleOnSend} />, container);
  });

  // получаем элемент button и кликаем на него 1 раз
  const button = document.getElementById('search');
  expect(button.innerHTML).toContain('Найти');

  // Нажимаем мышью на кнопку для отправки запроса поиска
  Simulate.click(button);
  // пустая строка не ищется
  expect(handleOnSend).toHaveBeenCalledTimes(0);

  // получаем элемент input
  const row = document.getElementById('search_row');
  // вводим в него символ 'a'
  row.value = 'a';
  Simulate.change(row);
  expect(row.value).toBe('a');

  // Нажимаем мышью на кнопку для отправки запроса поиска
  Simulate.click(button);
  expect(handleOnSend).toHaveBeenCalledTimes(1);
  expect(row.value).toBe('a');

  // Нажимаем Enter для отправки запроса поиска
  Simulate.keyDown(row, {
    key: 'Enter',
    keyCode: 13,
    which: 13,
  });
  expect(handleOnSend).toHaveBeenCalledTimes(2);

  // Нажимаем мышью на кнопку для отправки запроса поиска
  Simulate.click(button);
  expect(handleOnSend).toHaveBeenCalledTimes(3);

  // Очищаем строку запроса
  row.value = '';
  Simulate.change(row);
  expect(row.value).toBe('');
  Simulate.keyDown(row, {
    key: 'Enter',
    keyCode: 13,
    which: 13,
  });
  // пустые запросы не отправляются
  expect(handleOnSend).toHaveBeenCalledTimes(3);
  Simulate.click(button);
  expect(handleOnSend).toHaveBeenCalledTimes(3);
});
