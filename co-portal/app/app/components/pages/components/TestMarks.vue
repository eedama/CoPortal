<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*,auto" columns="*">
      <StackLayout v-if="Solution" row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label
            row="0"
            verticalAlignment="center"
            textAlignment="center"
            class="p-15 text-dark-black"
            fontSize="20%"
            text="Davis Mudau"
          ></label>
        </GridLayout>
      </StackLayout>
      <StackLayout row="1">
        <Label text="Davis Mulaudzi"></Label>
      </StackLayout>
    </GridLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
var appSettings = require("application-settings");

import * as connectivity from "tns-core-modules/connectivity";
export default {
  data() {
    return {
      txtFeedback: "",
      currentPage: 0,
      Solution: null,
      feedbacks: [],
      addingFeedBack: false,
      autoRefreshChats: false,
      refreshTimer: "",
      isLoading: false
    };
  },
  mounted() {
    this.isLoading = true;


    this.$api
      .getSolutions(this.solutionId)
      .then(results => {
        this.isLoading = false;
        if (results == null) {
          return;
        }
        this.Solution = JSON.parse(JSON.stringify(results));
        alert(JSON.stringify(results));
        if (
          this.Solution == null ||
          this.Solution.answers == null ||
          this.Solution.answers.length < 1
        ) {
          throw new Error("Unable to retreive the solution , try again later");
        }
      })
      .catch(err => {
         this.isLoading = false;
        this.$feedback.error({
          title: "Unable to load your results",
          message: err.message
        });
        return;
      });
  },
  props: ["solutionId"],
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
