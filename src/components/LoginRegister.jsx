import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";

import Login from "./Login";
import Register from "./Register";
import Modal from "./Modal";
import history from "../history";
import AdapterLink from "./AdapterLink";
import { popUrl } from "../utils/otherUtils";

const styles = theme => ({
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

  handleModalClose = () => {
    history.push(popUrl(history.location.pathname));
  };

  handleTabChange = (event, newTab) => {
    this.setState({ tab: newTab });
  };

  render() {
    const { classes } = this.props;
    return (
      <Modal open={true} onClose={this.handleModalClose}>
        <Tabs
          value={this.state.tab}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Log in" to="/login" component={AdapterLink} />
          <Tab label="Register" to="/register" component={AdapterLink} />
        </Tabs>

        <TabPanel value={this.state.tab} index={0}>
          <Login classes={classes} onClose={this.handleModalClose} />
        </TabPanel>

        <TabPanel value={this.state.tab} index={1}>
          <Register classes={classes} onClose={this.handleModalClose} />
        </TabPanel>
      </Modal>
    );
  }
}

export default withStyles(styles)(LoginRegister);
