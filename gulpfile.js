const requireDir = require('require-dir');

const path = {
  dist: './dist/',
  style: {
    folder: {
      build: './dist/css/',
      theme: './dist/',
    },
    name: {
      build: 'main.css',
      theme: 'style.css',
    },
  },
};

module.exports = path;
requireDir('./gulp_tasks/');