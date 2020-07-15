import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import CreateAccount from "./create_account/CreateAccount";
import Home from "./home/Home";
import Settings from "./settings/Settings";
import Login from "./login/Login";
import TeamOverview from "./team_overview/TeamOverview";
import requireAuth from "./RequireAuth";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/create_account" exact component={CreateAccount} />
            <Route path="/home" exact component={requireAuth(Home)} />
            <Route path="/settings" exact component={requireAuth(Settings)} />
            <Route
              path="/team_overview"
              exact
              component={requireAuth(TeamOverview)}
            />
            <Route render={() => <h3>No Match</h3>} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
