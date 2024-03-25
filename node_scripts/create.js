const { generateTemplateFiles } = require('generate-template-files');

generateTemplateFiles([
  {
    option: 'HTML-страница (Обычная)',
    defaultCase: '(kebabCase)',
    entry: {
      folderPath: './config/template/page-template.html',
    },
    stringReplacers: [{ question: 'Название страницы', slot: '__name__' }],
    output: {
      overwrite: true,
      pathAndFileNameDefaultCase: '(kebabCase)',
      path: './src/page-__name__.html',
    },
  },
  {
    option: 'HTML-страница (Внутренняя)',
    defaultCase: '(kebabCase)',
    entry: {
      folderPath: './config/single-template.html',
    },
    stringReplacers: [{ question: 'Название страницы', slot: '__name__' }],
    output: {
      overwrite: true,
      pathAndFileNameDefaultCase: '(kebabCase)',
      path: './src/single-__name__.html',
    },
  },
]);