const { parse } = require('@babel/parser');
const t = require('@babel/types');
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');

module.exports = function fusionCoolInfoLoader(code) {
  const ast = parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript', 'classProperties'] });

  const visitor = {

    JSXOpeningElement(nodePath) {
      const { name, attributes } = nodePath.node;
      let componentName = name && name.name;
      let rootName = name && name.name;

      try {
        // 针对 Card.Content 这种子组件
        if (t.isJSXMemberExpression(name)) {
          if (t.isJSXIdentifier(name.object) && t.isJSXIdentifier(name.property)) {
            componentName = `${name.object.name}.${name.property.name}`;
            rootName = name.object.name;
          }
        // 针对 React 组件
        } else if (!t.isJSXIdentifier(name)) {
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }

      // 只针对首字母大写的自定义 JSX 组件
      if (!componentName[0].match(/[A-Z]/)) {
        return false;
      }

      try {
        const parentScope = nodePath.scope.parent;
        let currenName = rootName;
        let parent = parentScope.getBinding(currenName).path.parent;
        let importNode = parent;
        let current;

        // 如果是 cosnt FormItem = Form.Item 这种
        while (t.isVariableDeclaration(parent)) {
          current = parent.declarations[0].init;
          if (t.isIdentifier(current)) {
            currenName = current.name;
            parent = parentScope.getBinding(currenName).path.parent;
          } else if (t.isMemberExpression(current)) {
            componentName = `${current.object.name}.${current.property.name}`;
            importNode = parentScope.getBinding(current.object.name).path.parent;
            break;
          } else {
            parent = current;
          }
        }

        // parent = nodePath.scope.parent.getBinding(rootName).path.parent;
        // 针对声明的组件 import { Balloon } from '@alifd/next';
        if (!t.isImportDeclaration(importNode)) {
          return false;
        }
        const importPkg = importNode.source.value;

        // 去除一些组件
        if (['react', 'react-dom', 'react-router', 'dva-router', 'ice'].indexOf(importPkg) > -1
          || importPkg.match(/(\.)*\//)
          || importPkg.match(/lodash(.)*/)
          || importPkg.match(/@components\//)) {
          return false;
        }

        // 只有需要加 data-fusion-cool 属性的结点，这个参数才有值
        const fusionCoolProps = {
          name: componentName,
          type: 'adaptor-component',
          pkgName: importPkg,
        };

        if (!fusionCoolProps) {
          return false;
        }

        const stringLiteral = JSON.stringify(fusionCoolProps).replace(/"/ig, '&quot;');

        const newProp = t.jsxAttribute(
          t.JSXIdentifier('data-fusioncool'),
          t.stringLiteral(stringLiteral),
        );

        attributes.push(newProp);
      } catch (error) {
        console.log(error);
      }
    },
  };
  traverse.default(ast, visitor);

  return generator.default(ast).code;
};
