<template>
  <div class="screen">
    <div class="row">
      <div class="col s8 offset-s2">
        <md-button v-on:click="$router.back()" class="right">
          <md-icon>keyboard_backspace</md-icon>
          <span>Back</span>
        </md-button>
      </div>
    </div>
    <div class="row">
      <div class="col s10 offset-s1 m8 offset-m3 l6 offset-l3">
        <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
          <input v-on:keypress.enter="DeepSearch" v-model="txtSearch" id="Password" name="Search" type="search" />
          <label class="text-center" for="Search">Search</label>
        </div>
      </div>
      <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
      </div>
    </div>
    <div class="row">
      <div class="col s12 m3 row">
        <div class="col s12 center">
          <md-subheader><label class="markValue">Modules</label></md-subheader>
        </div>
        <div class="col s6 m12 pointer center-align waves-effect" v-on:click="selectedModuleIndex = i" v-for="(module,i) in filteredModules" :key="i">
          <div class="hoverable card-panel" :class="{'black':selectedModuleIndex==i}">
            <h6 class="center-align">
              <span>{{ module.name }} 
                                <br /><label class="center-align">{{ module.code }}</label></span></h6>
          </div>
        </div>
      </div>
      <div class="col s12 m9 row card-panel" v-if="currentModule == null">
        <md-empty-state md-icon="" md-label="No module selected" md-description="Please click on a module">
        </md-empty-state>
      </div>
      <div class="col s12 m9 row center-align" v-if="currentModule != null">
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
  
          <md-card-expand v-for="(marksheet,i) in marks" :key="i">
            <md-card-content>
              <div class="row">
                <md-list class="col s12 l4 md-double-line" style="border-right:3px solid #eeeeee">
                  <md-subheader><label class="markValue">Tests and Practicals</label></md-subheader>
                  <md-list-item class="pointer  waves-effect" style="border-bottom:2px solid #eeeeee" v-for="k in 3" :key="k">
                    <div class="md-list-item-text">
                      <span>Practical test {{k}}</span>
                      <label class="md-primary"><span class="markValue">90 /</span> <span>100</span></label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"> 03/09/2018</label>
                    </div>
                  </md-list-item>
                  <md-list-item>
                    <div class="md-list-item-text">
                      <label>Average</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">70 /</span> <span>100</span></label>
                    </div>
                  </md-list-item>
                </md-list>
                <md-list class="col s12 l4 md-double-line" style="border-right:3px solid #eeeeee">
                  <md-subheader><label class="markValue">Class tests and Homeworks</label></md-subheader>
                  <md-list-item class="pointer  waves-effect" style="border-bottom:2px solid #eeeeee" v-for="k in 3" :key="k">
                    <div class="md-list-item-text">
                      <span>Class test {{ k }}</span>
                      <label class="md-primary"><span class="markValue">90 /</span> <span>100</span></label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"> 03/09/2018</label>
                    </div>
                  </md-list-item>
                  <md-list-item>
                    <div class="md-list-item-text">
                      <label>Average</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">70 /</span> <span>100</span></label>
                    </div>
                  </md-list-item>
                </md-list>
                <md-list class="col s12 l4 md-double-line">
                  <md-subheader><label class="markValue">Online tests and assignments</label></md-subheader>
                  <md-list-item class="pointer  waves-effect" style="border-bottom:2px solid #eeeeee" v-for="k in 3" :key="k">
                    <div class="md-list-item-text">
                      <span>Life test</span>
                      <label class="md-primary"><span class="markValue">90 /</span> <span>100</span></label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"> 03/09/2018</label>
                    </div>
                  </md-list-item>
                  <md-list-item>
                    <div class="md-list-item-text">
                      <label>Average</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">70 /</span> <span>100</span></label>
                    </div>
                  </md-list-item>
                </md-list>
              </div>
            </md-card-content>
  
            <md-card-actions md-alignment="space-between">
              <div>
                <md-button>Download</md-button>
                <md-button>Share</md-button>
              </div>
              <md-card-expand-trigger>
                <md-button>Comments</md-button>
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
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";

const axios = require("axios");

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
      marks: [{}],
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
      var selectedModule = this.filteredModules[this.selectedModuleIndex];
      if (
        this.marks.filter(v => v.moduleId == selectedModule._id).length == 0
      ) {
        axios
          .get(
            this.$store.state.settings.baseLink +
              "/m/marksheet/for/" +
              this.$store.state.user.id +
              "/moduleID/" +
              selectedModule._id
          )
          .then(moduleMarksheet => {
            this.marks.push(moduleMarksheet);
          })
          .catch(err => {
            swal(
              `Unable to load marks for ${selectedModule.name} (${
                selectedModule.code
              })`,
              "Try again later or check your internet connection",
              "error"
            );
            console.log("Error", err);
          });
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
        this.modules = results.data;
        this.modules.map(s => {
          s.show = true;
        });
        if (this.modules.length > 0 > 0 && this.selectedModuleIndex == null) {
          this.selectedModuleIndex = 0;
        }
      })
      .catch(err => {
        this.isLoading = false;
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

