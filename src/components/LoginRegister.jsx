import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import history from "../history";

const styles = theme => ({
  root: {
    maxWidth: 600,
    margin: "auto"
  }
});

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: props.tab !== undefined ? props.tab : 0
    };
  }

  handleTabChange = (event, newTab) => {
    this.setState({ tab: newTab });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Tabs
          value={this.state.tab}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab
            label="Log in"
            onClick={() => {
              history.replace("/login");
            }}
          />
          <Tab
            label="Register"
            onClick={() => {
              history.replace("/users/new");
            }}
          />
        </Tabs>

        <TabPanel value={this.state.tab} index={0}>
          <LoginForm onClose={() => history.goBack()} />
        </TabPanel>

        <TabPanel value={this.state.tab} index={1}>
          <RegisterForm onClose={() => history.goBack()} />
        </TabPanel>
      </div>
    );
  }
}

export default withStyles(styles)(LoginRegister);
