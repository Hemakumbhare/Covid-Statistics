import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "../assets/css/CowinApp.css";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Table from "../component/table/Table";
import LoadingBar from "../../src/component/LoadingBar/index";

class CowinApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indianCityError: "",
      indainStateError: "",
      indainState: [],
      indianCity: [],
      stateId: "",
      cityId: "",
      dates: [],
      circularProgOpen: false,
      twodArray: [],
      district_name: "",
      nodataFound: false,
      age18: false,
      age45: false,
      free: false,
      paid: false,
    };
  }
  componentDidMount() {
    var startDate = new Date();
    var aryDates = [];
    for (var i = 0; i < 7; i++) {
      var currentDate = new Date();
      currentDate.setDate(startDate.getDate() + i);
      aryDates.push(
        currentDate.getDate().toString().padStart(2, "0") +
          "-" +
          (currentDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          currentDate.getFullYear()
      );
    }
    this.setState({ dates: aryDates });
    this.getState();
    if(sessionStorage.state_name && sessionStorage.district_name)
    {
this.getData()
    }
  }
  getState = () => {
    this.setState({ circularProgOpen: true });
    fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          indainState: data.states,
          circularProgOpen: false,
          district_name: "",
        })
      );
  };
  onChangeSelectState = (e, value) => {
    
    this.setState({
      stateId: value?.state_id,
      indainStateError: "",
      centers: [],
      district_name: "",
      cityId: "",
    });
    sessionStorage.setItem("state_name", value?.state_name)
    sessionStorage.setItem("stateId", value?.state_id);
    this.getCity(value?.state_id);
  };
  getCity = (id) => {
    this.setState({ circularProgOpen: true });
    fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          indianCity: data.districts,
          circularProgOpen: false,
        })
      );
  };
  onChangeSelectCity = (e, value) => {
    
    let id = value?.district_id;
    sessionStorage.setItem("cityId", id);
    sessionStorage.setItem("district_name", value?.district_name);

    this.setState({
      cityId: id,
      indianCityError: "",
      district_name: value?.district_name,
    });
  };
  onClickSearch = () => {
    let isValid = true;
    if (this.state.stateId === "") {
      isValid = false;
      this.setState({ indainStateError: "Please select correct state" });
    }
    if (!sessionStorage.cityId) {
      isValid = false;
      this.setState({ indianCityError: "Please select correct district" });
    }
    if (isValid) {
      this.getData();
      sessionStorage.setItem("count", 1);
    }
  };
  getData = () => {
    this.setState({
      circularProgOpen: true,
      twodArray: [],
    });
    this.timer = setTimeout(() => {
      // let id = this.state.cityId;
      let id   = sessionStorage.cityId
      var twodArray = [...this.state.twodArray];
      for (var i = 0; i < 7; i++) {
        this.setState({ circularProgOpen: true });
        fetch(
          `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${id}&date=${this.state.dates[i]}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.centers?.length > 0) {
              data?.centers?.forEach((da) => {
                if (
                  twodArray?.findIndex((x) => x?.centerId === da?.center_id) ===
                  -1
                ) {
                  da?.sessions.forEach((mydata) => {
                    if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age18 === "true" &&
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covishield === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 45 &&
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVISHIELD" &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age18 === "true" &&
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 45 &&
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age18 === "true" &&
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covishield === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 45 &&
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVISHIELD"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age18 === "true" &&
                      sessionStorage.covishield === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVISHIELD" &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covishield === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 45 &&
                        mydata.vaccine === "COVISHIELD" &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age18 === "true" &&
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covishield === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.min_age_limit === 45 &&
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVISHIELD" &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age18 === "true" &&
                      sessionStorage.covishield === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVISHIELD"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age18 === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 45 &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covishield === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 45 &&
                        mydata.vaccine === "COVISHIELD"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age18 === "true" &&
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covishield === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.min_age_limit === 45 &&
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVISHIELD"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age18 === "true" &&
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.min_age_limit === 45 &&
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age18 === "true" &&
                      sessionStorage.covishield === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVISHIELD" &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covishield === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.min_age_limit === 45 &&
                        mydata.vaccine === "COVISHIELD" &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age45 === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 45
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.age18 === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.min_age_limit === 18
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.covishield === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.vaccine === "COVISHIELD"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.available_capacity >= 1 &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age18 === "true" &&
                      sessionStorage.covishield === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVISHIELD"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age18 === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.min_age_limit === 18 &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covishield === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.min_age_limit === 45 &&
                        mydata.vaccine === "COVISHIELD"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age45 === "true" &&
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.min_age_limit === 45 &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age18 === "true" &&
                      sessionStorage.age45 === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.min_age_limit === 45 &&
                        mydata.min_age_limit === 18
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.covaxin === "true" &&
                      sessionStorage.covishield === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (
                        mydata.vaccine === "COVISHIELD" &&
                        mydata.vaccine === "COVAXIN"
                      ) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.available === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (mydata.available_capacity >= 1) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age18 === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (mydata.min_age_limit === 18) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.age45 === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (mydata.min_age_limit === 45) {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.covishield === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (mydata.vaccine === "COVISHIELD") {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      sessionStorage.covaxin === "true" &&
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      if (mydata.vaccine === "COVAXIN") {
                        twodArray.push({
                          centerId: da?.center_id,
                          vaccine: da?.sessions[0]?.date,
                          fee: da?.fee_type,
                          date: da?.sessions,
                          name: da?.name,
                          pincode: da?.center_id,
                          state: da?.state_name,
                          district: da?.district_name,
                        });
                      }
                    } else if (
                      twodArray?.findIndex(
                        (x) => x?.centerId === da?.center_id
                      ) === -1
                    ) {
                      twodArray.push({
                        centerId: da?.center_id,
                        vaccine: da?.sessions[0]?.date,
                        fee: da?.fee_type,
                        date: da?.sessions,
                        name: da?.name,
                        pincode: da?.center_id,
                        state: da?.state_name,
                        district: da?.district_name,
                      });
                    }
                    this.setState({
                      twodArray: twodArray,
                      circularProgOpen: false,
                      nodataFound: false,
                    });
                  });
                }
              });
            } else {
              this.setState({
                circularProgOpen: false,
              });

              if (!this.state.twodArray?.length > 0) {
                this.setState({
                  nodataFound: true,
                  circularProgOpen: false,
                });
              }
            }
          });
      }
      // this.setState({ circularProgOpen: false });
    }, 1000);
  };
  pervious = () => {
    if (sessionStorage.count !== "1") {
      this.setState({
        circularProgOpen: true,
      });
      var today = new Date();
      var startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + Number(sessionStorage.count) * 7 - 14
      );
      var aryDates = [];
      for (var i = 0; i < 7; i++) {
        var nextweek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + Number(sessionStorage.count) * 7 - 14
        );

        nextweek.setDate(startDate.getDate() + i);
        aryDates.push(
          nextweek.getDate().toString().padStart(2, "0") +
            "-" +
            (nextweek.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            nextweek.getFullYear()
        );
      }
      this.setState({ dates: aryDates });
      sessionStorage.setItem("count", Number(sessionStorage.count) - 1);
      this.timer = setTimeout(() => {
        this.getData();
      }, 1000);
      this.setState({
        circularProgOpen: false,
      });
    }
  };

  next = () => {
    this.setState({
      circularProgOpen: true,
    });
    var today = new Date();
    var startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + Number(sessionStorage.count) * 7
    );
    var aryDates = [];
    for (var i = 0; i < 7; i++) {
      var nextweek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + Number(sessionStorage.count) * 7
      );
      nextweek.setDate(startDate.getDate() + i);
      aryDates.push(
        nextweek.getDate().toString().padStart(2, "0") +
          "-" +
          (nextweek.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          nextweek.getFullYear()
      );
    }

    this.setState({ dates: aryDates });
    sessionStorage.setItem("count", Number(sessionStorage.count) + 1);
    this.timer = setTimeout(() => {
      this.getData();
    }, 1000);
    this.setState({
      circularProgOpen: false,
    });
  };

 
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  render() {
    return (
      <div className="main-cowin">
        <LoadingBar {...this.state}></LoadingBar>
        <Grid container justify="center">
          <Grid item xs={10}>
            <Paper className="body-part">
              <h2 style={{ margin: "1em 0 2em 0" }}>
                Check your nearest vaccination center and slots availability
              </h2>
              <div className="drop-search">
                
                <FormControl>
                  <Autocomplete
                    id="combo-box-demo"
                      defaultValue={
                        sessionStorage
                        }
                        onChange={this.onChangeSelectState}
                        options={this.state.indainState}
                        getOptionLabel={(option) =>   option?.state_name }
                    style={{ width: 300 }}
                   
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=" Select State"
                        variant="outlined"

                      />
                    )}
                  />
                  <div className="errorMessage">
                    {this.state.indainStateError}
                  </div>
                </FormControl>

                <FormControl style={{ marginLeft: "1em" }}>
                  <Autocomplete
                    id="combo-box-demo"
                    defaultValue=
                    {
                        sessionStorage
                    }
                    
                    onChange={this.onChangeSelectCity}
                    options={this.state.indianCity }
                    getOptionLabel={(option) => option?.district_name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=" Select City"
                        variant="outlined"
                      />
                    )}
                  />
                  <div className="errorMessage">
                    {this.state.indianCityError}
                  </div>
                </FormControl>
                <FormControl>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.onClickSearch}
                  >
                    Search
                  </Button>
                </FormControl>
              </div>

              

              <Table
                nodataFound={this.state.nodataFound}
                twodArray={this.state.twodArray}
                dates={this.state.dates}
                pervious={this.pervious}
                next={this.next}
                getData={this.getData}
              ></Table>

             
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default CowinApp;
