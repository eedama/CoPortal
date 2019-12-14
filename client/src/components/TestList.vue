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
      <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
      </div>
    </div>
    <h4 v-if="!isLoading" class="text-xs-center">Please select a test you want to take.</h4>
    <div class="row">
      <div v-for="(test,i) in tests" :key="i" v-on:click="TakeTest(test)" class="col m4 offset-m1 s6 pointer">
        <div class="card-panel hoverable">
          <h5 class="text-xs-center">{{ test.title }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
const axios = require("axios");

export default {
  name: "Home",
  data() {
    return {
      tests: [],
      options: [
        {
          text: "Set test",
          link: "/test/set"
        },
        {
          text: "Take test",
          link: "/test/take"
        }
      ]
    };
  },
  mounted() {
    this.isLoading = true;
    axios
      .get(this.$store.state.settings.baseLink + "/l/all/questionaire")
      .then(results => {
        this.isLoading = false;
        this.tests = results.data;
      })
      .catch(err => {
        this.isLoading = false;
        swal.fire("Unable to load questionaires", err.message, "error");
      });
  },
  methods: {
    TakeTest(test) {
      if (this.$store.state.user.type == "LECTURER") {
        axios
          .get(
            this.$store.state.settings.baseLink +
              "/l/get/solution/id/for/" +
              test._id
          )
          .then(results => {
            this.$router.push({
              name: "TestMarks",
              params: { solutionId: results.data.id }
            });
          })
          .catch(err => {
            swal.fire("Unable to submit", err.message, "error");
          });
      } else {
        this.$router.push({
          name: "TakeTest",
          params: { dbQuestionaire: test }
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
