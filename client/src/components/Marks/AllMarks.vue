<template>
  <div class="screen">

    <v-row>
      <v-col cols="10"> </v-col>
      <v-col cols="2">
        <v-btn right v-on:click="$router.back()" class="primary justify-end">
          <v-icon>mdi-keyboard-backspace</v-icon>
          <span class="px-2">Back</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
        <v-col sm="12" md="6" offset-md="3">
      <v-text-field
        class="text-center mx-auto text-xs-center"
        color="secondary"
        label="Search"
        solo
        block
        prepend-inner-icon="mdi-magnify" 
        v-model="txtSearch"
      >
      </v-text-field>
    </v-col>
    </v-row>
    <v-row>
      <v-col class="col s12 m3 row">
         <v-tabs grow>
          <v-tab v-for="(module,i) in filteredModules" :key="i" id="tab-announcements">
            {{ module.name }} {{ module.code }}
          </v-tab>
         </v-tabs>
        <div class="col s12 center">
          <md-subheader><label class="markValue">Modules</label></md-subheader>
        </div>
        <div class="col s6 m12 pointer center-align waves-effect" v-on:click="selectedModuleIndex = i" v-for="(module,i) in filteredModules" :key="i">
          <div class="hoverable card-panel" :class="{'black':selectedModuleIndex==i}">
            <h6 class="center-align">
              <span>
                                      <br /><label class="center-align"></label></span></h6>
          </div>
        </div>
      </v-col>
      <v-col class="col s12 m9 row card-panel" v-if="currentModule == null">
        <md-empty-state md-icon="" md-label="No module selected" md-description="Please click on a module">
        </md-empty-state>
      </v-col>
      <v-col class="col s12 m9 row center-align" v-if="currentModule != null">
        <md-card class="white col s12 m10 offset-m1 center">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{ currentModule.name }}</div>
              <div class="md-subhead">{{ currentModule.code }}</div>
            </md-card-header-text>
  
            <md-menu md-size="big" md-direction="bottom-end">
              <md-button class="md-icon-button" v-on:click="selectedModuleIndex = null">
                <md-icon>close</md-icon>
              </md-button>
            </md-menu>
          </md-card-header>
  
          <md-card-expand>
            <md-card-content v-show="!currentModule.marks">
              <div class="row">
                <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
                  <ball-pulse-loader v-if="!currentModule.marks" color="#000000" size="20px"></ball-pulse-loader>
                </div>
              </div>
            </md-card-content>
            <md-card-content v-if="currentModule.marks">
              <div class="row">
                <md-list class="col s12 l4 md-double-line" style="border-right:3px solid #eeeeee">
                  <md-subheader class="testHeading">
                    <h6>Tests and Practicals</h6>
                  </md-subheader>
                  <md-list-item class="pointer  waves-effect" v-for="(marksheet,k) in currentModule.marks.PRACTICALTEST" :key="k">
                    <div class="md-list-item-text">
                      <span>{{ marksheet.title }}</span>
                      <label class="md-primary"> {{ getMoment(marksheet.date).format('DD/MM/YYYY') }}</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">{{ marksheet.mark }} /</span> <span>{{ marksheet.total }}</span></label>
                    </div>
                  </md-list-item>
                  <md-list-item v-if="currentModule.marks.PRACTICALTEST && currentModule.marks.PRACTICALTEST.length > 0">
                    <div class="md-list-item-text">
                      <label>Average</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">{{ currentModule.marks.PRACTICALTEST.map(v => v.mark).reduce((a, b) => a + b, 0) / currentModule.marks.PRACTICALTEST.length }}</span></label>
                    </div>
                  </md-list-item>
                </md-list>
                <md-list class="col s12 l4 md-double-line" style="border-right:3px solid #eeeeee">
                  <md-subheader class="testHeading">
                    <h6>Class tests and Homeworks</h6>
                  </md-subheader>
                  <md-list-item class="pointer  waves-effect" v-for="(marksheet,k) in currentModule.marks.THEORYTEST" :key="k">
                    <div class="md-list-item-text">
                      <span>{{ marksheet.title }}</span>
                      <label class="md-primary"> {{ getMoment(marksheet.date).format('DD/MM/YYYY') }}</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">{{ marksheet.mark }} /</span> <span>{{ marksheet.total }}</span></label>
                    </div>
                  </md-list-item>
                  <md-list-item v-if="currentModule.marks.THEORYTEST && currentModule.marks.THEORYTEST.length > 0">
                    <div class="md-list-item-text">
                      <label>Average</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">{{ currentModule.marks.THEORYTEST.map(v => v.mark).reduce((a, b) => a + b, 0) / currentModule.marks.THEORYTEST.length }}</span></label>
                    </div>
                  </md-list-item>
                </md-list>
                <md-list class="col s12 l4 md-double-line">
                  <md-subheader class="testHeading">
                    <h6>Online tests and assignments</h6>
                  </md-subheader>
                  <md-list-item class="pointer  waves-effect" v-for="(marksheet,k) in currentModule.marks.ONLINETEST" :key="k">
                    <div class="md-list-item-text">
                      <span>{{ marksheet.title }}</span>
                      <label class="md-primary"> {{ getMoment(marksheet.date).format('DD/MM/YYYY') }}</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">{{ marksheet.mark }} /</span> <span>{{ marksheet.total }}</span></label>
                    </div>
                  </md-list-item>
                  <md-list-item v-if="currentModule.marks.ONLINETEST && currentModule.marks.ONLINETEST.length > 0">
                    <div class="md-list-item-text">
                      <label>Average</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">{{ currentModule.marks.ONLINETEST.map(v => v.mark).reduce((a, b) => a + b, 0) / currentModule.marks.ONLINETEST.length }}</span></label>
                    </div>
                  </md-list-item>
                </md-list>
              </div>
            </md-card-content>
  
            <md-card-actions v-if="false" md-alignment="space-between">
              <md-card-expand-trigger>
                <md-button>Chat</md-button>
              </md-card-expand-trigger>
            </md-card-actions>
            <md-card-expand-content>
              <md-card-content v-if="false">
                <div class="row">
                  <div class="row col s12">
                    <div class="col s10 offset-s1 chat" :class="{'right-align':feedback.from.id == $store.state.user.id}" v-for="(feedback,i) in feedbacks" :key="i">
                      <span class="chip message" :class="{'notSent':feedback.status != 'sent','black white-text':feedback.from.type != 'STUDENT'}">
                                                           <span class="from" :class="{'white-text':feedback.from.type != 'STUDENT'}">{{ feedback.from.name }}</span> : {{ feedback.message }}
                      </span>
                      <p class="time">{{ feedback.status != 'sent' ? feedback.status : getMoment(feedback.date).fromNow() }}</p>
                    </div>
                  </div>
                  <div class="col s10 switch">
                    <label>
                                                            <input v-on:change="toggleAutoRefresh" v-model="autoRefreshChats" type="checkbox">
                                                            <span class="lever"></span>
                                                            {{ autoRefreshChats ?  'Auto refreshing every 5 seconds' : 'Auto refresh is off, Use the button on the right to get the latest messages' }} 
                                                          </label>
                  </div>
                  <div class="col s2 right-align">
                    <a v-if="!isLoading" class="btn-floating transparent waves-effect right-align" v-on:click="refreshFeedbacks"><i class="material-icons black-text">refresh</i></a>
                    <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
                  </div>
                  <form class="col s12 center-align">
                    <div class="row">
                      <div class="input-field col s10 offset-s1 m6 offset-m3">
                        <i class="material-icons prefix">chat</i>
                        <textarea v-model="txtFeedback" id="icon_prefix2" class="materialize-textarea"></textarea>
                        <label for="icon_prefix2">Comment</label>
                      </div>
                      <div class="col s8 offset-s2 center-align">
                        <a v-if="!isLoading" class="btn green waves-effect-effect">Comment</a>
                        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
                      </div>
                    </div>
                  </form>
                </div>
              </md-card-content>
            </md-card-expand-content>
          </md-card-expand>
        </md-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import swal from "sweetalert2";

