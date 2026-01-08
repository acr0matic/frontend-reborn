module.exports = ({ env }) => ({
  syntax: 'postcss-scss',
  map: true,
  plugins: {
    autoprefixer: {},
    ...(env === 'production' && {
      'postcss-sort-media-queries': {},
      cssnano: {
        preset: ['advanced', {
          reduceIdents: false,
          zindex: false,
          mergeIdents: false,
          autoprefixer: false,
          normalizePositions: false,
        }],
      },
    }),
  },
});
