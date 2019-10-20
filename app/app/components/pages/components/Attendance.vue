<template>
  <page actionBarHidden="true">
    <GridLayout  rows="auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label
            row="0"
            verticalAlignment="center"
            textAlignment="center"
            class="text-dark-black mdi"
            fontSize="45%"
            :text="'mdi-calendar-check' | fonticon"
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
          <TabViewItem  title="New">
          <GridLayout rows="200,*">
          <StackLayout   class="attend" row="0" rows="*">
             <label
            row="0"
            class=" p-t-30 text-blue-black"
            textAlignment="center"
            fontWeight="bold"
            fontSize="43%"
            v-show="!loading && code"
            :text="code"
          ></label>
            <ActivityIndicator
              v-show="loading"
              row="0"
              verticalAlignment="center"
              class=" p-t-30 text-blue-black"
              textAlignment="center"
              :busy="loading"
          ></ActivityIndicator>
          </StackLayout>
           <StackLayout  verticalAlignment="top"  row="1" rows="*,*">
              <label
            row="0"
            class="p-y-20 text-blue-black"
            textAlignment="center"
            fontWeight="bold"
            verticalAlignment="top"
            fontSize="20%"
            :textWrap="true"
            v-show="!loading && time"
            :text="time"
          ></label>
              <Button
                    row="1"
                    horizontalAlignment="center"
                    verticalAlignment="top"
                    colSpan="2"
                    text="generate"
                    :isEnabled="!loading"
                    class=" text-white submit-button bg-blue-black"
                    @tap="generateAttendance()"
                  ></Button>
          </StackLayout>
          </GridLayout>
          </TabViewItem>
          <TabViewItem  title="History">
             <GridLayout rows="*">

          </GridLayout>
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
    return {
     lectureId: null,
     code:'',
     time:null,
     loading:false,
    };
  },
  mounted(){
   this.lectureId =  this.$store.state.cache.cachedUser.user._id;
   console.log('lecturer', this.lectureId);
    this.$api
        .getAttendanceHistory(this.module._id)
      .then(attend => {
        const days = JSON.parse(JSON.stringify(attend));
        console.log(days);
      })
      .catch(err => {
        this.$feedback.error({
              title: err.message
            });
      });

  },
  props: ["module"],
  methods: {
    getExpiryTime(dated){
     const time = "code expires at " + date.format(dated,"hh:mm");
     const noon = (date.format(dated,'A')).split('.').join('').toUpperCase();
    this.time = time+' '+ noon;
    },
    generateAttendance(){
        this.loading = true;
       const attendance = { duration: 3600, lecturerId: this.lectureId};
         this.$api
        .createAttendance(attendance,this.module._id)
      .then(attend => {
        const days = JSON.parse(JSON.stringify(attend));
        this.code = days.code;
        this.getExpiryTime(new Date(days.expiryDate));
        this.loading = false;
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
.submit-button{
  width: 70%;
  border-radius: 5%;
  height:23%;

}
.attend{
  border-width: 2 2 2 2;
  border-radius:10%;
  border-color:rgba(36,36,36,0.5);
  background-color: ghostwhite;
  width:90%;
  height:25%;
}
</style>
