/* eslint-disable no-undef */
// Работа с файловой системой
const path = require('path');
// Доступ к плагинам webpack
const webpack = require('webpack');
// Плагин для извлечения css в отдельные файлы
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  // точки входа
  entry: {
    // путь к точке входа - исходнику
    main: path.resolve(__dirname, 'src', 'index.jsx'),
  },
  output: {
    filename: 'bundle.js',
    // папка для выгрузки результатов сборки
    path: path.resolve(__dirname, 'dist'),
    // determine where the bundles should be served from
    publicPath: '/',
  },
  devtool: '#sourcemap',
  devServer: {
    // Tell the server where to serve content from, if you want to serve static files
    contentBase: path.join(__dirname, 'dist'),
    // Enable gzip compression
    compress: true,
    // using the HTML5 History API
    historyApiFallback: true,
    // Enable Hot Module Replacement
    hot: true,
    // доступ к сайту из внешней сети
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: [
          // компиляция в babel
          'babel-loader',
          // проверка в eslint
          'eslint-loader',
        ],
      },
      {
        test: /\.s?css$/i,
        use: [
          {
            // Добавляем экспорт модуля в качестве стиля в DOM
            loader: 'style-loader',
          },
          {
            // Разбираем файлы CSS
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
              reloadAll: true,
            },
          },
          {
            // Загружаем файл CSS с разрешенным импортом и возвращает код CSS
            loader: 'css-loader',
          },
          {
            // оптимизируем css
            loader: 'clean-css-loader',
          },
          {
            // добавляем префиксы
            loader: 'postcss-loader',
          },
          {
            // загружаем и преобразуем scss-файлы в css
            loader: 'sass-loader',
          },
        ],
      },
      // настраиваем обработку изображений
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
            },
          },
        ],
      },
      // настраиваем обработку шрифтов
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [{ from: 'src/img', to: 'img' }],
    }),
  ],
  resolve: {
    alias: {
      // поддержка HMR для React
      'react-dom': '@hot-loader/react-dom',
      // адрес папки components
      components: path.resolve(__dirname, 'src', 'components'),
      // адрес папки containers
      containers: path.resolve(__dirname, 'src', 'containers'),
      // вспомогательные утилиты
      helpers: path.resolve(__dirname, 'src', 'helpers'),
      // адрес папки img
      img: path.resolve(__dirname, 'src', 'img'),
      // адрес папки actions
      actions: path.resolve(__dirname, 'src', 'actions'),
      // адрес папки reducers
      reducers: path.resolve(__dirname, 'src', 'reducers'),
      // адрес папки constants
      constants: path.resolve(__dirname, 'src', 'constants'),
      // адрес папки pages
      pages: path.resolve(__dirname, 'src', 'pages'),
      // адрес папки layouts
      layouts: path.resolve(__dirname, 'src', 'layouts'),
      // адрес папки для хранения json-заглушек
      mocks: path.resolve(__dirname, 'mocks'),
    },
    // очередность выбора расширения файла, если расширение файла не указано
    extensions: ['.js', '.jsx'],
  },
};
