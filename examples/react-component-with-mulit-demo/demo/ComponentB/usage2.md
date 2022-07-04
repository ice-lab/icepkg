---
title: Example Usage
order: 2
---

本 Demo 演示一行文字的用法。

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ComponentB } from 'example-component';

class App extends Component {
  render() {
    return (
      <div>
        <ComponentB />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
