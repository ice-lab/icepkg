## example-component

## Install

```
$ npm install example-component --save
```

## Usage

```
import ExampleComponent from 'example-component';
```

## API

### Props

|name|type|default|describe|
|:---------------|:--------|:----|:----------|
|name|String|''|describe|

### Function

|name|param|return|describe|
|:---------------|:--------|:----|:----------|
|name|Object|/|describe|

## Example

```
import { createElement, render } from 'rax';
import DriverUniversal from 'driver-universal';
import ExampleComponent from 'example-component';

render(<ExampleComponent />, document.body, { driver: DriverUniversal });
```
