import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";
class LoadingBar extends React.Component {
  render() {
    return (
      <Dialog
        open={this.props.circularProgOpen}
        keepMounted
        maxWidth={"md"}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        style={{
          overflowY: "scroll",
          height: "100%",
          display: "grid",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: 280,
            height: 70,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <CircularProgress style={{ margin: "0 20px" }} />
          <span>Please wait ...</span>
        </div>
      </Dialog>
    );
  }
}
export default LoadingBar;
