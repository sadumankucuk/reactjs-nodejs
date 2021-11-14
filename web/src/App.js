import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ContactPage from './Pages/ContactPage';
import ContactsPage from './Pages/ContactsPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';


const App = () => {
  const token = localStorage.getItem('token');

  const app = token ? <>
    <Switch>
      <Route path="/contact" exact component={ContactPage} />
      <Route path="/contact/:contactId" exact component={ContactPage} />
      <Route path="/" exact component={ContactsPage} />
      <Route path="/contacts" exact component={ContactsPage} />
      <Route path="/login" exact component={ContactsPage} />
    </Switch>
  </> :
    <Switch>
      <Route path="/" exact component={LoginPage}/>
      <Route path="/login" exact component={LoginPage} />
      <Route path="/register" exact component={RegisterPage} />
    </Switch>
  return app;

}

export default App
