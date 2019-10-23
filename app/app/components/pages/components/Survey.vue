<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label
            row="0"
            verticalAlignment="center"
            textAlignment="center"
            class="text-dark-black mdi"
            fontSize="45%"
            :text="'mdi-comment-question-outline' | fonticon"
          ></label>
          <label
            row="1"
            verticalAlignment="center"
            textAlignment="center"
            class="p-15 text-dark-black"
            fontSize="30%"
            :text="module.code"
          ></label>
        </GridLayout>
      </StackLayout>
      <StackLayout row="1">
        <TabView
          tabBackgroundColor="white"
          selectedTabTextColor="black"
          androidSelectedTabHighlightColor="black"
        >
          <TabViewItem title="New">
            <ScrollView height="300"> </ScrollView>
          </TabViewItem>
          <TabViewItem title="History">
            <ScrollView height="300"> </ScrollView>
          </TabViewItem>
        </TabView>
      </StackLayout>
    </GridLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
var appSettings = require("application-settings");
import * as connectivity from "tns-core-modules/connectivity";
import date from "date-and-time";
export default {
  data() {
    return {};
  },
  mounted() {
    this.lectureId = this.$store.state.cache.cachedUser.user._id;
  },
  props: ["module"],
  methods: {
    getHistory() {
      this.$api
        .getAttendanceHistory(this.module._id)
        .then(attend => {
          const days = JSON.parse(JSON.stringify(attend));
          this.history = days.map(i => {
            return {
              name: date.format(new Date(i.date), "DD MMMM YYYY"),
              _id: i._id,
              date: i.date
            };
          });
        })
        .catch(err => {
          this.$feedback.error({
            title: err.message
          });
        });
    }
  }
};
</script>

<style  scoped>
.submit-button {
  width: 70%;
  border-radius: 5%;
  height: 23%;
}
.item {
  background-color: ghostwhite;
  border-radius: 2%;
}
.attend {
  border-width: 2 2 2 2;
  border-radius: 10%;
  border-color: rgba(36, 36, 36, 0.5);
  background-color: ghostwhite;
  width: 90%;
  height: 25%;
}
.check {
  font-size: 25px;
  color: #006064;
  border-color: #006064;
}
</style>
