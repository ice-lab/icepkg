import React from 'react';
import Markdown from 'react-markdown';

export function ReactDoc({ data = {} }) {
  const { displayName, description, props } = data;
  console.log(data);
  return (
    <div className="markdown">
      <h3>{displayName}</h3>
      <p>{description}</p>
      <table>
        <thead>
          <tr>
            <th>属性名</th>
            <th>描述</th>
            <th>类型</th>
            <th>必填</th>
            <th>默认值</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>
                <Markdown>{props[key].description}</Markdown>
              </td>
              <td>{props[key].type?.raw || props[key].type?.name}</td>
              <td>{props[key].required && '✓'}</td>
              <td>{props[key].defaultValue?.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
