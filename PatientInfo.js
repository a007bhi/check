import React, { Component } from "react";
import axios from "axios";
import apiUrl from "../../config/config";
import classnames from "classnames";
import $ from "jquery";
import Modal from 'react-modal';

import { MDBDataTable } from "mdbreact";
import ProgressBtn from "../../components/common/ProgressButton";
import TopNav from "../../components/common/TopNav";
import SideBar from "../../components/common/SideBar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import LinearProgress from "@material-ui/core/LinearProgress";
import { FormatAlignLeft } from "@material-ui/icons";
Modal.setAppElement('#root');



class PatientInfo extends Component {
  constructor() {
    super();
    this.state = {
      menus: [{ title: "Patient List", url: "/verifier-home" }],

      profileLink: "verifier-profile",
      patients: [],
      serial_no: "",
      currentPage: 1,
      totalPages: 10,
      errors: {},
      userid: "",

      hospital: "",
      ip_op: "",
      BatteryPercentage: "",
      patient_name: "",
      phone: "",

      indication: "",

      doctors: [],
      doctor_id: "",
      doctor_name: "Choose",
      data: {},
      prog_data: 0,
      loading: false,
      time: "",
      RecordingStatus: "",
      serial_no:"",
      device_id: "",
      Mac_id: "",
      customer_details: "",

      activity: "Rest",
      act_duration: "5",
      addNote: "",
    };
    this.selectItem = this.selectItem.bind(this);
    this.preventDefault = this.preventDefault.bind(this);
    this.fetchPatients = this.fetchPatients.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    
    
  }

