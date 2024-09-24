import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { getAppPath } from '@jotforminc/router-bridge';
import { Header } from '@jotforminc/header-components';
import SideBar from './SideBar';

import Footer from './Footer';
import AddTodo from '../containers/AddTodo';
import VisibleTodoList from '../containers/VisibleTodoList';
import MainApp from './MainApp';

const App = () => (
  <Router basename={getAppPath()}>
    <Header
      appName="query-builder"
      appConfig={{
        className: 'items-center border-b border-gray-100',
        components: {
          logo: {
            visible: true,
            src: 'https://cdn.jotfor.ms/assets/img/logo2021/jotform-logo.svg'
          },
          title: { visible: true },
          subTitle: { visible: false }
        },
        appLink: () => {},
        title: 'Query Builder',
        subTitle: '',
      }}
      navigationAppTitle="Query Builder"
      disableAppSelector
      formListToggleDisabled={true}
      navigationToggleDisabled={true}
      accountBoxToggleDisabled={true}
      logoAction={() => {}}
    />
    <div className="flex w-full bg-red-100">
      <SideBar />
      <MainApp />
    </div>
  </Router>
);

export default App;
