import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../TabPanel";

import LoginForm from "../LoginForm";
import RegisterForm from "../RegisterForm";
import history from "../../history";

// TODO: move to form style
const styles = theme => ({
  root: {
    maxWidth: 600,
    margin: "auto"
  },
  textField: {
    width: "100%"
  },
  actionButton: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1)
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
              history.replace("/register");
            }}
          />
        </Tabs>

        <TabPanel value={this.state.tab} index={0}>
          <LoginForm
            classes={classes}
            onClose={() => history.goBack()}
            onFormSuccess={() => history.goBack()}
          />
        </TabPanel>

        <TabPanel value={this.state.tab} index={1}>
          <RegisterForm
            classes={classes}
            onClose={() => history.goBack()}
            onFormSuccess={() => history.push("/login")}
          />
        </TabPanel>
      </div>
    );
  }
}

export default withStyles(styles)(LoginRegister);