  componentDidMount() {
    function capitalizeFirstLetter(string) {
      
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var newstat = this;

    /*socket.on('connect', function(){console.log('connected')});
    socket.on('connect_error', function(err){console.log(err)});
    socket.on('data', function(data){


      newstat.setState({"loading":true});
      
      console.log(newstat.state.loading)
    });
    socket.on('disconnect', function(){console.log('disconnected')});*/
    axios
      .get(apiUrl + "api/users/alldoctors")
      .then((res) => {
        this.setState({ ["doctors"]: res.data });
      })
      .catch((err) => {
        this.setState({ ["doctors"]: [] });
      });
    
    axios
      
      .get(apiUrl + "api/users/getVerifierPatientsNewmodal?page=2")
      .then((res) => {
        this.setState({
          patients: res.data,
          customerDetails: res.data.map(patient => patient.customer_details)
        });

        console.log(res.data);

        const data = {
          columns: [
            {
              label: "SL NO",
              field: "slno",
              sort: "asc",
              width: 50,
            },
            {
              label: "PATIENT NAME",
              field: "patientName",
              sort: "asc",
              width: 200,
            },
            {
              label: "Trigger",
              field: "Trigger",
              sort: "asc",
              width: 200,
            },
            {
              label: "Doctor",
              field: "doctorName",
              sort: "asc",
              width: 200,
            },

            {
              label: "Phone",
              field: "phone",
              sort: "asc",
              width: 100,
            },
            {
              label: "Hospital",
              field: "hospital",
              sort: "asc",
              width: 200,
            },
            {
              label: "Duration",
              field: "duration",
              sort: "asc",
              width: 100,
            },
            {
              label: "Mac ID",
              field: "Mac_id",
              sort: "asc",
              width: 200,
            },
            {
              label: "Battery Percentage",
              field: "BatteryPercentage",
              sort: "disabled",
              width: 200,
            },
            {
              label: "Symptoms",
              field: "symptoms",
              sort: "asc",
              width: 200,
            },
            {
              label: "IP/OP",
              field: "ip_op",
              sort: "asc",
              width: 200,
            },
            {
              label: "Patient ID",
              field: "device_id",
              sort: "asc",
              width: 200,
            },
            {
              label: "Recording Status",
              field: "RecordingStatus",
              sort: "asc",
              width: 200,
            },
            {
              label: "Customer",
              field: "customer_details",
              sort: "asc",
              width: 200,
            },

            {
              label: "Created On",
              field: "Created",
              sort: "asc",
              width: 200,
            },

            {
              label: "Status",
              field: "status",
              sort: "disabled",
              width: 200,
            },
            {
              label: "Action",
              field: "action",
              sort: "disabled",
              width: 200,
            },
            {
              label: "Diary",
              field: "diary",
              sort: "disabled",
              width: 200,
            },
          ],
          rows: [],
        };

        var onClick = this.selectItem.bind(this);
        var getInfo = this.getInfo.bind(this);
        var preventDefault = this.preventDefault.bind(this);
        var createdData = "";
        const options = [
          "RPeaks",
          "Classic",
          "Classical",
          "Classic Negative",
          "AI",
          "AIcodes",
        ];
        const defaultOption = options[0];
        res.data.map(function (patient, i) {
          var url = " ";
          if (patient.LastDatasetId !== undefined) {
            if (
              patient.backup_status == 0 ||
              patient.backup_status == undefined
            ) {
              url =
                "/verifier-unanalysed/" +
                patient._id +
                "/" +
                patient.LastDatasetId;
            } else {
              url = " ";
            }
          }

          var anl_btn_txt = "Analyze";
          var anl_btn_class = "btn-danger";
          var gen_btn_txt = "Not Analyzed";
          var gen_btn_class = "btn-danger";
          var report_link = "#";
          var report_link_target = "";
          var report_status = patient.report_status;
          window.backup_status = patient.backup_status;
          if (patient.report_status == 1) {
            anl_btn_txt = "Analyzing...";
            gen_btn_txt = "Data is Analyzing";
            gen_btn_class = "btn-warning";
            anl_btn_class = "btn-success";
          }
          if (patient.report_status >= 2) {
            if (
              patient.backup_status == 0 ||
              patient.backup_status == undefined
            ) {
              url =
                "/verifier-chart/" + patient._id + "/" + patient.LastDatasetId;
            } else {
              url = " ";
            }
            gen_btn_txt = "Analyzed";
            gen_btn_class = "btn-primary";
            anl_btn_txt = "Analyzed";
            anl_btn_class = "btn-success";
          }
          if (patient.report_status >= 4) {
            gen_btn_txt = "Report Complete";
            gen_btn_class = "btn-success";
            report_link_target = "_blank";
            report_link =
              "https://web.mybiocalculus.com/assets/dist/user_records/" +
              patient._id +
              "/Report" +
              patient._id +
              ".pdf";
          }

          if (
            patient.backup_status == 0 ||
            patient.backup_status == undefined
          ) {
            anl_btn_txt = "Analyzed";

            anl_btn_txt = "Analyzed";
          } else if (patient.backup_status == 1) {
            anl_btn_txt = "Retrieve";
          } else if (patient.backup_status == 2) {
            anl_btn_txt = "Retrieving";
          }
          const recordingStatus = patient.RecordingStatus;

          // Function to render status message based on RecordingStatus
          const renderStatusMessage = () => {
            switch (recordingStatus) {
              case 0:
                return " recording Not started";
              case 1:
                return "Recording Mode";
              case 3:
                return "Data uploaded";
              default:
                return "Unknown status";
            }
          };
          createdData = patient.created_at.split("T");

          data.rows.push({
            slno: i + 1,
            patientName: patient.name,

            Trigger: (
              <React.Fragment>
                <a href="#">
                  <button
                    type="button"
                    id={patient._id}
                    onClick={this.Trigger}
                    className="btn btn-warning mr-20"
                    data-toggle="modal"
                  >
                    Trigger
                  </button>
                </a>
              </React.Fragment>
            ),
            doctorName: patient.doctor_name,

            phone: patient.phone,
            hospital: patient.hospital,
            duration: patient.exp_device_use_days,
            Mac_id: patient.Mac_id,
            BatteryPercentage: <YourComponent patient={patient} />,
            symptoms: patient.indication,
            ip_op: patient.ip_op,
            device_id: patient.device_id,
            RecordingStatus: renderStatusMessage(),
            doctorName: patient.doctor_name,

            phone: patient.phone,
            hospital: patient.hospital,
            duration: patient.exp_device_use_days,
            Mac_id: patient.Mac_id,
            BatteryPercentage: <YourComponent patient={patient} />,
            symptoms: patient.indication,
            ip_op: patient.ip_op,
            device_id: patient.device_id,
            RecordingStatus: renderStatusMessage(),
            customer_details: (
              <tr key={patient._id}>
                <td style={{ verticalAlign: 'middle' }}>
                  {patient.customer_details && patient.customer_details.length > 0 ? (
                    <ul>
                      {patient.customer_details.map((detail, index) => (
                        <li key={index}>
                          {detail.customer_details}<br />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'No customer details available'
                  )}
                </td>
              </tr>
            ),
            created: createdData[0],
            Status: (
              <React.Fragment>
                <a href="#">
                  <button
                    type="button"
                    id={patient._id}
                    className="btn btn-primary  mr-20"
                  >
                    {gen_btn_txt}
                  </button>
                </a>
              </React.Fragment>
            ),
            action: (
              <React.Fragment>
                <a href="#">
                  <button
                    type="button"
                    id={patient._id}
                    onClick={getInfo}
                    className="btn btn-warning  mr-20"
                    data-toggle="modal"
                    data-target="#editInfoModal"
                  >
                    Edit
                  </button>
                </a>
              </React.Fragment>
            ),
            diary: (
              <React.Fragment>
                <a href="#">
                  <button
                    type="button"
                    id={patient._id}
                    className="btn btn-warning mr-20"
                    data-toggle="modal"
                    data-target="#editDiaryModal"
                  >
                    Diary
                  </button>
                </a>
              </React.Fragment>
            ),
          });
        }, this);
        this.setState({ data: data });
      })
      .catch((err) => {});
  }

  onSubmit = (e) => {
    e.preventDefault();
    const settings = {
      userid: this.state.userid,
      nor_minhr: this.state.nor_minhr,
      nor_maxhr: this.state.nor_maxhr,
      qtcformula: this.state.qtcformula,
      qtcvalue_min: this.state.qtcvalue_min,
      qtcvaluemax: this.state.qtcvaluemax,
      qrswidth_min: this.state.qrswidth_min,
      qrswidth_max: this.state.qrswidth_max,
      qrsamp_min: this.state.qrsamp_min,
      qrsamp_max: this.state.qrsamp_max,
      stelevation: this.state.stelevation,
      pwidth_min: this.state.pwidth_min,
      pwidth_max: this.state.pwidth_max,
      pamp_min: this.state.pamp_min,
      pamp_max: this.state.pamp_max,
      stdepression: this.state.stdepression,
      twidth_min: this.state.twidth_min,
      twidth_max: this.state.twidth_max,
      tamp_min: this.state.tamp_min,
      tamp_max: this.state.tamp_max,
      printerval_min: this.state.printerval_min,
      printerval_max: this.state.printerval_max,
      tachyhr_lower: this.state.tachyhr_lower,
      tachyhr_upper: this.state.tachyhr_upper,
      bradyhr_lower: this.state.bradyhr_lower,
      bradyhr_upper: this.state.bradyhr_upper,
      pauselength: this.state.pauselength,
      graph_gen: this.state.graph_gen,
    };

    console.log(settings);
    axios
      .post(apiUrl + "api/patients/updateSettings", settings)
      .then((res) => {
        $("#closePopup").click();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onSubmitDiary = (e) => {
    e.preventDefault();
    var uid = this.props.userid;
    var did = this.props.databaseid;
    var finTime = document.getElementById("addTime").value;

    const info = {
      id: this.props.userid,
      datetime: finTime,
      diary_notes: this.state.addNote,
      act_duration: this.state.act_duration,
      activity: this.state.activity,
    };
    console.log("info", info);
    axios
      .post(apiUrl + "api/patients/addDiary", info)
      .then((res) => {
        console.log(res.data);
        $(".closePopup").click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onSubmitInfo = (e) => {
    e.preventDefault();
    const info = {
      userid: this.state.userid,
      hospital: this.state.hospital,
      ip_op: this.state.ip_op,
      doctorid: this.state.doctor_id,
      indication: this.state.indication,
      phone: this.state.phone,
      device_id: this.state.device_id,
      RecordingStatus: this.state.RecordingStatus,
      Mac_id: this.state.Mac_id,
      customer_details: this.state.customer_details,
      BatteryPercentage: this.state.BatteryPercentage,
    };

    axios
      .post(apiUrl + "api/patients/updateMoreInfo", info)
      .then((res) => {
        $(".closePopup").click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onChange = (e) => {
    var err = this.state.errors;
    delete err[e.target.name];
    this.setState({ [e.target.name]: e.target.value });
  };

  preventDefault(e) {
    e.preventDefault();
  }
  Trigger(e) {
    var userid = e.currentTarget.id;
    console.log(
      "https://web.mybiocalculus.com/html/welcome/triggeruserdata/?userid=" +
        userid
    );
    axios
      .get(
        "https://web.mybiocalculus.com/html/welcome/triggeruserdata/?userid=" +
          userid
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  setInfo(e) {
    var diary_id = e.currentTarget.id;
    this.state.diary_note_id = diary_id;
    /*var arr=this.search(this.state.diary_notes,diary_id);
     this.setState({time:arr[0].datetime,note:arr[0].diary_notes});
     console.log("diary_id",this.state.diary_note_id);*/
  }
  getInfo(e) {
    /* axios.get(apiUrl+'api/users/getTechnician?userid='+e.currentTarget.id)
          .then(res => {
            this.setState({ technician: res.data[0].name });
           
        })
          .catch(err => {
           
          });*/

    this.setState({
      smoking: "",
      diabetes: "",
      weight: "",
      hyper_tension: "",
      hyper_lipidemia: "",
      indication: "",
      cardiac_surgery: "",
      thyroid_function: "",
    });
    var userid = e.currentTarget.id;
    this.setState({ userid: userid });
    axios
      .get(apiUrl + "api/patients/getPatinetAdditionalInfo?userid=" + userid)
      .then((res) => {
        var data = res.data;
        // console.log('res.data[0].supportT',res.data[0]);

        this.setState({ device_id: res.data[0].device_id });
        this.setState({ RecordingStatus: res.data[0].RecordingStatus });
        this.setState({ customer_details: res.data[0].customer_details });
        this.setState({ Mac_id: res.data[0].Mac_id });
        this.setState({ indication: res.data[0].indication });
        this.setState({ BatteryPercentage: res.data[0].BatteryPercentage });
        this.setState({ hospital: res.data[0].hospital });
        this.setState({ ip_op: res.data[0].ip_op });
        this.setState({ phone: res.data[0].phone });
        this.setState({ patient_name: res.data[0].name });
        this.setState({ doctor_name: res.data[0].doctor_name });
        this.setState({ doctor_id: res.data[0].doctorid });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  selectItem(e) {
    var userid = e.currentTarget.id;
    this.setState({ userid: userid });
    this.setState({
      nor_minhr: "",
      nor_maxhr: "",
      qtcformula: "",
      qtcvalue_min: "",
      qtcvaluemax: "",
      qrswidth_min: "",
      qrswidth_max: "",
      qrsamp_min: "",
      qrsamp_max: "",
      stelevation: "",
      pwidth_min: "",
      pwidth_max: "",
      pamp_min: "",
      pamp_max: "",
      stdepression: "",
      twidth_min: "",
      twidth_max: "",
      tamp_min: "",
      tamp_max: "",
      printerval_min: "",
      printerval_max: "",
      tachyhr_lower: "",
      tachyhr_upper: "",
      bradyhr_lower: "",
      bradyhr_upper: "",
      pauselength: "",
      graph_gen: "",
    });
    axios
      .get(apiUrl + "api/patients/settings?userid=" + userid)
      .then((res) => {
        var data = res.data;
        this.setState(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    if (localStorage.jwtToken == undefined) {
      window.location.href = "/";
    }
    const { errors, patients } = this.state;
    /* const { errors,doctors } = this.state;*/

    let doctorsList =
      this.state.doctors.length > 0 &&
      this.state.doctors.map((item, i) => {
        return (
          <option
            key={i}
            value={item._id}
            selected={this.state.doctor_name == item.name}
          >
            {item.name}
          </option>
        );
      }, this);

    return (
      <div className="wrapper theme-1-active box-layout pimary-color-green">
        <TopNav profileLink={this.state.profileLink} />
        <SideBar menus={this.state.menus} />
        <div className="right-sidebar-backdrop"></div>
        <div className="page-wrapper">
          <div className="container-fluid">
            <div id="editDiaryModal" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                    >
                      &times;
                    </button>
                    <h4 className="modal-title text-center">Add Diary Notes</h4>
                    <form method="post" onSubmit={this.onSubmitDiary}>
                      <div className="modal-body">
                        <div className="row row-sm-offset">
                          <br />
                          <div className="col-md-6 multi-horizontal">
                            <div className="form-group">
                              <label className="form-control-label mbr-fonts-style display-7">
                                {" "}
                                TIME{" "}
                              </label>
                              <div
                                className="input-group date"
                                id="datetimepicker2"
                              >
                                <input
                                  id="addTime"
                                  type="text"
                                  className={classnames("form-control", {
                                    errors: errors.time,
                                  })}
                                  onBlur={this.onChange}
                                  value={this.state.time}
                                  name="time"
                                />
                                <span className="input-group-addon">
                                  <span className="fa fa-calendar"></span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row row-sm-offset">
                          <br />
                          <div className="col-md-6 multi-horizontal">
                            <div className="form-group">
                              <label className="form-control-label mbr-fonts-style display-7">
                                Activity
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="activity"
                                onChange={this.onChange}
                                value={this.state.activity}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 multi-horizontal">
                            <div className="form-group">
                              <label className="form-control-label mbr-fonts-style display-7">
                                Duration
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="act_duration"
                                onChange={this.onChange}
                                value={this.state.act_duration}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row row-sm-offset">
                          <br />

                          <div className="col-md-12 multi-horizontal">
                            <div className="form-group">
                              <label className="form-control-label mbr-fonts-style display-7">
                                Note
                              </label>
                              <textarea
                                type="textarea"
                                className="form-control"
                                name="addNote"
                                onChange={this.onChange}
                                value={this.state.addNote}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <div className="row row-sm-offset">
                          <div className="col-md-6 multi-horizontal">
                            <button type="submit" className="btn btn-success">
                              Submit
                            </button>
                          </div>
                          <div className="col-md-6 multi-horizontal text-left">
                            <button
                              id=""
                              type="button"
                              className="btn btn-default closePopup"
                              data-dismiss="modal"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div id="editInfoModal" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                    >
                      &times;
                    </button>
                    <h4 className="modal-title text-center">
                      Edit Patient Information
                    </h4>
                  </div>
                  <form method="post" onSubmit={this.onSubmitInfo}>
                    <div className="modal-body">
                      <div className="row row-sm-offset">
                        <br />
                        <div className="col-md-6 multi-horizontal">
                          <div className="form-group">
                            <label className="form-control-label mbr-fonts-style display-7"
                             style={{ color: 'Black' }}
                             >
                              Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="patient_name"
                              onChange={this.onChange}
                              value={this.state.patient_name}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 multi-horizontal">
                          <div className="form-group">
                            <label className="form-control-label mbr-fonts-style display-7"
                             style={{ color: 'Black' }}
                             >
                              Doctor
                            </label>
                            <select
                              name="doctor_id"
                              className={classnames("form-control", {
                                errors: errors.doctor_id,
                              })}
                              onChange={this.onChange}
                              id="doctor_id"
                            >
                              <option value="Choose">Choose Doctor</option>
                              {doctorsList}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row row-sm-offset">
                        <br />
                        <div className="col-md-6 multi-horizontal">
                          <div className="form-group">
                            <label className="form-control-label mbr-fonts-style display-7"
                             style={{ color: 'Black' }}
                             >
                              Hospital Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="hospital"
                              onChange={this.onChange}
                              value={this.state.hospital}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 multi-horizontal">
                          <div className="form-group">
                            <label className="form-control-label mbr-fonts-style display-7"
                             style={{ color: 'Black' }}
                             >
                              Phone
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="phone"
                              onChange={this.onChange}
                              value={this.state.phone}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row row-sm-offset">
                        <br />
                        <div className="col-md-6 multi-horizontal">
                          <div className="form-group">
                            <label className="form-control-label mbr-fonts-style display-7"
                            style={{ color: 'Black' }}
                             >
                              Support Person
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="supportP"
                              onChange={this.onChange}
                              value={this.state.supportP}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 multi-horizontal">
                          <div className="form-group">
                            <label className="form-control-label mbr-fonts-style display-7"
                             style={{ color: 'Black' }}
                             >
                              {" "}
                              Support Time{" "}
                            </label>
                            <div
                              className="input-group date"
                              id="datetimepicker1"
                            >
                              <input
                                type="text"
                                className={classnames("form-control", {
                                  errors: errors.supportT,
                                })}
                                onBlur={this.onChange}
                                value={this.state.supportT}
                                name="supportT"
                              />
                              <span className="input-group-addon">
                                <span className="fa fa-calendar"></span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row row-sm-offset">
                        <br />
                        <div className="col-md-6 multi-horizontal">
                          <div className="form-group">
                            <label className="form-control-label mbr-fonts-style display-7"
                            style={{ color: 'Black' }}
                             >
                              Payment
                            </label>
                            <select
                              name="payment"
                              className="form-control"
                              value={this.state.payment}
                              onChange={this.onChange}
                            >
                              <option value="">Choose </option>
                              <option value="Unpaid">Unpaid</option>
                              <option value="Paid">Paid</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6 multi-horizontal">
                          <div className="form-group">
                            <label className="form-control-label mbr-fonts-style display-7"
                             style={{ color: 'Black' }}
                             >
                              Priority
                            </label>
                            <select
                              name="priority"
                              className="form-control"
                              value={this.state.priority}
                              onChange={this.onChange}
                            >
                              <option value="">Choose </option>
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row row-sm-offset">
                        <br />
                        <div className="col-md-6 multi-horizontal">
                          <div className="form-group">
                            <label className="form-control-label mbr-fonts-style display-7"
                             style={{ color: 'Black' }}
                             >
                              Symptoms
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="indication"
                              onChange={this.onChange}
                              value={this.state.indication}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <div className="row row-sm-offset">
                        <div className="col-md-6 multi-horizontal">
                          <button type="submit" className="btn btn-success">
                            Submit
                          </button>
                        </div>
                        <div className="col-md-6 multi-horizontal text-left">
                          <button
                            id=""
                            type="button"
                            className="btn btn-default closePopup"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="panel panel-default card-view">
                  <div className="panel-heading">
                    <div className="pull-left">
                      <h6 className="panel-title txt-dark">Patient List</h6>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  <div className="panel-wrapper collapse in">
                    <div className="panel-body">
                      <MDBDataTable
                        id="mbdTable"
                        scrollX
                        noBottomColumns
                        data={this.state.data}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  
  }
}
class YourComponent extends Component {
  state = {
    showModal: false,
    batteryPercentage: null,
  };

  BatteryPercentageClicked = (e) => {
    var userid = e.currentTarget.id;
    axios
      .get('https://web.mybiocalculus.com/html/welcome/BatteryPercentage/?userid=' + userid)
      .then(res => {
        console.log(res.data);
        this.setState({ batteryPercentage: res.data, showModal: true });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    const { patient } = this.props;
    const { showModal, batteryPercentage } = this.state;

    return (
      <>
        <button
          type="button"
          className="btn btn-danger mr-20"
          id={patient._id}
          onClick={this.BatteryPercentageClicked}
        >
          {patient.BatteryPercentage}%
        </button>

        <Modal
          isOpen={showModal}
          onRequestClose={this.handleCloseModal}
          contentLabel="Battery Percentage"
          style={{
            content: {
              color: 'black',
              width: '50%', 
              maxWidth: '800px', 
              margin: 'auto',
            },
          }}
        >
          <h2 style={{ color: 'black' }}>Battery Percentage</h2>
          {batteryPercentage !== null ? (
            <p style={{ color: 'black' }}>Battery percentage is: {batteryPercentage.split('\n').map((item, key) => {
              return <span key={key}>{item}<br/></span>
            })}</p>
          ) : (
            <p style={{ color: 'black' }}>Loading...</p>
          )}
          <button onClick={this.handleCloseModal}>Close</button>
        </Modal>
      </>
    );
  }
}




export default PatientInfo;
