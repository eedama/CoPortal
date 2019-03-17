<template>
  <page actionBarHidden="true">
    <ScrollView>
      <GridLayout rows="*,auto,auto" columns="*">
        <StackLayout row="1">
          <GridLayout rows="auto,auto" columns="*">
            <label
              row="0"
              verticalAlignment="center"
              textAlignment="center"
              class="mdi p-15 text-dark-black"
              fontSize="50%"
              :text="'mdi-checkbox-marked-circle-outline' | fonticon"
            ></label>
            <label
              row="1"
              verticalAlignment="center"
              :textWrap="true"
              textAlignment="center"
              class="p-15 text-dark-black"
              fontSize="30%"
              :text="questionaire.title"
            ></label>
          </GridLayout>
        </StackLayout>

        <StackLayout row="2">
          <ActivityIndicator
            verticalAlignment="center"
            textAlignment="center"
            row="1"
            v-show="isLoading"
            :busy="isLoading"
          ></ActivityIndicator>
          <CardView v-for="(marked,i) in marks" :key="i" elevation="15" margin="5">
            <GridLayout
              verticalAlignment="center"
              class="p-10"
              rows="auto,auto,auto"
              columns="auto,auto,*"
            >
              <label
                row="0"
                rowSpan="3"
                verticalAlignment="center"
                textAlignment="center"
                class="font-weight-bold mdi p-15"
                fontSize="54"
                :text="'mdi-chart-pie' | fonticon "
              ></label>
              <label
                row="0"
                col="1"
                verticalAlignment="center"
                class="font-weight-bold"
                :textWrap="true"
                fontSize="17%"
                :text="marked.studentId.firstname +' '+marked.studentId.lastname "
              ></label>
              <label
                row="0"
                col="3"
                verticalAlignment="center"
                textAlignment="right"
                :color="colorLoaded(marked.mark)"
                rowSpan="2"
                :textWrap="true"
                fontSize="45"
                :text="marked.mark"
              ></label>
              <label
                row="2"
                col="1"
                verticalAlignment="center"
                class="font-weight-bold p-x-10 p-b-2"
                fontSize="13"
                borderRadius="50"
                color="white"
                :style="{backgroundColor:colorLoaded(marked.mark)}"
                textAlignment="center"
                :text="marked.attempts +' attempts'"
              ></label>
              <label
                row="2"
                col="2"
                verticalAlignment="center"
                textAlignment="right"
                class="h4 text-dark-black"
                :text="getMoment(marked.date).fromNow()"
              ></label>
            </GridLayout>
          </CardView>
        </StackLayout>
      </GridLayout>
    </ScrollView>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
var appSettings = require("application-settings");

import * as connectivity from "tns-core-modules/connectivity";
export default {
  data() {
    return {
      marks: []
    };
  },
  props: ["questionaire"],
  mounted() {
    this.pageLoaded();
    this.isLoading = true;
    this.$api
      .getQuizStudents(this.questionaire._id)
      .then(currentMarks => {
        this.marks = JSON.parse(JSON.stringify(currentMarks));
        this.isLoading = false;
      })
      .catch(err => {
        this.isLoading = false;
        this.$feedback.error({
          title: "Marks",
          message: err.message,
          duration: 3000
        });
      });
  },
  methods: {
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: this.appSettings,
        doc: "admin"
      });
    },
    colorLoaded(marked) {
      if (marked < 50) {
        return "darkred";
      } else if (marked >= 50 && marked <= 100) {
        return "darkgreen";
      } else if (marked > 100 && marked <= 150) {
        return "#428bca";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
