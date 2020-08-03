/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Playground } from './Playground';
import { BuildLayout, Layout } from './Layout';

const AppProduction = ({ demoData, readmeData }) => {
  const demos= [].concat(readmeData, demoData);
  const items = (demos || []).sort((a, b) => a.order - b.order);
  
  return (
    <BuildLayout demos={items}>
      {items.map((data, index) => {
        const Comp = data.component;
        return (
          <div key={data.filename}>
            <a name={`container_${data.filename}`} />
            {data.title && index !== 0 && data.filename !== 'readme' && <h3>{data.title}</h3>}
            <Playground data={data}>
              {typeof Comp === 'function' && <Comp />}
            </Playground>
          </div>
        );
      })}
    </BuildLayout>
  );
};

const Demo = ({ match, demoData, readmeData }) => {
  const { demo } = (match && match.params) || {};
  const demos= [].concat(readmeData, demoData);
  const data = demos.find(item => item.filename === demo) || readmeData;
  const matchedFilename = demo || data.filename;
  const Comp = data.component;
  
  return (
    <Layout demos={demos} matchedFilename={matchedFilename}>
      <Playground data={data}>
        {typeof Comp === 'function' && <Comp />}
      </Playground>
    </Layout>
  );
};

const AppDevelopment = (props) => {
  const renderComponent = (routerProps) => <Demo {...props} {...routerProps} />;
  return (
    <Router>
      <Switch>
        <Route path="/:demo" render={renderComponent} />
        <Route path="/" render={renderComponent} />
      </Switch>
    </Router>
  );
};

const App = ({ env, ...rest }) => {
  return env === 'development' ? <AppDevelopment {...rest} /> : <AppProduction {...rest} />;
};

export default App;