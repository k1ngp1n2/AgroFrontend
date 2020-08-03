/* eslint-disable no-undef */
// Работа с файловой системой
const path = require('path');
// Плагин для извлечения css в отдельные файлы
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// анализатор бандла
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
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
  stats: {
    colors: true,
    reasons: true,
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
        loader: [
          // Добавляем экспорт модуля в качестве стиля в DOM
          'style-loader',
          // Разбираем файлы CSS
          MiniCssExtractPlugin.loader,
          // Загружаем файл CSS с разрешенным импортом и возвращает код CSS
          'css-loader',
          // оптимизируем css
          'clean-css-loader',
          // добавляем префиксы
          'postcss-loader',
          // загружаем и преобразуем scss-файлы в css
          'sass-loader',
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
    new MiniCssExtractPlugin(),
    // если скрипт запущен с параметром ANALYZE (см. package.json), то анализируем
    // состав бандла
    process.env.ANALYZE ? new BundleAnalyzerPlugin() : function() {},
    new CopyPlugin({
      patterns: [{ from: 'src/img', to: 'img' }],
    }),
  ],
  resolve: {
    alias: {
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
