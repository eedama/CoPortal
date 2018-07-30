<template>
  <div>
    <h4 class="text-xs-center">Please select a test you want to take.</h4>
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
import swal from "sweetalert";
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
    axios
      .get(this.$store.state.settings.baseLink + "/l/all/questionaire")
      .then(results => {
        this.tests = results.data;
      })
      .catch(err => {
        swal("Unable to load questionaires", err.message, "error");
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
            swal("Unable to submit", err.message, "error");
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
.home {
  text-align: center;
}

.right {
  float: initial !important;
}

.left {
  float: initial !important;
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
</style>
