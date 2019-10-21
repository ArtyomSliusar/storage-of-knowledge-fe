import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../TabPanel";

import LoginForm from "../LoginForm";
import RegisterForm from "../RegisterForm";
import Modal from "../Modal";

// TODO: move to form style
const useStyles = makeStyles(theme => ({
  textField: {
    width: "100%"
  },
  actionButton: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }
}));

export default function LoginRegister(props) {
  const classes = useStyles();
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Log in" />
        <Tab label="Register" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <LoginForm
          classes={classes}
          onClose={props.onClose}
          onFormSuccess={props.onClose}
        />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <RegisterForm
          classes={classes}
          onClose={props.onClose}
          onFormSuccess={() => handleTabChange(null, 0)}
        />
      </TabPanel>
    </Modal>
  );
}
