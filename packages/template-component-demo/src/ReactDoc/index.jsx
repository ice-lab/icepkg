import React from 'react';

export function ReactDoc({ data }) {
  const { reactDoc } = data || {};
  const { displayName, description, props } = reactDoc || {};
  return (
    <div className="markdown">
      <h3>{displayName}</h3>
      <p>{description}</p>
      <table>
        <thead>
          <tr>
            <th>属性</th>
            <th>类型</th>
            <th>必填</th>
            <th>默认值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{props[key].tsType?.raw || props[key].tsType?.name}</td>
              <td>{props[key].required && '✓'}</td>
              <td>{props[key].defaultValue?.value}</td>
              <td>{props[key].description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
