<template>
  <div>
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
        <a v-on:click="addingModules = !addingModules" :class="{'red':addingModules}" class="btn waves-effect">{{ !addingModules ? 'Add Module' : 'Cancel'}}</a>
      </div>
    </div>
    <div v-if="addingModules" class="row valign-wrapper" style="height:80vh">
      <div class="col m6 offset-m3 col s12 center-align">
        <div class="card row">
          <div class="card-content">
            <div class="row">
              <div class="col s12 center-align">
                <h5>Adding a module</h5>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="module.name" id="ModuleName" name="ModuleName" type="text" />
                <label class="text-center" for="ModuleName">Module name</label>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="module.code" id="ModuleCode" name="ModuleCode" type="text" />
                <label class="text-center" for="ModuleCode">Module code</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                <input v-model="module.description" id="ModuleDescription" name="ModuleDescription" type="text" />
                <label class="text-center" for="ModuleDescription">Module description</label>
              </div>
            </div>
            <div class="row" v-show="txtError.length > 0">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <label class="text-center red-text">{{ txtError }}</label>
              </div>
            </div>
            <div class="row">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <input v-on:click="SubmitModule()" type="submit" value="Submit module" class="btn center-align tg-btn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!addingModules" class="row">
      <div class="col s12">
        <table class="highlight card" v-show="modules && modules.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Lecturers</th>
              <th>Total students</th>
            </tr>
          </thead>
  
          <tbody>
            <tr v-for="(module,i) in modules" :key="i">
              <td>{{ module.name }}</td>
              <td>{{ module.code }}</td>
              <td>{{ module.description }}</td>
              <td>
                <a v-for="lecturer in module.lecturers" :key="lecturer._id">
                      {{ l.lastname }} {{ l.firstname }}
                    </a>
              </td>
              <td>{{ module.students.length }}</td>
            </tr>
          </tbody>
        </table>
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
      module: {
        name: "",
        code: "",
        description: ""
      },
      addingModules: false,
      modules: [],
      selectedStudent: null
    };
  },
  computed: {
    txtSearch: {
      get() {
        return this._txtSearch;
      },
      set(v) {
        // FIlter modules
        this._txtSearch = v;
      }
    }
  },
  mounted() {
    axios
      .get(this.$store.state.settings.baseLink + "/m/modules/all")
      .then(results => {
        this.modules = results.data;
        console.log(this.modules);
        this.modules.map(s => {
          s.show = true;
        });
      })
      .catch(err => {
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal("Unable to load modules", "Try again later", "error");
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
    GetPastTestsFor(module) {
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/s/all/past/tests/for/" +
            module._id
        )
        .then(results => {
          this.modules.map(s => {
            if (s._id == module._id) {
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
            swal("Unable to load modules", err.message, "error");
          }
        });
    },
    SubmitModule() {
      this.txtError = "";
      if (this.module.name.length < 2) {
        this.txtError = "Please enter a valid module name";
      }

      if (this.module.code.length < 2) {
        this.txtError = "Please enter a valid module code";
      }

      if (this.txtError.length > 2) return;

      axios
        .post(this.$store.state.settings.baseLink + "/m/add/new/module", {
          module: this.module
        })
        .then(results => {
          this.modules = results.data;
          this.addingModules = false;
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal("Unable to submit the module", err.message, "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

