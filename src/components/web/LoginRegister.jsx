import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../TabPanel";

import LoginForm from "../LoginForm";
import RegisterForm from "../RegisterForm";
import Modal from "../Modal";

export default function LoginRegister(props) {
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
          onClose={props.onClose}
          onFormSuccess={props.onFormSuccess}
        />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <RegisterForm
          onClose={props.onClose}
          onFormSuccess={() => handleTabChange(null, 0)}
        />
      </TabPanel>
    </Modal>
  );
}
