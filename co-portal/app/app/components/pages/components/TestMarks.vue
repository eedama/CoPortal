<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*,auto" columns="*">
      <StackLayout v-if="Solution" row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label row="0" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="20%" :text="Solution.isMemo ? 'Memorandum' : Solution.studentId.firstname + ' ' + Solution.studentId.lastname"></label>
          <Label row="1" verticalAlignment="center" textAlignment="center" :textWrap="true">
           <!-- // <FormattedString>
            //   <Span :text="Solution.mark" fontWeight="bold" :color="{'red':Solution.mark*2 < Solution.answers.length}" style="color: red" />
            //   <Span text="/" />
            //   <Span :text="Solution.answers.length" fontStyle="italic" />
            // </FormattedString> -->
          </Label>
        </GridLayout>
      </StackLayout>
      <StackLayout row="1">
      <Label text="Test the label"></Label>
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
    if (this.solutionId == null) {
      this.navigate("/module/view");
      return;
    }
    this.isLoading = true;
    alert('In here');
/*
    this.$api
      .getSolutions(this.solutionId)
      .then(results => {
        this.isLoading = false;
        if (results == null) {
          this.navigate("/module/view");
          return;
        }
        alert('success');
        console.log('results',results);
        this.Solution = results;
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
        alert('failure');
        console.log('err',err);
        this.isLoading = false;
        this.$feedback.error({
          title: "Unable to load your results",
          message: err.message
        });
        this.navigate("/module/view");
        return;
      });
      */
  },
  props: ["solutionId"],
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
