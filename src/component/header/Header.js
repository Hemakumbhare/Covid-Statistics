import React from "react";
import Logo from "../../assets/images/covid19logo.jpg";
import "../../assets/css/header.css";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="main-header">
        <img src={Logo} alt="logo" id="logo"></img>
      </div>
    );
  }
}

export default Header;
