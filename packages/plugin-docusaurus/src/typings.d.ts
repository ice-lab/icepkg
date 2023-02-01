declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
// Docusaurus inner component, use `@theme-original` to alias to pre-swizzled components
declare module '@theme-original/CodeBlock';
