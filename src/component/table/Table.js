import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import LoadingBar from "../../component/LoadingBar/index";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DirectionsWalkOutlinedIcon from '@material-ui/icons/DirectionsWalkOutlined';
import "../../assets/css/Table.css";
class TableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curTime: new Date().toLocaleDateString(),
      circularProgOpen: false,
      age18: false,
      age45: false,
      free: false,
      paid: false,
      filterArray: [],
    };
  }

  pervious = () => {
    this.props.pervious();
  };
  next = () => {
    this.props.next();
  };
  filteredDataAgewise(data) {
    if (this.state.age18 && this.state.age45) {
      return data;
    } else if (this.state.age18) {
      let filterArray = [...this.state.filterArray];
      this.props.twodArray.forEach((da) => {
        da.date.forEach((data) => {
          if (
            data.min_age_limit === 18 &&
            filterArray.findIndex((x) => x.centerId === da.centerId) === -1
          ) {
            filterArray.push({
              centerId: da.centerId,
              vaccine: da.vaccine,
              fee: da.fee,
              date: da.date,
              name: da.name,
              pincode: da.pincode,
              state: da.state,
              district: da.district,
              nodataFound: false,
            });
          }
        });
      });
      if (filterArray.length > 0) {

        return filterArray;
      } else {
        return null;
      }
    } else if (this.state.age45) {
      let filterArray = [...this.state.filterArray];
      this.props.twodArray.forEach((da) => {
        da.date.forEach((data) => {
          if (
            data.min_age_limit === 45 &&
            filterArray.findIndex((x) => x.centerId === da.centerId) === -1
          ) {
            filterArray.push({
              centerId: da.centerId,
              vaccine: da.vaccine,
              fee: da.fee,
              date: da.date,
              name: da.name,
              pincode: da.pincode,
              state: da.state,
              district: da.district,
              nodataFound: false,
            });
          }
        });
      });
      if (filterArray.length > 0) {
        return filterArray;
      } else {
        return null;
      }
    } else {
      return data;
    }
  }
  filteredRate = (data) => {
    if (this.state.paid && this.state.free) {
      return data;
    } else if (this.state.free) {
      return data.fee === "Free";
    } else if (this.state.paid) {
      return data.fee === "Paid";
    } else {
      return data;
    }
  };



  age18 = () => {
    if (sessionStorage.age18 === "true") {
      sessionStorage.setItem("age18", false);
    } else {
      sessionStorage.setItem("age18", true);
    }
    this.props.getData();
  };
  age45 = () => {
    if (sessionStorage.age45 === "true") {
      sessionStorage.setItem("age45", false);
    } else {
      sessionStorage.setItem("age45", true);
    }
    this.props.getData();
  };
  covishield = () => {
    if (sessionStorage.covishield === "true") {
      sessionStorage.setItem("covishield", false);
    } else {
      sessionStorage.setItem("covishield", true);
    }
    this.props.getData();
  };
  covaxin = () => {
    if (sessionStorage.covaxin === "true") {
      sessionStorage.setItem("covaxin", false);
    } else {
      sessionStorage.setItem("covaxin", true);
    }
    this.props.getData();
  };
  available = () => {
    if (sessionStorage.available === "true") {
      sessionStorage.setItem("available", false);
    } else {
      sessionStorage.setItem("available", true);
    }
    this.props.getData();
  };
  resetFilter = () => {
    sessionStorage.setItem("age18", false);
    sessionStorage.setItem("age45", false);
    sessionStorage.setItem("covishield", false);
    sessionStorage.setItem("covaxin", false);
    sessionStorage.setItem("available", false);
    this.setState({
      free: false,
      paid: false,
    });
    this.props.getData();
  };

  render() {
    return (
      <div>
        <LoadingBar {...this.state}></LoadingBar>
        {this.props.twodArray?.length || this.props.nodataFound ? (
          <>
            <div className="filter-button">
              <div className="button-group">

                <span>Availability</span>

                <ButtonGroup aria-label="small outlined button group" >
                  <Button
                    onClick={this.available}
                    color={
                      sessionStorage.available === "true" ? "primary" : "inherit"
                    }
                    variant={
                      sessionStorage.available === "true"
                        ? "contained"
                        : "outlined"
                    }
                  >
                    Available
                  </Button>
                </ButtonGroup>
              </div>

              <div className="button-group">
                <span>Age</span>
                <ButtonGroup aria-label="small outlined button group">
                  <Button
                    onClick={this.age18}
                    color={
                      sessionStorage.age18 === "true" ? "primary" : "inherit"
                    }
                    variant={
                      sessionStorage.age18 === "true" ? "contained" : "outlined"
                    }
                  >
                    Age 18+
                  </Button>
                  <Button
                    onClick={this.age45}
                    color={
                      sessionStorage.age45 === "true" ? "primary" : "inherit"
                    }
                    variant={
                      sessionStorage.age45 === "true" ? "contained" : "outlined"
                    }
                  >
                    Age 45+
                  </Button>
                </ButtonGroup>
              </div>

              <div className="button-group">

                <span>Vaccine</span>

                <ButtonGroup aria-label="small outlined button group" >

                  <Button
                    onClick={this.covishield}
                    color={
                      sessionStorage.covishield === "true" ? "primary" : "inherit"
                    }
                    variant={
                      sessionStorage.covishield === "true"
                        ? "contained"
                        : "outlined"
                    }
                  >
                    Covishield
                  </Button>
                  <Button
                    onClick={this.covaxin}
                    color={
                      sessionStorage.covaxin === "true" ? "primary" : "inherit"
                    }
                    variant={
                      sessionStorage.covaxin === "true" ? "contained" : "outlined"
                    }
                  >
                    Covaxin
                  </Button>
                </ButtonGroup>
              </div>
              <div className="button-group">

                <span>Fee</span>

                <ButtonGroup aria-label="small outlined button group" >
                  <Button
                    variant={this.state.free ? "contained" : "outlined"}
                    color={this.state.free ? "primary" : "inherit"}
                    onClick={() => {
                      this.state.free
                        ? this.setState({
                          free: false,
                        })
                        : this.setState({
                          free: true,
                        });
                    }}
                  >
                    Free
                  </Button>
                  <Button
                    onClick={() => {
                      this.state.paid
                        ? this.setState({
                          paid: false,
                        })
                        : this.setState({
                          paid: true,
                        });
                    }}
                    color={this.state.paid ? "primary" : "inherit"}
                    variant={this.state.paid ? "contained" : "outlined"}
                  >
                    Paid
                  </Button>
                </ButtonGroup>

              </div>
              <div className="button-group">

                <span>{"  "}</span>

                <ButtonGroup aria-label="small outlined button group" >
                  <Button
                    variant="outlined"
                    onClick={this.resetFilter}
                    color="inherit"
                  >
                    Reset
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <div>
              <p
                style={{
                  fontSize: "14px",
                  padding: "0 6em ",
                  textAlign: "left",
                  lineHeight: "2",
                  backgroundColor: '#f7fcff',
                  color:'#002060'
                }}
              >
                <InfoOutlinedIcon style={{ margin: '0 16px -37px -55px',color:'#002060' }} />
                <li>Slots are updated by state vaccination centers and private
                  hospitals everyday at 8AM, 12PM, 4PM, & 8PM.</li>
                <li>
                  <DirectionsWalkOutlinedIcon /><b>Walk-in available</b>&nbsp;
                  at all vaccination centers for age 18 years and above
                  (For timings for walk-in vaccinations, please contact the
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vaccine center.)
                </li>
               

                <li><b>D1-  Vaccine Dose #1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; D2- Vaccine Dose #2</b></li>

              </p>
            </div>
            <div align="right" style={{ marginBottom: "10px" }}>
              <Button
                onClick={this.pervious}
                color="inherit"
                variant="contained"
                style={{ width: "10em", marginRight: "10px" }}
              >
                {" << Pervious"}
              </Button>
              <Button
                onClick={this.next}
                color="inherit"
                variant="contained"
                style={{ width: "9em" }}
              >
                {"Next >>"}
              </Button>
            </div>
          </>
        ) : (
          ""
        )}
        <Paper style={{ width: "100%" }}>
          <TableContainer style={{ maxHeight: 540 }}>
            {this.props.twodArray?.length || this.props.nodataFound ? (
              <Table stickyHeader style={{ textAlign: "center" }}>
                <TableHead style={{ backgroundColor: "black" }}>
                  <TableRow>
                    <TableCell align="center">Centers</TableCell>
                    {this.props.dates.map((data, index) => (
                      <TableCell key={index} align="center">
                        {data}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {this.props.twodArray
                    .filter((center) => this.filteredRate(center))
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((center, index) => (
                      <TableRow
                        className="hover-div"
                        role="checkbox"
                        hover
                        key={index}
                        style={{ width: "10em" }}
                      >
                        <TableCell style={{ width: "15em" }}>
                          <div>
                            {center.name},
                            {center.fee === "Paid" ? (
                              <span className="paid-span">{"PAID"}</span>
                            ) : (
                              ""
                            )}
                            <br />
                            {center.district}, {center.state}, {center.pincode}
                          </div>
                        </TableCell>
                        {this.props.dates.map((da, index) => (
                          <TableCell key={index}>
                            {center.date

                              .filter((data) => data.date === da)
                              .map((data, index) => data.length).length > 0 ? (
                              <div key={index}>
                                {center.date
                                  .filter((data) =>
                                    sessionStorage.age18 === "true" &&
                                      sessionStorage.age45 === "true"
                                      ? data
                                      : sessionStorage.age18 === "true"
                                        ? data.min_age_limit === 18
                                        : sessionStorage.age45 === "true"
                                          ? data.min_age_limit === 45
                                          : data
                                  )
                                  .filter((data) =>
                                    sessionStorage.available === "true"
                                      ? data.available_capacity >= 1
                                      : data
                                  )
                                  .filter((data) => data.date === da)
                                  .map((data, index) => (
                                    <div
                                      style={{ marginBottom: "10px" }}
                                      key={index}
                                    >
                                      {data.available_capacity === 0 ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            background: "#ad0000",
                                            textAlign: "center",
                                            color: "white",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                          }}
                                        >
                                          {"Booked"}
                                        </div>
                                      ) : (
                                        <div className="total-count">
                                          <div>
                                            <div> D1</div>
                                            <div>
                                              {data.available_capacity_dose1}
                                            </div>
                                          </div>

                                          <div
                                            className="count"
                                            style={{
                                              background:
                                                data.available_capacity > 10
                                                  ? "#a9d18e"
                                                  : "#ffbf00",
                                            }}
                                          >
                                            {data.available_capacity}
                                          </div>
                                          <div>
                                            <div>D2</div>
                                            <div>
                                              {" "}
                                              {data.available_capacity_dose2}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <div
                                        style={{
                                          textAlign: "center",
                                          fontSize: "12px",
                                          color: "#2e2e2e",
                                        }}
                                      >
                                        {data.vaccine}
                                      </div>
                                      <div
                                        style={{
                                          color: "#c20505",
                                          fontSize: "11px",
                                          textAlign: "center",
                                        }}
                                      >
                                        Age
                                        {data.min_age_limit}+
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="nodata">
                                <span> {"NA"}</span>
                              </div>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              ""
            )}
            {this.props.nodataFound ? (
              <div className="message-noVaccination">
                {" "}
                No Vaccination center is available for booking.
              </div>
            ) : (
              ""
            )}
          </TableContainer>
        </Paper>
      </div>
    );
  }
}

export default TableView;
