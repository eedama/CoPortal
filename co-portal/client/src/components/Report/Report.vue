<template>
  <div>
    <div class="row" v-if="currentPage == -1">
      <div class="col s10 offset-s1 m8 offset-m2 row card-panel">
        <div class="col s12">
          <h4 style="text-align:center;font-family:'open sans';"><strong>Report a student</strong></h4>
          <div class="card-image col l8 offset-l2 m6 offset-m3 s12 mb-lg-4">
            <img class="img-responsive" src="static/img/coPortalLogo.jpg">
          </div>
        </div>
        <div class="col s12">
        </div>
        <div class="col m8 offset-m2 s12">
          <p class="center-align red-text" v-show="txtError.length > 2">{{ txtError }}</p>
        </div>
        <div class="row" style="display:none;">
        </div>
        <div class="select-container row mt-5">
          <select v-model="Report.Student" class="custom-select custom-selected waves-effect">
                      <option  disabled value="" >Select student</option>
                   <option class="select-option" v-for="(student,t) in students"  :key="t" v-bind:value="student.name"  >{{student.name}}</option>
                    </select>
        </div>
        <div class="row">
          <div v-on:click="GoToNextPage(false)" class="col m4 offset-m4 s12 pointer center-align waves-effect">
            <div class="card-panel hoverable">
              <h5 class="text-xs-center">Next <i class="material-icons right">exit_to_app</i> </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="currentPage == 0">
      <div class="col s10 offset-s1 m8 offset-m2 row card-panel">
        <div class="col s12">
          <br>
          <div class="card-image col l8 offset-l2 m6 offset-m3 s12 mb-lg-4">
            <img class="img-responsive" src="static/img/coPortalLogo.jpg">
          </div>
          <md-button v-on:click="currentPage = -1" class="md-fab">
            <md-icon>close</md-icon>
          </md-button>
        </div>
        <div class="col s12">
        </div>
        <div class="col m8 offset-m2 s12">
          <p class="center-align red-text" v-show="txtError.length > 2">{{ txtError }}</p>
        </div>
        <div class="row">
          <div class="card-panel hoverable pointer  text-center col s10 offset-m1 offset-s1">
            <div class="Report-que-container">
              <div class="Report-que-header">
                Select subject to report <span class="report-imp">*</span>
              </div>
              <div class="Report-que-body">
                <div style="float:left;" v-for="(subject,g) in Subjects" :key="g">
                  <input :id="g" name="Subject" :value="subject" v-model="Report.Subject" type="radio"><label :for="g">{{subject}}</label>
                </div>
              </div>
              <div style="height:40px;width:100%;"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="card-panel hoverable pointer  text-center col s10 offset-m1 offset-s1">
            <div class="Report-que-container">
              <div class="Report-que-header">
                Type your report <span class="report-imp">*</span>
              </div>
              <div class="Report-que-body">
                <input placeholder="1000 words" v-model="Report.Message" class="with-gap center-align" maxlength="1000" type="text" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="card-panel hoverable pointer  text-center col s10 offset-m1 offset-s1">
            <div class="Report-que-container">
              <div class="Report-que-header">
                Select method <span class="report-imp">*</span>
              </div>
              <div class="Report-que-body">
                <input id="toggle-on1" name="toggle2" value="Email" v-model="Report.Method" type="radio"><label for="toggle-on1">Email</label>
                <input id="toggle-off2" name="toggle2" value="Phone" v-model="Report.Method" type="radio"><label for="toggle-off2">Phone</label>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div v-on:click="GoToNextPage(false)" class="col m4 offset-m4 s12 pointer center-align waves-effect">
            <div class="card-panel hoverable">
              <h5 class="text-xs-center">Next <i class="material-icons right">exit_to_app</i> </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="currentPage == 1">
      <div class="col s10 offset-s1 m8 offset-m2 row card-panel">
        <div class="col s12">
          <md-button v-on:click="currentPage = -1" class="md-fab">
            <md-icon>close</md-icon>
          </md-button>
        </div>
        <div class="col s12">
          <div class="card-image col l8 offset-l2 m6 offset-m3 s12 mb-lg-4">
            <img class="img-responsive" src="https://coportal.net/static/img/coPortalLogo.jpg">
          </div>
        </div>
        <div class="col m8 offset-m2 s12">
          <p class="center-align red-text" v-show="txtError.length > 2">{{ txtError }}</p>
        </div>
        <div class="row">
          <div ref="emailCard" class="Email-cards">
            <div class="Email-header" style="font-size:20px;font-family:sans-serif;letter-spacing:1px; box-sizing:border-box; margin-top:60px;">
              <img class="corportal" align="left" style="width:160px;height:auto;margin-top:-40px;" src="https://coportal.net/static/img/logo.1328452.png">
              <span style="">Coportal Communication</span>
            </div>
            <div class="Email-message-header" style="margin-left:15px;margin-top:90px;">
              <h5 style="font-weight:50;margin-bottom:20px">Dear Parent/Guardian</h5>
              <div>
                Please read the following report concerning <strong style="font-weight:bold;">{{Report.Student}}</strong> for
                <strong style="font-weight:bold;">{{Report.Subject}}</strong> (Subject)
              </div>
              <div style="margin-top:10px;margin-bottom:10px;">
                The report is as follows :
              </div>
              <strong style="font-size:22px;font-weight:bold;">
                     {{Report.Message}}
                    </strong>
              <div style="margin-top:20px;margin-bottom:30px">
                This report was sent to you by <strong style="font-weight:bold;"> {{Report.Teacher}}</strong> (Teacher)
              </div>
              Best Regards,
              <br><span>Coportal Communication</span>
              <br><img class="corportal" align="left" style="width:160px;height:auto;opacity:0.1" src="https://coportal.net/static/img/coPortalLogo.jpg">
            </div>
          </div>
        </div>
        <div class="row">
          <div v-on:click="GoToNextPage(true)" class="col m4 offset-m4 s12 pointer center-align waves-effect">
            <div class="card-panel hoverable">
              <h5 class="text-xs-center">Send <i class="material-icons right">exit_to_app</i> </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
