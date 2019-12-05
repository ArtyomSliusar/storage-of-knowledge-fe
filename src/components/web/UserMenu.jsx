import React from "react";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";
import { useTheme } from "@material-ui/core";
import { connect } from "react-redux";

function UserMenu(props) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        className={props.classes.navButton}
        onClick={handleClick}
      >
        <AccountCircle style={{ marginRight: theme.spacing(1) }} />
        {props.currentUser ? props.currentUser.username : "user"}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(props.items).map(key => {
          return (
            <MenuItem key={key} component={Link} to={props.items[key]}>
              {key}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}

UserMenu.propTypes = {
  items: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    currentUser: state.users.byId[state.auth.user.id]
  };
};

export default connect(mapStateToProps)(UserMenu);
