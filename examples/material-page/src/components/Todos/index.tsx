import React from 'react';

export default function(props) {
  const { dataSource } = props;
  return (
    <div>
      {
        dataSource.map(function({ title }) {
          return (
            <div>
              <span>{title}</span>
            </div>
          );
        })
      }
    </div>
  );
}