const axios = require("axios");

export default {
  name: "Test",
  watch: {
    surveyAnswers(newVal, oldVal) {
      this.$forceUpdate();
    }
  },
  data() {
    return {
      txtError: "",
      Questionare: [],
      currentPage: -1,
      Subjects: [],
      Report: {
        Student: "",
        StudentID: "",
        Teacher: this.$store.state.user.username,
        TeacherID: this.$store.state.user.id,
        Subject: "",
        Method: "",
        Message: ""
      },
      students: []
    };
  },
  mounted() {
    axios
      .get(this.$store.state.settings.baseLink + "/s/students/all")
      .then(results => {
        results.data.forEach(element => {
          var SubjectHolder = new Array();
          element.modules.forEach(value => {
            SubjectHolder.push(value.name);
          });
          this.students.push({
            name: element.firstname + " " + element.lastname,
            Subjects: SubjectHolder,
            id: element._id
          });
        });
      })
      .catch(err => {
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal("Unable to load Report", "Try again later", "error");
        }
      });
  },
  methods: {
    FindSubject() {
      this.students.forEach(element => {
        if (element.name == this.Report.Student) {
          this.Subjects = element.Subjects;
          this.Report.StudentID = element.id;
        }
      });
    },
    GoToNextPage(final) {
      if (this.currentPage == -1) {
        if (this.Report.Student == "") {
          this.txtError = "Please select a student";
        } else {
          this.currentPage++;
          this.FindSubject();
          this.txtError = "";
        }
      } else if (this.currentPage == 0) {
        if (this.Report.Subject == "") {
          this.txtError = "Please select a Subject to report";
        } else if (this.Report.Message.length < 3) {
          this.txtError = "Please type in a Report";
        } else if (this.Report.Method == "") {
          this.txtError = "Please select a Method";
        } else {
          this.currentPage++;
          this.txtError = "";
        }
      } else if (this.currentPage == 1 && final) {
        var htmlTemplate = new XMLSerializer().serializeToString(
          this.$refs.emailCard
        );
        axios
          .post(this.$store.state.settings.baseLink + "/l/report/student", {
            studentID: this.Report.StudentID,
            teacherID: this.Report.TeacherID,
            subject: this.Report.Subject,
            method: this.Report.Method,
            message: this.Report.Message,
            html: htmlTemplate
          })
          .then(results => {
            if (results) {
              swal("Report successfully sent", results.data, "success");
              this.$router.push("/");
            }
          })
          .catch(err => {
            this.isLoading = false;
            if (err.response != null && err.response.status == 512) {
              this.txtError = err.response.data;
            } else {
              swal("Unable to Send report", "Try again later", "error");
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.select-container {
  text-align: center;
  max-width: 400px;
  min-width: 100%;
  margin: auto;
  margin-bottom: 30px;
}

.custom-selected {
  border: none;
  max-width: 400px;
  min-width: 100%;
  height: 60px;
  box-shadow: 0px 0px 10px 2px lightgrey;
  text-align-last: center;
}

input[type="radio"] {
  display: none;
}

label {
  padding: 10px 20px;
  box-shadow: 0px 0px 5px 1px lightgrey;
  margin: 5px;
  display: inline-block;
  cursor: pointer;
  color: black;
  min-width: 210px;
  text-align: center;
  font-family: "open sans";
}

input[type="radio"]:checked + label {
  background-color: rgb(36, 36, 36);
  cursor: default;
  color: ghostwhite;
}

.Report-que-header {
  width: 100%;
  margin-top: 10px;
  min-height: 30px;
  box-sizing: border-box;
  padding-left: 8px;
  padding-top: 3px;
  padding-bottom: 5px;
  color: black;
  font-size: 17px;
}

.report-imp {
  color: red;
  font-size: 11px;
}

.Report-que-body {
  width: 100%;
  min-height: 30px;
  margin-top: 10px;
  box-sizing: border-box;
  padding-left: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.Email-cards {
  overflow-x: hidden;
  overflow-y: hidden;
  min-height: 50px;
  height: auto;
  width: 90%;
  margin: auto;
  box-shadow: 0px 0px 12px 2px lightgrey;
  padding-bottom: 20px;
  color: black;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.select-wrapper input.select-dropdown {
  display: none;
  z-index: 1;
}
</style>
