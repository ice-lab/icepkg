import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import Block from '@/block';

const mountNode = document.querySelector('#mountNode');
ReactDOM.render(<Block />, mountNode);
