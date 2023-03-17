# @ice/pkg

A fast builder for React components, Node modules and web libraries.

<figure style={{
  fontSize:'13px',
}}>
  <img src="https://img.alicdn.com/imgextra/i1/O1CN01MoY2ji23DGjyTw2Dh_!!6000000007221-2-tps-2972-638.png" alt="benchmark" />

<figcaption>Above: this benchmark approximates a large TypeScript codebase by using <a href="https://github.com/maoxiaoke/pkg-benchmark">ICE fusion pro</a> template.</figcaption>
</figure>

## Features

- **Fast**：Code compiled and minified by [swc](https://swc.rs/docs/configuration/swcrc).
- **Dual Mode**：Bundle mode to bundle everything up and transform mode to compile files one by one.
- **Zero Configuration**：Zero Configuration with Typescript and JSX support.
- **Modern Mode**：Outputs es2017 JavaScript specially designed to work in all modern browsers.
- **Doc Preview**：Enhanced doc preview, powered by [Docusaurus](https://docusaurus.io/).


## Quick Start

```bash
npm init @ice/pkg react-component

# Or pnpm
# pnpm create @ice/pkg react-component

cd react-component
npm run start
```

That's it. Start editing `src/index.tsx` and go!

## Documentation

For complete usages, please dive into the [docs](https://pkg.ice.work/).

## Contributing

Please see our [CONTRIBUTING.md](/.github/CONTRIBUTING.md)

## License

[MIT](https://oss.ninja/mit/developit/)
