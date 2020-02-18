<template>
  <div>
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
      <v-col cols="12" sm="12" md="6" lg="6" xlg="6" class="mx-auto">
        <v-card :loading="isLoading" class="pa-3">
          <v-card-header class="text-center">
            <div class="display-1 py-2">
              {{ title }}
            </div>
            <div v-if="questions.length > 0" class="title">
              {{ questions.length }} questions
            </div>
          </v-card-header>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="8"
        class="mx-auto my-auto"
        v-for="(survey, i) in questions"
        :key="i"
      >
        <v-card
          :loading="isLoading"
          class="col m8 offset-m2 row card-panel hoverable"
        >
          <v-card-title class="display-1 px-4">
            {{ survey.question }}
          </v-card-title>
          <v-card-text class="px-2">
            <v-radio-group
              v-show="survey.type === 'RADIO'"
              v-model="response.answers[i].answer"
              column
            >
              <v-radio
                v-for="(answer, j) in survey.options"
                :key="j"
                :disabled="timeUp"
                :value="answer"
                :label="answer"
              ></v-radio>
            </v-radio-group>
            <v-text-field
              :label="survey.question"
              outlined
              v-model="response.answers[i].answer"
              v-show="survey.type !== 'RADIO'"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-show="questions.length > 0">
      <v-col cols="12" sm="12" md="8" class="mx-auto my-auto">
        <v-btn
          :loading="isLoading"
          color="secondary"
          large
          block
          v-on:click="submitSurvey()"
          >Submit</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import swal from "sweetalert2";
const axios = require("axios");

export default {
  data() {
    return {
      title: "",
      questions: [],
      studentId: "",
      surveyObject: {},
      isLoading: false,
      response: {
        studentId: "",
        answers: []
      }
    };
  },
  mounted() {
    this.studentId = this.$store.state.user.id;
    this.response.studentId = this.studentId;
    this.getSurveyQuestions();
  },
  props: ["moduleId"],
  methods: {
    setChecked(index, value) {
      this.response.answers[index].answer = value;
    },
    getSurveyQuestions() {
      this.isLoading = true;
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/survey/get/latest/survey/for/" +
            this.moduleId
        )
        .then(result => {
          const days = JSON.parse(JSON.stringify(result.data));
          console.log("days", days);
          if (typeof days === "object") {
            this.surveyObject = days._id;
            this.title = days.surveyTemplateId.title;
            this.questions = days.surveyTemplateId.questions;
            this.response.answers = this.questions.map(e => {
              return { questionId: e._id, question: e.question, answer: "" };
            });
          } else {
            swal.fire("", "No Survey available for this module", "info");
          }

          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire("", err.response.data, "error");
          } else {
            swal.fire(err.message, "Try again later", "error");
          }
        });
    },
    submitSurvey() {
      this.isLoading = true;
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/survey/submit/" +
            this.surveyObject,
          this.response
        )
        .then(attend => {
          this.isLoading = false;
          swal.fire("", attend.data.toString(), "success");
          this.goToModule(this.moduleId);
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire("", err.response.data, "error");
          } else {
            swal.fire(err.message, "Try again later", "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-select-menu {
  width: 100%;
}
</style>
