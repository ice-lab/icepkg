import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import Block from '@/block';

const mountNode = document.querySelector('#mountNode');
// eslint-disable-next-line react/no-deprecated
ReactDOM.render(<Block />, mountNode);
