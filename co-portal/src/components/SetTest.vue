<template>
  <div class="hello">
    <div class="row">
      <div class="input-field center-align col s12 m8 offset-m2">
        <input v-model="title" id="title" type="text" class="validate">
        <label for="title">Title</label>
      </div>
      <div v-if="!addingQuestion && currentPage == 0" class="col s12 center-align">
        <button class="btn green" v-on:click="AddQuestion()">Add Question</button>
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
      <div class="col s12 m8 offset-m2 right-align">
        <button class="btn green" v-on:click="SubmitQuestionaire()"><i class="material-icons">done</i></button>
      </div>
    </div>
    <div v-if="currentPage == 1">
      <TakeTest :questions="questions"/>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
import TakeTest from "./TakeTest";

export default {
  name: "SetTest",
  components: { TakeTest },
  data() {
    return {
      currentPage: 0,
      title: "",
      questionaire: {
        title: "",
        answers: []
      },
      addingQuestion: false,
      answers: [
        {
          value: "Jacob Zuma"
        }
      ],
      questions: [],
      msg: "Welcome to Your Vue.js App"
    };
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
          (Math.random() + 100) +
          "-" +
          this.questions.length,
        title: this.questionaire.title,
        answers: this.questionaire.answers
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
      this.currentPage = 1;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
