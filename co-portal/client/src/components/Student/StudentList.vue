<template>
  <div>
    <div class="row">
      <div class="col s8 offset-s2">
        <md-button v-on:click="$router.back()" class="right">
            <md-icon>keyboard_backspace</md-icon>
          <span>Back</span>
        </md-button>
      </div>
    </div>
    <div class="row">
      <div class="col s10 offset-s1 m8 offset-m3 l6 offset-l3 ">
        <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
          <input v-on:keypress.enter="DeepSearch" v-model="txtSearch" id="Password" name="Search" type="search" />
          <label class="text-center" for="Search">Search</label>
        </div>
      </div>
    </div>
  
    <div class="row">
      <div class="col s8 offset-s2 center-align">
        <a v-on:click="addingStudents = !addingStudents" :class="{'red':addingStudents}" class="btn waves-effect">{{ !addingStudents ? 'Add Student' : 'Cancel'}}</a>
      </div>
    </div>
    <div v-if="addingStudents" class="row valign-wrapper" style="height:80vh">
      <div class="col m6 offset-m3 col s12 center-align">
        <div class="card row">
          <div class="card-content">
            <div class="row">
              <div class="col s12 center-align">
                <h5>Adding a student</h5>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="student.firstname" id="Firstname" name="Firstname" type="text" />
                <label class="text-center" for="Firstname">Firstname</label>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="student.lastname" id="Lastname" name="Lastname" type="text" />
                <label class="text-center" for="Lastname">Lastname</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                <input v-model="student.username" id="Username" name="Username" type="text" />
                <label class="text-center" for="Username">Username</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="student.password" id="Password" name="Password" type="password" />
                <label class="text-center" for="Password">Password</label>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="student.confirmPassword" id="ConfirmPassword" name="ConfirmPassword" type="password" />
                <label class="text-center" for="ConfirmPassword">Confirm Password</label>
              </div>
            </div>
            <div class="row" v-show="txtError.length > 0">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <label class="text-center red-text">{{ txtError }}</label>
              </div>
            </div>
            <div class="row">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <input v-on:click="SubmitStudent()" type="submit" value="Submit student" class="btn center-align tg-btn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!addingStudents" class="row">
      <div v-if="student != null" v-for="(student,i) in students" :key="i" class="contact-area col s12 m6 l4 xl3">
        <div class="contact">
          <main v-if="selectedStudent == null || selectedStudent != student">
            <section>
              <div class="content">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/256492/_mLIxaKY_400x400.jpg" alt="Profile Image">
                <aside>
                  <h1 class="white-text valign-wrapper">{{ student.lastname }} {{ student.firstname}}</h1>
                </aside>
  
                <button v-on:click="GetPastTestsFor(student)" class="pointer waves-effect">
                          <span>Past tests</span>
                  </button>
              </div>
  
            </section>
  
  
          </main>
          <div v-if="selectedStudent != null && selectedStudent == student">
            <main>
              <section>
                <div class="content">
                  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/256492/_mLIxaKY_400x400.jpg" alt="Profile Image">
  
                  <aside>
                    <h1 class="white-text valign-wrapper">{{ student.lastname }} {{ student.firstname}}</h1>
                  </aside>
  
                  <button v-on:click="selectedStudent = null" class="pointer waves-effect" :class="{'active': selectedStudent == student}">
                                            <span>Cancel</span>
                                
                                         <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"> <g class="nc-icon-wrapper" fill="#444444"> <path d="M14.83 30.83L24 21.66l9.17 9.17L36 28 24 16 12 28z"></path> </g> </svg>
                     </button>
                </div>
                <div class="title" :class="{'active': selectedStudent == student}">
                  <p>Past tests</p>
                </div>
  
              </section>
            </main>
            <nav :class="{'active': selectedStudent == student}">
              <a v-on:click="goToSolution(pastTest.solutionId)" v-for="(pastTest,v) in selectedStudent.pastTests" :key="v" href="#" class="facebook waves-effect">
                <div class="content">
                  <h1>{{pastTest.title}}</h1>
                  <span></span>
                  <h1 class="black-text">{{pastTest.mark}}</h1>
                </div>
  
                <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"> <g class="nc-icon-wrapper" fill="#444444"> <path d="M17.17 32.92l9.17-9.17-9.17-9.17L20 11.75l12 12-12 12z"></path> </g> </svg>
              </a>
            </nav>
  
          </div>
        </div>
      </div>
  
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
import * as moment from "moment";

