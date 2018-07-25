<template>
  <div class="row">
    <div class="col s12 center-align card-panel row">
      <div class="col s12 m8 offset-m2">
        <h5>Your score is <a :class="{'red-text':(Solution.mark*2 < Solution.answers.length)}">{{ Solution.mark }}/{{ Solution.answers.length }}</a></h5>
      </div>
      <div class="col s12 right-align">
        <a class="btn-floating black waves-effect" title="Download" v-on:click="DownloadMarks"><i class="material-icons">save</i></a>
        <a class="btn-floating black waves-effect" title="Memorandum" v-on:click="ViewMemorandum"><i class="material-icons">description</i></a>
        <a class="btn-floating black waves-effect" :class="{'transparent':addingFeedBack}" v-on:click="addingFeedBack = !addingFeedBack" title="Feed back"><i :class="{'black-text':addingFeedBack}" class="material-icons">chat</i></a>
      </div>
      <div class="col s12 m8 offset-m2">
        <span class="blue-text">Scroll down to see {{ addingFeedBack ?'add your feedback' : 'view your test'}}.</span>
      </div>
    </div>
    <div v-show="addingFeedBack" class="col s12 row card-panel">
      <div class="col s12 right-align">
        <a class="btn-floating transparent waves-effect right-align" v-on:click="addingFeedBack = !addingFeedBack"><i class="material-icons red-text">close</i></a>
      </div>
      <div class="row">
        <div class="col s10 offset-s1 chat" :class="{'right-align':feedback.from == 'Joe'}" v-for="(feedback,i) in feedbacks" :key="i">
          <span class="chip message" :class="{'notSent':feedback.status != 'sent'}">
             <span class="from">{{ feedback.from }}</span> : {{ feedback.message }}
          </span>
          <p class="time">{{ feedback.status != 'sent' ? feedback.status : getMoment(feedback.date).fromNow() }}</p>
        </div>
      </div>
      <form class="col s12 center-align">
        <div class="row">
          <div class="input-field col s10 offset-s1 m6 offset-m3">
            <i class="material-icons prefix">chat</i>
            <textarea v-model="txtFeedback" id="icon_prefix2" class="materialize-textarea"></textarea>
            <label for="icon_prefix2">Comment</label>
          </div>
          <div class="col s8 offset-s2 center-align">
            <a v-on:click="SubmitFeedback" class="btn green waves-effect-effect">Comment</a>
          </div>
        </div>
      </form>
    </div>
    <div v-show="!addingFeedBack" class="col s10 offset-s1">
      <div v-for="(solution,i) in Solution.answers" :key="i" class="row">
        <div class="col m8 offset-m2 row card-panel hoverable">
          <div class="col s12">
            <h5 class="center-align">{{ solution.question.title }}</h5>
          </div>
          <div class="col m8 offset-m2 s12">
            <form>
              <h6 class="pointer" v-for="(answer,j) in solution.question.answers" :key="j">
                <label>
                      <input :disabled="solution.answer != answer" :checked="solution.answer == answer" :id="answer + '-' + j" class="with-gap" :name="solution._id" type="radio"/>
                      <span :for="answer + '-' + j">{{ answer }}</span>
                    </label>
              </h6>
            </form>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s8 offset-s2 center-align">
          <button class="btn red">Go to my profile</button>
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
  name: "TestMarks",
  data() {
    return {
      txtFeedback: "",
      currentPage: 0,
      Solution: [],
      feedbacks: [
        {
          from: "Joe",
          message: "This app does not work.",
          date: Date.now(),
          status: "sent"
        },
        {
          from: "Mpho",
          message:
            "It does chdbvbjdjbhsdj hdbs jhdbhj bdshjsd bbhj bfusdbfuywe fyue fyekwubyewhkfsdb kfyubewk ufybehb",
          date: Date.now(),
          status: "sent"
        },
        {
          from: "Joe",
          message: "Why do you say so?",
          date: Date.now(),
          status: "sent"
        }
      ],
      addingFeedBack: false
    };
  },
  mounted() {
    if (this.solutionId == null) {
      this.$router.push("/");
      return;
    }
    alert(this.getMoment().format("dd"));
    axios
      .get(
        this.$store.state.settings.baseLink +
          "/l/get/solutions/" +
          this.solutionId
      )
      .then(results => {
        if (results == null) {
          this.$router.push("/");
          return;
        }
        this.Solution = results.data;
        if (
          this.Solution == null ||
          this.Solution.answers == null ||
          this.Solution.answers.length < 1
        )
          throw new Error("Unable to retreive the solution , try again later");
        console.log(this.Solution);
      })
      .catch(err => {
        swal("Unable to load your results", err.message, "error");
        this.$router.push("/");
        return;
      });
  },
  props: ["solutionId"],
  methods: {
    getMoment(value) {
      return moment(value);
    },
    getMoment() {
      return moment();
    },
    DownloadMarks() {
      window.print();
    },
    ViewMemorandum() {
      swal(
        "Memorandum not yet avaliable",
        "Not all students have wrote the test",
        "error"
      );
    },
    SubmitFeedback() {
      if (this.txtFeedback.length < 1) {
        return;
      }
      var feedback = {
        from: "Joe",
        message: this.txtFeedback,
        date: Date.now(),
        status: "sending...."
      };

      this.feedbacks.push(feedback);
      this.txtFeedback = "";

      axios
        .post(
          this.$store.state.settings.baseLink +
            "/l/feedback/submit/" +
            this.Solution.questionaireId,
          {
            from: feedback.from,
            message: feedback.message,
            date: feedback.date,
            existingId: this.feedbacks.map(m => m._id)
          }
        )
        .then(results => {
          results.data.forEach(element => {
            this.feedbacks.push(element);
          });
        })
        .catch(err => {
          this.feedbacks.map(o => {
            if (o.status != "sent") {
              o.status = "not sent";
            }
          });
          swal("Unable to submit questionaire", err.message, "error");
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chip {
  height: inherit;
}

.chat {
  padding-top: 10px;
}

.chat .from {
  cursor: pointer;
  color: grey;
  margin-bottom: 0%;
  font-size: smaller;
}

.chat .time {
  margin-top: 0%;
  font-size: smaller;
}

.chat .notSent {
  border: 1px solid red;
}
</style>