const axios = require("axios");

Array.prototype.groupBy = function(prop) {
  return this.reduce(function(groups, item) {
    const val = item[prop];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
};

Array.prototype.Average = function(prop) {
  let length = this.length;
  if (length == 0) return 0;
  var total = 0;
  this.forEach(c => {
    total += c[prop];
  });
  return total / length;
};

export default {
  name: "StidentList",
  data() {
    return {
      txtSearch: "",
      txtError: "",
      module: {
        name: "",
        code: "",
        description: ""
      },
      selectedModuleIndex: null,
      modules: [],
      feedbacks: [
        {
          from: "Mr Tshepi",
          message: "You have to improve on your tests",
          date: new Date(),
          status: "sent"
        },
        {
          from: "Student",
          message: "I am trying sir, i study eco everyday",
          date: new Date(),
          fromType: "STUDENT",
          status: "sent"
        }
      ],
      selectedStudent: null,
      isLoading: false
    };
  },
  computed: {
    filteredModules() {
      return this.modules.filter(
        m =>
          this.txtSearch.length < 1 ||
          JSON.stringify(m)
            .toLowerCase()
            .indexOf(this.txtSearch.toLowerCase()) >= 0
      );
    },
    currentModule() {
      if (this.selectedModuleIndex == null) {
        return null;
      }
      return this.filteredModules[this.selectedModuleIndex];
    }
  },
  mounted() {
    this.isLoading = true;
    axios
      .get(
        this.$store.state.settings.baseLink +
          "/m/modules/all/for/" +
          this.$store.state.user.id +
          "/" +
          this.$store.state.user.type
      )
      .then(results => {
        this.isLoading = false;
        results.data.map(async _module => {
          _module.show = true;
          let marks = await axios.get(
            this.$store.state.settings.baseLink +
              "/m/marksheet/for/" +
              this.$store.state.user.id +
              "/moduleID/" +
              _module._id
          );
          if (!marks || !marks.data) {
            alert("There is no marks for " + _module.name + " " + _module.code);
          } else {
            _module.marks = marks.data.groupBy("type");
          }
          return _module;
        });
        this.modules = results.data;
      })
      .catch(err => {
        this.isLoading = false;
        if (err.response != null && err.response.status == 512) {
          swal.fire(err.response.data, "error");
        } else {
          swal.fire("Unable to load modules", "Try again later", "error");
        }
      });
  },
  methods: {
    DeepSearch() {
      alert("Deep searching for " + this.txtSearch);
    },
    goToSolution(solutionId) {
      this.$router.push({
        name: "TestMarks",
        params: {
          solutionId: solutionId
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.markValue {
  font-size: larger;
  font-weight: bold;
}

.testHeading {
  background-color: #eee;
}

.screen {
  background-image: url("/static/img/coPortalLogo.jpg");
  /* Full height */
  height: 100vh;
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: fit;
}
</style>

