const requireDir = require('require-dir');

const path = {
  dist: './dist/',
  layout: {
    folder: {
      build: './dist/',
    },
    name: '*.html',
  },
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
  scripts: {
    folder: {
      build: './dist/js/',
      theme: './dist/assets/js/',
    },
    name: 'bundle.js',
  }
};

module.exports = path;
requireDir('./gulp_tasks/');