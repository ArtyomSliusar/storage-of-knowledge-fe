import Paper from "@material-ui/core/Paper";
import { Button, FormControl, Input, InputLabel } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  form: {
    display: "inline-block"
  }
}));

function LoginRegister() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Paper className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Log in" />
        <Tab label="Register" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <form className={classes.root}>
          <FormControl margin="normal" fullWidth>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input id="username" type="text" />
          </FormControl>

          <FormControl margin="normal" fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input id="password" type="password" />
          </FormControl>

          <Button variant="contained" color="primary" size="medium">
            Log in
          </Button>
        </form>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <form className={classes.root}>
          <FormControl margin="normal" fullWidth>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input id="username" type="text" />
          </FormControl>

          <FormControl margin="normal" fullWidth>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" type="email" />
          </FormControl>

          <FormControl margin="normal" fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input id="password" type="password" />
          </FormControl>

          <Button variant="contained" color="primary" size="medium">
            Sign up
          </Button>
        </form>
      </TabPanel>
    </Paper>
  );
}

export default LoginRegister;
