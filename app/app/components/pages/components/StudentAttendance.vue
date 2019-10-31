<template>
  <page actionBarHidden="true">
    <GridLayout rows="*" columns="*">
      <ActivityIndicator
        v-show="loading"
        row="0"
        verticalAlignment="top"
        textAlignment="center"
        :busy="loading"
      ></ActivityIndicator>
      <StackLayout class="m-t-30" row="0">
        <GridLayout row="1" rows="auto,auto,auto,auto,auto" columns="*,*">
          <label
            row="0"
            colSpan="2"
            verticalAlignment="top"
            textAlignment="center"
            v-show="!loading"
            fontSize="23%"
            :text="dateString"
            class="text-peach"
          ></label>
          <label
            row="1"
            col="0"
            textAlignment="center"
            v-show="!loading"
            color="rgba(36,36,36,0.8)"
            colSpan="2"
            class="m-r-10 text-blue"
            fontSize="57%"
            fontWeight="bold"
            :text="getMoment().format('hh:mm')"
          ></label>
          <label
            row="1"
            col="1"
            textAlignment="center"
            class="m-t-30 m-l-5 text-peach"
            fontSize="25%"
            v-show="!loading"
            :text="getMoment().format('A')"
          ></label>
          <Image
            row="2"
            colSpan="2"
            src="~/assets/images/backgrounds/family_2x.png"
            stretch="aspectFit"
          />
          <TextField
            row="3"
            verticalAlignment="center"
            col="0"
            colSpan="2"
            keyboardType="email"
            class="attend m-y-10"
            fontSize="20"
            textAlignment="center"
            hint="Enter attendence code"
            v-model="attendCode"
          ></TextField>
          <Button
            row="4"
            horizontalAlignment="center"
            verticalAlignment="center"
            colSpan="2"
            text="submit"
            :isEnabled="!loading"
            class="text-white bg-peach submit-button m-y-10 bg-blue-black"
            @tap="submit()"
          ></Button>
        </GridLayout>
      </StackLayout>
    </GridLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");

import * as connectivity from "tns-core-modules/connectivity";
import date from "date-and-time";
export default {
  data() {
    return {
      loading: false,
      dateString: "",
      attendCode: ""
    };
  },
  mounted() {
    const newD = new Date();
    this.dateString = date.format(newD, "ddd, MMM DD YYYY");
  },
  computed: {
    currentTime() {
      return date.format(new Date());
    },
    currentNoon() {
      return date
        .format(new Date(), "A")
        .split(".")
        .join("")
        .toUpperCase();
    }
  },
  methods: {
    submit() {
      this.loading = true;
      const currentUser = JSON.parse(
        JSON.stringify(this.$store.state.cache.cachedUser.user._id)
      );
      const attendance = { studentId: currentUser, code: this.attendCode };
      this.$api
        .addStudentToAttendance(attendance)
        .then(attend => {
          this.loading = false;
          this.$feedback.success({
            title: attend.toString()
          });
          this.attendCode = "";
        })
        .catch(err => {
          this.loading = false;
          this.$feedback.error({
            title: err.message
          });
        });
    }
  }
};
</script>

<style  scoped>
.attend {
  border-width: 2 2 2 2;
  border-radius: 10%;
  border-color: rgba(36, 36, 36, 0.8);
  width: 90%;
  height: 10%;
}
.submit-button {
  width: 70%;
  border-radius: 5%;
  height: 10%;
}
</style>
