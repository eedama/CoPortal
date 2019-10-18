<template>
  <page actionBarHidden="true">
    <GridLayout rows="*,*" columns="*">
      <ActivityIndicator
        v-show="loading"
        row="0"
        verticalAlignment="top"
        textAlignment="center"
        :busy="loading"
      ></ActivityIndicator>
      <StackLayout  class="m-t-30" rows="*,*,*,*" row="0">
       <label
            row="0"
            verticalAlignment="top"
            textAlignment="center"
            color="rgba(36,36,36,0.7)"
            v-show="!loading"
            fontSize="23%"
            :text="dateString"
          ></label>
          <GridLayout row="1" rows="*,*,*" columns="*,*">
          <label
            row="0"
            col="0"
            textAlignment="center"
            v-show="!loading"
            color="rgba(36,36,36,0.8)"
            colSpan="2"
            class="m-r-10"
            fontSize="57%"
            fontWeight="bold"
            :text="currentTime"
          ></label>
           <label
            row="0"
            col="1"
            textAlignment="center"
            color="rgba(36,36,36,0.8)"
            class="m-t-30 m-l-5"
            fontSize="25%"
            v-show="!loading"
            :text="currentNoon"
          ></label>
           <TextField row="1" verticalAlignment="top" col="0" colSpan="2" keyboardType="email" class="attend"  fontSize="20"  textAlignment="center" hint="Enter attendence code" v-model="attendCode"></TextField>
            <Button
                    row="2"
                    horizontalAlignment="center"
                    verticalAlignment="top"
                    colSpan="2"
                    text="submit"
                    :isEnabled="!loading"
                    class=" text-white submit-button bg-blue-black"
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
      loading:false,
      dateString: '',
      attendCode:'',
    };
  },
  mounted() {
    const newD = new Date();
    this.dateString = date.format(newD,"ddd, MMM DD YYYY");
  },
  computed:{
    currentTime(){
    return date.format(new Date(),"hh:mm");
    },
    currentNoon(){
    return (date.format(new Date(),"A")).split(".").join("").toUpperCase();
    }
  },
  methods: {
    submit(){
      this.loading = true;
      const currentUser = JSON.parse(
        JSON.stringify(this.$store.state.cache.cachedUser.user._id)
      );
      const attendance = {studentId:currentUser,code:this.attendCode};
      this.$api
          .addStudentToAttendance(attendance)
          .then(attend => {
            this.loading = false;
              this.$feedback.success({
              title: attend.toString()
            });
            this.attendCode = '';
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
.attend{
  border-width: 2 2 2 2;
  border-radius:10%;
  border-color:rgba(36,36,36,0.8);
  width:90%;
  height:20%;
}
.submit-button{
  width: 70%;
  border-radius: 5%;
  height:23%;

}
</style>
