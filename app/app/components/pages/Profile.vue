<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,auto,*" columns="*,auto">
      <StackLayout verticalAlignment="center" row="0" colSpan="2" class="m-y-10">
        <Image
          horizontalAlignment="center"
          stretch="aspectFill"
          width="150"
          height="150"
          borderRadius="100%"
          :src="currentUser.profilePic ? currentUser.profilePic : $store.state.settings.defaultProfilePic"></Image>
        <label row="0" class="labelTitle m-t-5" textAlignment="center">{{currentUser.fullname}}</label>
        <label row="0" class="labelname" textAlignment="center">{{currentUser.username}}</label>
      </StackLayout>
      <CardView v-if="$store.state.cache.cachedUser.userType.toLowerCase() == 'student'" row="1" col="1" verticalAlignment="bottom" textAlignment="right" elevation="15" radius="50" margin="10">
        <Ripple @tap="isEditting = !isEditting">
          <label class="mdi p-15 black-text" verticalAlignment="center" textAlignment="left" fontSize="25" :text="(isEditting == 1 ? 'mdi-close' : 'mdi-pencil') | fonticon"></label>
        </Ripple>
      </CardView>
      <StackLayout v-if="!isEditting" row="2" colSpan="2">
        <CardView textAlignment="center" margin="10">
          <ScrollView width="100%">
            <StackLayout width="100%">
              <GridLayout
                class="text-dark-black p-x-20 p-y-15"
                rows="auto,auto"
                columns="auto,*"
                v-for="(user,index) in users"
                :key="index"
              >
                <label
                  row="0"
                  col="0"
                  class="mdi text-dark-black m-r-20"
                  rowSpan="2"
                  verticalAlignment="center"
                  textAlignment="left"
                  fontSize="35"
                  :text="user.icon | fonticon"
                ></label>
                <label
                  row="0"
                  col="1"
                  class="font-weight-bold"
                  fontSize="15"
                  verticalAlignment="center"
                  textAlignment="left"
                  :text="user.title"
                ></label>
                <label row="1" col="1" fontSize="15" :textWrap="true" textAlignment="left" :text="user.body"></label>
              </GridLayout>
              <label
                class="text-dark-black p-l-20 p-t-20 p-b-10"
                verticalAlignment="center"
                fontSize="20"
                style="opacity:0.6"
                text="Next of kin"
              ></label>
              <GridLayout
                class="text-dark-black p-x-20 p-y-15"
                rows="auto,auto"
                columns="auto,*,auto"
                v-for="(user,index) in Parents"
                :key="index"
              >
                <label
                  row="0"
                  col="0"
                  class="mdi text-dark-black m-r-20"
                  rowSpan="2"
                  verticalAlignment="center"
                  textAlignment="left"
                  fontSize="35"
                  :text="user.icon | fonticon"
                ></label>
                <label
                  row="0"
                  col="1"
                  class="font-weight-bold"
                  fontSize="15"
                  textAlignment="left"
                  :text="user.title"
                ></label>
                <label
                  row="0"
                  col="2"
                  class="font-weight-bold p-x-10 p-b-2"
                  fontSize="15"
                  rowSpan="2"
                  borderRadius="50"
                  style="color:White;background-color:black;"
                  verticalAlignment="center"
                  textAlignment="center"
                  :text="user.badge"
                ></label>
                <label row="1" col="1" fontSize="15" textAlignment="left" :text="user.body"></label>
              </GridLayout>
            </StackLayout>
          </ScrollView>
        </CardView>
      </StackLayout>
      <StackLayout v-if="isEditting" row="2" colSpan="2">
         <CardView textAlignment="center" margin="10">
          <GridLayout rows="*,auto">
            <ScrollView width="100%">
              <StackLayout width="100%">
                <GridLayout class="text-dark-black p-x-20 p-y-15" rows="auto,auto" columns="auto,*">
                  <label row="0" col="0" class="mdi text-dark-black m-r-20" rowSpan="2" verticalAlignment="center" textAlignment="left" fontSize="35" :text="'mdi-account' | fonticon"></label>
                  <label row="0" col="1" class="font-weight-bold" fontSize="15" verticalAlignment="center" textAlignment="left" text="Last name"></label>
                  <TextView row="1" col="1" fontSize="15" :textWrap="true" textAlignment="left" v-model="currentStudent.lastname"></TextView>
                </GridLayout> 
                <GridLayout class="text-dark-black p-x-20 p-y-15" rows="auto,auto" columns="auto,*">
                  <label row="0" col="0" class="mdi text-dark-black m-r-20" rowSpan="2" verticalAlignment="center" textAlignment="left" fontSize="35" :text="'mdi-account' | fonticon"></label>
                  <label row="0" col="1" class="font-weight-bold" fontSize="15" verticalAlignment="center" textAlignment="left" text="First name"></label>
                  <TextView row="1" col="1" fontSize="15" :textWrap="true" textAlignment="left" v-model="currentStudent.firstname"></TextView>
                </GridLayout> 
                <GridLayout class="text-dark-black p-x-20 p-y-15" rows="auto,auto" columns="auto,*">
                  <label row="0" col="0" class="mdi text-dark-black m-r-20" rowSpan="2" verticalAlignment="center" textAlignment="left" fontSize="35" :text="'mdi-account-outline' | fonticon"></label>
                  <label row="0" col="1" class="font-weight-bold" fontSize="15" verticalAlignment="center" textAlignment="left" text="ID Number"></label>
                  <TextView row="1" col="1" fontSize="15" :textWrap="true" textAlignment="left" v-model="currentStudent.idNumber"></TextView>
                </GridLayout>  
                <GridLayout class="text-dark-black p-x-20 p-y-15" rows="auto,auto" columns="auto,*">
                  <label row="0" col="0" class="mdi text-dark-black m-r-20" rowSpan="2" verticalAlignment="center" textAlignment="left" fontSize="35" :text="'mdi-account-outline' | fonticon"></label>
                  <label row="0" col="1" class="font-weight-bold" fontSize="15" verticalAlignment="center" textAlignment="left" text="Username"></label>
                  <TextView row="1" col="1" fontSize="15" :textWrap="true" textAlignment="left" v-model="currentStudent.username"></TextView>
                </GridLayout>  
                <GridLayout class="text-dark-black p-x-20 p-y-15" rows="auto,auto" columns="auto,*">
                  <label row="0" col="0" class="mdi text-dark-black m-r-20" rowSpan="2" verticalAlignment="center" textAlignment="left" fontSize="35" :text="'mdi-phone' | fonticon"></label>
                  <label row="0" col="1" class="font-weight-bold" fontSize="15" verticalAlignment="center" textAlignment="left" text="Contact numbers"></label>
                  <TextView row="1" col="1" fontSize="15" :textWrap="true" keyboardType="number" textAlignment="left" v-model="currentStudent.contactNumbers"></TextView>
                </GridLayout>  
                <GridLayout class="text-dark-black p-x-20 p-y-15" rows="auto,auto" columns="auto,*">
                  <label row="0" col="0" class="mdi text-dark-black m-r-20" rowSpan="2" verticalAlignment="center" textAlignment="left" fontSize="35" :text="'mdi-email' | fonticon"></label>
                  <label row="0" col="1" class="font-weight-bold" fontSize="15" verticalAlignment="center" textAlignment="left" text="Email"></label>
                  <TextView row="1" col="1" fontSize="15" :textWrap="true" keyboardType="email" textAlignment="left" v-model="currentStudent.email"></TextView>
                </GridLayout>  
              </StackLayout>
            </ScrollView>
            <StackLayout row="1">
              <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isSavingChanges" :busy="isSavingChanges"></ActivityIndicator>
              <Button v-if="!isSavingChanges"  text="Save changes" :isEnabled="!isSavingChanges" class="submit-button bg-dark-black text-white" @tap="SaveChanges()"></Button>
            </StackLayout>
          </GridLayout>
        </CardView>
     </StackLayout>
    </GridLayout>
  </page>
