<template>
  <div>
    <v-dialog v-model="showingSurveyStudentList">
      <v-card class="pa-3" :loading="!selectedSurveyStudentList">
        <v-card-header
          v-if="
            selectedSurveyStudentList &&
              selectedSurveyStudentList.surveyTemplateId
          "
        >
          <v-card-title class="display-1">{{
            selectedSurveyStudentList.surveyTemplateId.title
          }}</v-card-title>
        </v-card-header>

        <v-card-content v-if="selectedSurveyStudentList">
          <v-row>
            <v-col
              cols="12"
              sm="12"
              md="10"
              class="mx-auto"
              v-for="(student, i) in selectedSurveyStudentList.students.filter(
                v => v && v.studentId
              )"
              :key="i"
            >
              <v-card class="pa-4">
                <v-card-header class="col s12 m-10 p-x-10 p-t-10">
                  <span class="title"
                    ><strong
                      >{{ student.studentId.lastname }}
                      {{ student.studentId.firstname }}</strong
                    ></span
                  >
                </v-card-header>
                <v-card-content class="col s12">
                  <v-list>
                    <v-list-item
                      v-for="(studentAnswer, k) in student.answers"
                      :key="k"
                    >
                      <v-list-item-avatar>
                        <v-icon>mdi-forum</v-icon>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title>{{
                          studentAnswer.question
                        }}</v-list-item-title>
                        <v-list-item-subtitle class="secondary--text">{{
                          studentAnswer.answer
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-content>
              </v-card>
            </v-col>
          </v-row>
        </v-card-content>
        <v-btn class="primary" @click="showingSurveyStudentList = false"
          >Close</v-btn
        >
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="10"></v-col>
      <v-col cols="2">
        <v-btn right v-on:click="$router.back()" class="primary justify-end">
          <v-icon>mdi-keyboard-backspace</v-icon>
          <span class="px-2">Back</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="4" md-offset="4" class="mx-auto">
        <h2 class="text-center display-1">Surveys</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row class="row">
          <v-col
            cols="12"
            sm="12"
            md="6"
            xl="4"
            v-for="(_module, i) in modules"
            :key="i"
          >
            <v-card class="pa-4" :loading="!_module.loaded">
              <v-card-header>
                <v-row class="px-5">
                  <h4 class="title">{{ _module.name }} {{ _module.code }}</h4>
                  <v-spacer></v-spacer>
                  <v-menu
                    v-if="
                      _module.surveyTemplates &&
                        _module.surveyTemplates.length > 0
                    "
                    open-on-hover
                    top
                    offset-y
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" large icon>
                        <v-icon color="secondary">mdi-plus</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item
                        v-for="(item, index) in _module.surveyTemplates"
                        :key="index"
                        @click="createSurvey(_module, item._id)"
                      >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-row>
              </v-card-header>
              <v-card-content>
                <v-list
                  v-if="_module.loaded && _module.moduleSurveys"
                  class="v-double-line"
                >
                  <v-list-item
                    v-for="(moduleSurvey, k) in _module.moduleSurveys"
                    :key="k"
                    @click="selectModuleSurvey(_module._id, moduleSurvey)"
                  >
                    <v-list-item-avatar>
                      <v-icon>mdi-forum</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{
                        moduleSurvey.surveyTemplateId.title
                      }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        getMoment(moduleSurvey.date).format("Do MMMM YYYY")
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-content>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import swal from "sweetalert2";

const axios = require("axios");

export default {
  name: "SurveyList",
  data() {
    return {
      modules: [],
      showingSurveyStudentList: false,
      selectedSurveyStudentList: null,
      isLoading: false
    };
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
        this.modules.forEach(m => {
          m.moduleSurveys = null;
          m.surveyTemplates = null;
          axios
            .get(
              this.$store.state.settings.baseLink +
                "/survey/get/templates/for/" +
                m._id
            )
            .then(surveyTemplates => {
              m.surveyTemplates = surveyTemplates.data;
              console.log("survey templates", m.surveyTemplates);
            })
            .catch(err => {});
          axios
            .get(
              this.$store.state.settings.baseLink +
                "/survey/get/surveys/for/" +
                m._id
            )
            .then(moduleSurveys => {
              m.loaded = true;
              m.moduleSurveys = moduleSurveys.data;
              this.$forceUpdate();
            })
            .catch(err => {
              m.loaded = true;
              m.moduleSurveys = [];
              this.$forceUpdate();
              console.log("error", err.message);
            });
        });
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
    createSurvey(_module, surveyTemplateId) {
      _module.loaded = false;
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/survey/activate/survey/for/" +
            surveyTemplateId
        )
        .then(results => {
          _module.loaded = true;

          swal.fire(
            "Successfully created the survey",
            `Students taking ${_module.name} ${_module.code} will be able to take the survey.`,
            "error"
          );
        })
        .catch(err => {
          _module.loaded = true;
          if (err.response != null && err.response.status == 512) {
            swal.fire("", err.response.data, "error");
          } else {
            swal.fire(err.message, "Try again later", "error");
          }
        });
    },
    selectModuleSurvey(moduleId, moduleSurvey) {
      switch (this.$store.state.user.type) {
        case "STUDENT":
          this.$router.push(`/module/survey/take/for/${moduleId}`);
          break;
        case "LECTURER":
        case "ADMIN":
          this.showingSurveyStudentList = true;
          this.selectedSurveyStudentList = null;
          axios
            .get(
              this.$store.state.settings.baseLink +
                "/survey/get/survey/questions/for/" +
                moduleSurvey._id
            )
            .then(results => {
              this.isLoading = false;
              this.selectedSurveyStudentList = results.data;
              console.log(this.selectedSurveyStudentList);
            })
            .catch(err => {
              this.isLoading = false;
              console.log(err);
              this.selectedSurveyStudentList = [];
              if (err.response != null && err.response.status == 512) {
                swal.fire(err.response.data, "error");
              } else {
                swal.fire(err.message, "Try again later", "error");
              }
            });
          break;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>