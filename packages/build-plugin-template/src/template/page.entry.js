import 'core-js/stable';
import 'regenerator-runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import Page from '@/page';

console.log(Page);
const mountNode = document.querySelector('#mountNode');
ReactDOM.render(
  <Page />,
  mountNode,
);