</template>

<script>
import * as connectivity from "tns-core-modules/connectivity";
export default {
  data() {
    return {
      isSavingChanges:false,
      isEditting:false,
      currentUser:{
        fullname: "",
        username: "",
      },
      currentStudent:{},
      users: [
        {
          title: "ID Number",
          body: "",
          icon: "mdi-account"
        },
        {
          title: "Gender",
          body: "",
          icon: "mdi-human"
        },
        {
          title: "Modules",
          body: "",
          icon: "mdi-library"
        }
      ],
      Parents: []
    };
  },
  mounted() {
    this.pageLoaded();
  },
  props: ["moduleId"],
  methods: {
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: this.appSettings,
        doc: "admin"
      });
      if (!this.$store.state.cache.cachedUser) {
        this.navigate("/login", null, {
          clearHistory: true
        });
      }

      this.currentUser = JSON.parse(
        JSON.stringify(this.$store.state.cache.cachedUser.user)
      );

      this.currentUser.fullname = this.currentUser.firstname + " " + this.currentUser.lastname;
      this.currentUser.username = this.currentUser.username;
      this.users[0].body = this.currentUser.idNumber;
      this.users[1].body = this.currentUser.gender;

      this.currentStudent = this.currentUser;
      /* { 
          lastname: this.currentUser.lastname,
          firstname: this.currentUser.firstname,
          username: this.currentUser.username,
          gender: this.currentUser.gender,
          dob: this.currentUser.dob,
          idNumber: this.currentUser.idNumber,
          isSouthAfrican: this.currentUser.isSouthAfrican,
          contactNumbers: this.currentUser.contactNumbers,
          email: this.currentUser.email,
      }
      */
      if(this.$store.state.cache.cachedUser && this.$store.state.cache.cachedUser.userType =='PARENT'){
        this.$store.state.cache.cachedUser.students.forEach(parent => {
          this.Parents.push({
            title: parent.firstname + " " + parent.lastname,
            body: parent.username,
            badge: "Student",
            icon: "mdi-account-circle"
          });
        });
      }else{
        this.currentUser.parents.forEach(parent => {
          this.Parents.push({
            title: parent.name + " " + parent.surname,
            body: parent.email,
            badge: parent.relationship.toLowerCase(),
            icon: "mdi-account-circle"
          });
        });
      }
      var Module = "";
      this.currentUser.modules.forEach(element => {
        Module += element.name + ",";
      });
      Module = Module.slice(0, -1);
      this.users[2].body = Module;
    },
    SaveChanges(){
      this.isSavingChanges = true;
      this.$api.updateStudent(this.currentStudent._id,this.currentStudent).then(result => {
        this.$feedback.success({
          title:'Changes successfully applied'
        });
        this.$store.commit("cacheUser", {
          db: this.$db,
          api: this.$api,
          appSettings: this.appSettings,
          user: {
            user:this.currentStudent,
            userType:this.$store.state.cache.cachedUser.userType
          }
        });
        this.pageLoaded();
        this.isSavingChanges = false;
      }).catch(err =>{
        this.$feedback.error({
          title:'Failed to apply changes',
          message:err.message
        });
        this.isSavingChanges = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.labelTitle {
  color: black;
  font-size: 29px;
  font-weight: bold;
}
.labelname {
  color: black;
  opacity: 0.4;
  font-size: 15px;
}
.text-left-margin {
  margin-top: -40px;
}

.icon-stager {
  margin-top: 20px;
  opacity: 0.8;
  margin-right: 20px;
}
.email-grid {
  margin-left: 25px;
}
</style>
