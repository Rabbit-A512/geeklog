import * as React from 'react';
import { Layout } from "antd";
import { Route, Switch } from "react-router-dom";

import './Structure.css';
import AppHeader from '../../components/AppHeader/AppHeader';
import Home from '../../containers/Home/Home';
import Feature from '../../containers/Feature/Feature';
import LoginForm from '../../components/LoginForm/LoginForm';
import ReadArticle from "../ReadArticle/ReadArticle";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import UserHome from "../UserHome/UserHome";
import AllArticles from "../../components/AllArticles/AllArticles";

class App extends React.Component {
  public state = {
    isLoggedIn: false
  };

  public render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <AppHeader/>
        <Switch>
          <Route path={'/all-articles'} component={AllArticles}/>
          <Route path={'/user-home/:user_id'} component={UserHome}/>
          <Route path={'/feature'} component={Feature}/>
          <Route path={'/register'} component={RegisterForm}/>
          <Route path={'/login'} component={LoginForm}/>
          <Route path={'/read-article/:article_id'} component={ReadArticle}/>
          <Route path={'/'} component={Home}/>
        </Switch>
      </Layout>
    );
  }
}

export default App;