const axios = require("axios");

export default {
  name: "StidentList",
  data() {
    return {
      _txtSearch: "",
      txtError: "",
      student: {
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        confirmPassword: ""
      },
      addingStudents: false,
      students: [],
      selectedStudent: null
    };
  },
  computed: {
    txtSearch: {
      get() {
        return this._txtSearch;
      },
      set(v) {
        // FIlter students
        this._txtSearch = v;
      }
    }
  },
  mounted() {
    axios
      .get(this.$store.state.settings.baseLink + "/s/students/all")
      .then(results => {
        this.students = results.data;
        console.log(this.students);
        this.students.map(s => {
          s.show = true;
        });
      })
      .catch(err => {
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal("Unable to load students", "Try again later", "error");
        }
      });
  },
  methods: {
    DeepSearch() {
      alert("Deep searching for " + this.txtSearch);
    },
    getMoment(value) {
      return moment(value);
    },
    goToSolution(solutionId) {
      this.$router.push({
        name: "TestMarks",
        params: {
          solutionId: solutionId
        }
      });
    },
    GetPastTestsFor(student) {
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/s/all/past/tests/for/" +
            student._id
        )
        .then(results => {
          this.students.map(s => {
            if (s._id == student._id) {
              s.pastTests = [];
              results.data.forEach(element => {
                s.pastTests.push({
                  solutionId: element.solutionId,
                  title: element.title,
                  mark: element.mark,
                  date: element.date
                });
              });
              this.selectedStudent = s;
            }
          });
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal("Unable to load students", err.message, "error");
          }
        });
    },
    SubmitStudent() {
      this.txtError = "";
      if (this.student.lastname.length < 2) {
        this.txtError = "Please enter a valid lastname";
      }

      if (this.student.firstname.length < 2) {
        this.txtError = "Please enter a valid firstname";
      }

      if (this.student.password != this.student.confirmPassword) {
        this.txtError = "Passwords do not match";
      }

      if (this.student.password.length < 6) {
        this.txtError =
          "Please enter a valid password , passwords must be more than 6 charactors long";
      }
      if (this.student.username.length < 2) {
        this.txtError = "Please enter a valid username";
      }

      if (this.txtError.length > 2) return;

      axios
        .post(this.$store.state.settings.baseLink + "/a/add/student", {
          student: this.student
        })
        .then(results => {
          this.students = results.data;
          this.addingStudents = false;
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal("Unable to submit the student", err.message, "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* COLORS
                ========================================== */

/* MIXINS
                ========================================== */

/* RESET
                ========================================== */

.contact *,
.contact *:before,
.contact *:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* CONTACT
                ========================================== */

.contact-area {
  width: 100%;
  position: relative;
}

.contact {
  position: relative;
  max-width: 420px;
  padding: 40px 20px;
  overflow: hidden;
  margin: 0 auto;
}

.contact main {
  float: left;
  width: 100%;
  position: relative;
}

.contact main section {
  border-radius: 5px;
  float: left;
  width: 100%;
  background-color: black;
}

.contact main section .content {
  float: left;
  width: 100%;
  padding: 20px 30px 50px 30px;
  position: relative;
  text-align: center;
}

@media (min-width: 414px) {
  .contact main section .content {
    text-align: left;
  }
}

.contact main section .content img {
  display: inline-block;
  width: 140px;
  border-radius: 50%;
}

@media (min-width: 414px) {
  .contact main section .content img {
    float: left;
    width: 30%;
    margin-right: 10%;
  }
}

.contact main section .content aside {
  float: left;
  width: 100%;
  color: white;
  margin-top: 10px;
}

@media (min-width: 414px) {
  .contact main section .content aside {
    width: 60%;
  }
}

.contact main section .content aside h1 {
  color: white;
  font-size: 26px;
  margin-bottom: 10px;
}

.contact main section .content aside p {
  font-size: 14px;
  font-weight: 10;
  letter-spacing: 0.5px;
  line-height: 160%;
}

.contact main .title {
  float: left;
  width: 100%;
  background-color: #c63535;
  max-height: 0px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: hidden;
  -webkit-transition: all 0.55s;
  -moz-transition: all 0.55s;
  -o-transition: all 0.55s;
  transition: all 0.55s;
}

.contact main .title.active {
  max-height: 100px;
  -webkit-transition: all 1.3s;
  -moz-transition: all 1.3s;
  -o-transition: all 1.3s;
  transition: all 1.3s;
}

.contact main .title.active p {
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  transform: scale(1);
  transition-delay: 0.2s;
}

.contact main .title p {
  padding: 15px 30px;
  color: white;
  font-size: 16px;
  display: inline-block;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  -webkit-transform: scale(0);
  -moz-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transform: scale(0);
}

.contact main button {
  position: absolute;
  bottom: 0;
  right: 50%;
  background-color: white;
  color: black;
  border: 0;
  width: 200px;
  height: 48px;
  text-align: center;
  border-radius: 30px;
  font-size: 16px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: -24px;
  margin-right: -100px;
  -webkit-transition: all 0.4s;
  -moz-transition: all 0.4s;
  -o-transition: all 0.4s;
  transition: all 0.4s;
  transition-delay: 0.1s;
  outline: none;
  overflow: hidden;
  z-index: 10;
  font-family: inherit;
}

.contact main button span {
  opacity: 1;
  -webkit-transition: opacity 0.2s;
  -moz-transition: opacity 0.2s;
  -o-transition: opacity 0.2s;
  transition: opacity 0.2s;
  transition-delay: 0.4s;
  display: block;
  width: 200px;
  float: left;
  padding: 15px 0px;
}

.contact main button svg {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  opacity: 0;
  -webkit-transition: all 0.4s;
  -moz-transition: all 0.4s;
  -o-transition: all 0.4s;
  transition: all 0.4s;
}

.contact main button svg path {
  fill: black;
}

.contact main button.active {
  margin-right: 0;
  right: 20px;
  width: 65px;
  height: 65px;
  margin-bottom: -32.5px;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 65px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
}

.contact main button.active span {
  opacity: 0;
  transition-delay: 0s;
  width: 200px;
}

.contact main button.active svg {
  opacity: 1;
  transition-delay: 0.5s;
}

.contact nav {
  float: left;
  width: 100%;
  height: 0px;
  display: block;
  overflow: hidden;
  max-height: 0px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.contact nav.active {
  height: 100%;
  max-height: 600px;
  -webkit-transition: all 1s;
  -moz-transition: all 1s;
  -o-transition: all 1s;
  transition: all 1s;
}

.contact nav.active a {
  opacity: 1;
  -webkit-transform: translateY(0px);
  -moz-transform: translateY(0px);
  -ms-transform: translateY(0px);
  -o-transform: translateY(0px);
  transform: translateY(0px);
  -webkit-transition: all 0.7s;
  -moz-transition: all 0.7s;
  -o-transition: all 0.7s;
  transition: all 0.7s;
}

.contact nav.active a:nth-of-type(1) {
  transition-delay: 0.5s;
}

.contact nav.active a:nth-of-type(2) {
  transition-delay: 0.7s;
}

.contact nav.active a:nth-of-type(3) {
  transition-delay: 0.9s;
}

.contact nav a {
  float: left;
  width: 100%;
  margin-top: 18px;
  background-color: #ffffff;
  padding: 18px 20px;
  border-radius: 5px;
  text-decoration: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  opacity: 0;
  -webkit-transform: translateY(-10px);
  -moz-transform: translateY(-10px);
  -ms-transform: translateY(-10px);
  -o-transform: translateY(-10px);
  transform: translateY(-10px);
  position: relative;
}

@media (min-width: 414px) {
  .contact nav a {
    padding: 18px 30px;
  }
}

.contact nav a .arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
}

.contact nav a .arrow path {
  fill: #e6e6e6;
}

.contact nav a.gmail .content h1 {
  color: #d14836;
}

.contact nav a.facebook .content h1 {
  color: #3b5998;
}

.contact nav a.twitter .content h1 {
  color: #1da1f2;
}

.contact nav a .content h1 {
  font-size: 20px;
  font-weight: 400;
  line-height: 160%;
  letter-spacing: 0.4px;
}

.contact nav a .content span {
  font-size: 14px;
  color: #b3b3b3;
  display: block;
  letter-spacing: 0.4px;
}
</style>

