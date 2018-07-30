<template>
  <div class="hello">
    <div class="row">
      <div class="input-field center-align col s12 m8 offset-m2">
        <input v-model="title" id="title" type="text" class="validate">
        <label for="title">Title</label>
      </div>
      <div v-if="currentPage == 1" class="col s12 center-align">
        <h3>Memorandum creation</h3>
      </div>
    </div>
    <div v-if="!addingQuestion && currentPage == 0" class="row">
      <div v-for="(question,i) in questions" :key="i" class="col s12 m8 offset-m2 card-panel row valign-wrapper pointer">
        <div class="col s12 row">
          <div class="col s12 right-align">
            <button v-on:click="DeleteQuestion(question)" class="btn-flat center-align red-text"><i class="material-icons">delete</i></button>
          </div>
          <h6 class="col s12">
            {{ question.title }}
          </h6>
          <div class="col s12 right-align">
            <span class="small">{{ question.answers.length }} answers</span>
          </div>
        </div>
  
      </div>
    </div>
    <div class="row">
      <div v-if="!addingQuestion && currentPage == 0" class="col s12 center-align">
        <button class="btn green" v-on:click="AddQuestion()">Add Question</button>
      </div>
    </div>
    <div v-if="addingQuestion && currentPage == 0" class="row">
      <div class="col s12 m8 offset-m2 card-panel">
        <h4 class="right-align">
          <button class="btn-flat" v-on:click="addingQuestion = false"><i class="material-icons red-text">close</i></button>
        </h4>
        <div class="row">
          <div class="col s12 m6 offset-m3">
            <input v-model="questionaire.title" placeholder="Type the question here..." type="text" class="validate">
          </div>
        </div>
        <div class="row">
          <div v-for="(answer,i) in answers" :key="i" class="input-field center-align col s12 m10 offset-m1">
            <input v-model="questionaire.answers[i]" :id="'answer-' + i" type="text" class="validate">
            <label :for="'answer-' + i">Answer {{ i + 1}}</label>
          </div>
          <div class="col s12 center-align">
            <button class="btn-flat" v-on:click="AddAnswer()"><i class="material-icons">add</i></button>
            <button class="btn-flat" v-on:click="RemoveAnswer()"><i class="material-icons">remove</i></button>
          </div>
        </div>
        <div class="row">
          <button class="col s12 btn green" v-on:click="SaveQuestion()">Save Question</button>
        </div>
      </div>
    </div>
    <div v-if="!addingQuestion && questions.length > 0 && currentPage == 0" class="row">
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
      <div class="col s12 m8 offset-m2 card-panel row p-10">
        <div class="col s12 row">
          <div class="switch">
            <label>
                <input v-model="hasTimeLimit" type="checkbox">
                <span class="lever"></span>
                {{ hasTimeLimit ? 'Has time limit' : 'No time limit' }}
              </label>
          </div>
        </div>
        <label v-show="hasTimeLimit" class="col s12">Time limit</label>
        <div v-show="hasTimeLimit" class="col s4 m2" style="padding:5px" v-for="limit in timeLimits" :key="limit">
          <div class="chip waves pointer" v-on:click="questionaire.timeLimit = limit" :class="{'selectedTag':questionaire.timeLimit == limit}">
            {{ limit }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="!addingQuestion && questions.length > 0 && currentPage == 0" class="row">
      <div class="col s12 m8 offset-m2 right-align">
        <button class="btn green" v-on:click="SubmitQuestionaire()"><i class="material-icons">done</i></button>
      </div>
    </div>
    <div v-if="currentPage == 1 && dbQuestionaire != null">
      <TakeTest :dbQuestionaire="dbQuestionaire" :isMemo="true" />
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
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
      msg: "Welcome to Your Vue.js App"
    };
  },
  mounted() {
    var elems = document.querySelectorAll(".datepicker");
    var instances = this.$materialize.Datepicker.init(elems);
  },
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
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this question",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          var index = this.questions.indexOf(question);
          this.questions.splice(index, 1);
          swal("Question has been deleted!", {
            icon: "success"
          });
        }
      });
    },
    SaveQuestion() {
      if (this.questionaire.title.length < 2) {
        swal("Incomplete question", "Please provide a valid question", "error");
        return;
      }

      if (this.questionaire.answers.length < 1) {
        swal(
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
      if (this.title.length < 3) {
        swal(
          "Incomplete questionaire",
          "Please provide a title for your questionaire",
          "error"
        );
        return;
      }

      if (
        this.hasTimeLimit &&
        (this.questionaire.timeLimit == null ||
          this.questionaire.timeLimit.length < 2)
      ) {
        swal(
          "Invalid time limit",
          "Please provide a valid time limit",
          "error"
        );
        return;
      }

      axios
        .post(this.$store.state.settings.baseLink + "/l/add/questionaire", {
          title: this.title,
          lecturerId: this.$store.state.user.id,
          questions: this.questions,
          timeLimit: this.questionaire.timeLimit
        })
        .then(results => {
          console.log(results.data);
          this.dbQuestionaire = results.data;
          this.currentPage = 1;
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            alert(err.response.data);
          } else {
            swal("Unable to submit questionaire", err.message, "error");
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
