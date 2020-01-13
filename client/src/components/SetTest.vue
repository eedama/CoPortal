<template>
  <div class="hello">
  <v-row>
      <v-col cols="10"> </v-col>
      <v-col cols="2">
        <v-btn right v-on:click="$router.back()" class="primary justify-end">
          <v-icon>mdi-keyboard-backspace</v-icon>
          <span class="px-2">Back</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row fill-height class="row my-auto">
         <v-col cols="12" sm="12" md="8" lg="6" xlg="6" class="mt-5 mx-auto">
                <v-text-field
                  label="Title"
                  outlined
                  v-model="title"
                ></v-text-field>
              </v-col>
      <v-col cols="12" v-if="currentPage == 1" class="ma-3 text-center">
        <h3 class="display-1">Memorandum creation</h3>
      </v-col>
    </v-row>
    <v-row v-if="!addingQuestion && currentPage == 0" class="row">
      <v-col cols="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" xl="6" offset-xl="3" class="mx-auto">
                       <v-card  v-for="(question,i) in questions" :key="i" class="ma-2">
                      <v-list-item>
                        <v-list-item-avatar color="grey"></v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{ question.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ question.answers.length }} answers</v-list-item-subtitle>
                        </v-list-item-content>
        <v-list-item-action>
          <v-btn v-on:click="DeleteQuestion(question)" icon>
            <v-icon class="text-peach">mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
                      </v-list-item>
                      </v-card>
      </v-col>
    </v-row>
    <v-row class="row">
      <v-col cols="12" sm="12" md="6" lg="4" xlg="4" v-if="!addingQuestion && currentPage == 0" class="mx-auto">
        <v-btn :disabled="!title" block outlined color="secondary" x-large v-on:click="AddQuestion()">Add Question</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="addingQuestion && currentPage == 0">
      <v-col  cols="12" sm="12" md="10" lg="8" xlg="8" class="mx-auto">
        <v-card class="pa-3">
          <v-btn icon class="float-right" large v-on:click="addingQuestion = false">
            <v-icon large>mdi-close</v-icon>
            </v-btn>
        <v-row class="row">
          <v-col cols="12" sm="12" md="10" lg="8" xlg="8" class="mx-auto">
            <v-text-field outlined label="Question" v-model="questionaire.title" placeholder="Type the question here..." type="text" class="validate"></v-text-field>
          </v-col>
        </v-row>
        <v-row v-for="(answer,i) in answers" :key="i">
          <v-col cols="12" sm="12" md="10" lg="8" xlg="8" class="mx-auto">
            <v-text-field outlined :label="`Option ${ i + 1}`" v-model="questionaire.answers[i]" :id="'answer-' + i" type="text" class="validate"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="6" lg="6" xlg="6" class="mx-auto">
            <v-btn outlined icon x-large color="secondary" class="btn-flat float-right" v-on:click="AddAnswer()">
              <v-icon x-large>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="6" xlg="6" class="mx-auto">
            <v-btn icon x-large color="primary" class="btn-flat" v-on:click="RemoveAnswer()">
              <v-icon x-large>mdi-minus</v-icon>
            </v-btn>
          </v-col>
          </v-row>
        <v-card-actions>
          <v-btn block color="secondary" x-large v-on:click="SaveQuestion()">Save Question</v-btn>
        </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="!addingQuestion && questions.length > 0 && currentPage == 0" class="row">
      <!--
          <div class="col s12 m8 offset-m2 card-panel row p-10">
            <div class="col s12 row">
              <div class="switch">
                <label>
                    <input v-model="hasExpiryDatetime" type="checkbox">
                    <span class="lever"></span>
                    {{ hasExpiryDatetime ?  'Has expiry date/time' : 'No expiry date/time' }} 
                  </label>
              </div>
            </div>
            <div v-show="hasExpiryDatetime" class="col s12 l6 input-field">
              <input v-model="questionaire.expiryDate" id="ExpiryDate" type="date" class="datepicker">
              <label for="ExpiryDate">Expiry date</label>
            </div>
            <div v-show="hasExpiryDatetime" class="col s12 m6 input-field">
              <input v-model="questionaire.expiryTime" id="ExpiryTime" type="time" class="validate">
              <label for="ExpiryTime">Expiry time</label>
            </div>
          </div>
          -->
             <v-col cols="12" sm="12" md="6"  class="mx-auto text-center">
                <v-switch class="text-center" v-model="hasTimeLimit" inset :label="`
                ${hasTimeLimit
                      ? 'Has time limit'
                      : 'No time limit'}`"></v-switch>
        <v-select
         v-show="hasTimeLimit"
          :items="timeLimits"
          v-model="questionaire.timeLimit"
          label="Time limit"
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="!addingQuestion && questions.length > 0 && currentPage == 0" class="row">
        <v-col cols="12" sm="12" md="6" class="mx-auto">
          <v-btn block color="secondary" x-large :loading="isLoading" v-on:click="SubmitQuestionaire()">Submit</v-btn>
        </v-col>
    </v-row>
    <div v-if="currentPage == 1 && dbQuestionaire != null">
      <TakeTest :dbQuestionaire="dbQuestionaire" :isMemo="true" />
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
import TakeTest from "./TakeTest";

const axios = require("axios");

export default {
  name: "SetTest",
  components: {
    TakeTest
  },
  data() {
    return {
      hasTimeLimit: false,
      hasExpiryDatetime: false,
      currentPage: 0,
      title: "",
      questionaire: {
        title: "",
        answers: [],
        expiryDate: null,
        expiryTime: null,
        timeLimit: null
      },
      addingQuestion: false,
      answers: [
        {
          value: "Jacob Zuma"
        }
      ],
      dbQuestionaire: null,
      questions: [],
      timeLimits: [
        "10 minutes",
        "30 minutes",
        "45 minutes",
        "1 hour",
        "1.5 hours",
        "2 hours"
      ],
      isLoading: false
    };
  },
  mounted() {
    if (this.moduleID == null) {
      this.$router.back();
    } else {
      this.Reload();
    }
  },
  props: ["moduleID"],
  methods: {
    AddQuestion() {
      this.addingQuestion = true;
    },
    AddAnswer() {
      this.answers.push({});
    },
    RemoveAnswer() {
      this.answers.pop();
    },
    DeleteQuestion(question) {
      swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this question",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          var index = this.questions.indexOf(question);
          this.questions.splice(index, 1);
          swal.fire("Question has been deleted!", {
            icon: "success"
          });
        }
      });
    },
    SaveQuestion() {
      if (this.questionaire.title.length < 2) {
        swal.fire("Incomplete question", "Please provide a valid question", "error");
        return;
      }

      if (this.questionaire.answers.length < 1) {
        swal.fire(
          "Incomplete question",
          "Please provide atleast one answer to the question",
          "error"
        );
        return;
      }

      this.questions.push({
        id:
          this.questionaire.title +
          "-" +
          Date.now() +
          "-" +
          this.questions.length,
        title: this.questionaire.title,
        answers: this.questionaire.answers,
        expiryDate: this.hasExpiryDatetime
          ? this.questionaire.expiryDate
          : null,
        expiryTime: this.hasExpiryDatetime
          ? this.questionaire.expiryTime
          : null,
        timeLimit: this.hasTimeLimit ? this.questionaire.timeLimit : null
      });

      this.questionaire.title = "";
      this.questionaire.answers = [];
      this.addingQuestion = false;
    },
    SubmitQuestionaire() {
      this.isLoading = true;
      if (this.title.length < 3) {
        swal.fire(
          "Incomplete questionaire",
          "Please provide a title for your questionaire",
          "error"
        );
        this.isLoading = false;
        return;
      }

      if (
        this.hasTimeLimit &&
        (this.questionaire.timeLimit == null ||
          this.questionaire.timeLimit.length < 2)
      ) {
        swal.fire(
          "Invalid time limit",
          "Please provide a valid time limit",
          "error"
        );
        this.isLoading = false;
        return;
      }

      axios
        .post(this.$store.state.settings.baseLink + "/l/add/questionaire", {
          title: this.title,
          lecturerId: this.$store.state.user.id,
          questions: this.questions,
          timeLimit: this.questionaire.timeLimit,
          moduleId: this.moduleID
        })
        .then(results => {
          let markSheet = {
            lecturerID: this.$store.state.user.id,
            moduleID: this.moduleID,
            title: this.title,
            total: this.questions.length,
            id: results.data._id,
            type: "ONLINETEST"
          };
          let self = this;
          axios
            .post(this.$store.state.settings.baseLink + "/l/sheet/add", {
              markSheet
            })
            .then(sheet => {
              self.isLoading = false;
              self.dbQuestionaire = results.data;
              self.currentPage = 1;
            })
            .catch(err => {
              self.isLoading = false;
              if (err.response != null && err.response.status == 512) {
                swal.fire(err.response.data, "error");
              } else {
                swal.fire("Unable to save mark sheet", err.message, "error");
              }
            });
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire("Unable to submit questionaire", err.message, "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.p-10 {
  padding: 10px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.pointer {
  cursor: pointer;
}

.selectedTag {
  background-color: #42b983 !important;
}
</style>
