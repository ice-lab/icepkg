/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as queryString from 'query-string';
import { Playground } from './Playground';
import { BuildLayout, Layout } from './Layout';

const App = ({ demoData, readmeData, pkg, codesandbox = [] }) => {
  const demos= readmeData ? [].concat(readmeData, demoData) : demoData;
  const items = (demos || []).sort((a, b) => a.order - b.order);
  
  return (
    <BuildLayout demos={items}>
      {items.map((data) => {
        const Comp = data.component;
        return (
          <div key={data.filename}>
            <a name={`container_${data.filename}`} />
            {data.title && data.filename !== 'readme' && <h3>{data.title}</h3>}
            <Playground data={data} pkg={pkg} codesandbox={codesandbox}>
              {typeof Comp === 'function' && <Comp />}
            </Playground>
          </div>
        );
      })}
    </BuildLayout>
  );
};

const Demo = ({ location, demoData, readmeData, pkg, codesandbox = [] }) => {
  const { demo } = queryString.parse(location && location.search);
  const demos = demoData.find((item) => item[0] && item[0].demoKey === demo);
  return (
    <Layout demos={[].concat(readmeData, demoData)} matchedFilename={demo}>
      { demos ? <App demoData={demos} pkg={pkg} codesandbox={codesandbox} /> : <Playground data={readmeData} pkg={pkg} codesandbox={codesandbox} /> }
    </Layout>
  );
};

const AppTab = (props) => {
  const renderComponent = (routerProps) => <Demo {...props} {...routerProps} />;
  return (
    <Router>
      <Switch>
        <Route path="/" render={renderComponent} />
      </Switch>
    </Router>
  );
};

const Main = ({ demoData, ...rest }) => {
  const demoLength = demoData.length;
  return demoLength > 1 ? <AppTab {...rest} demoData={demoData} /> : <App {...rest} demoData={demoData[0]} />;
};

export default Main;