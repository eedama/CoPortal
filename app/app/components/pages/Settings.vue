<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label row="0" verticalAlignment="center" textAlignment="center" class="mdi text-dark-black" fontSize="50%" :text="'mdi-settings' | fonticon"></label>
          <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" text="Settings"></label>
        </GridLayout>
      </StackLayout>
      <ActivityIndicator verticalAlignment="center" textAlignment="center" row="1" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
      <StackLayout v-if="!isLoading" row="1">
        <CardView margin="5" :elevation="selectedSetting == 1 ? '10' : '0'">
          <Ripple @tap="LoadModules()">
            <GridLayout class="m-10 p-y-5" rows="auto" columns="auto,*,auto">
              <label row="0" col="0" rowSpan="2" verticalAlignment="center" textAlignment="center" class="mdi m-5 text-dark-black" fontSize="35%" :text="'mdi-book-open-page-variant' | fonticon"></label>
              <label row="0" col="1" :textWrap="true" verticalAlignment="center" fontSize="18%" class="p-5 text-dark-black" text="Add or remove modules"></label>
              <label row="0" col="2" rowSpan="2" verticalAlignment="center" textAlignment="center" class="mdi m-5 text-dark-black" fontSize="35%" :text="`mdi-${selectedSetting == 1 ? 'chevron-up' : 'chevron-down'}` | fonticon"></label>
            </GridLayout>
          </Ripple>
        </CardView>
        <StackLayout v-if="selectedSetting == 1">
          <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoadingModules" :busy="isLoadingModules"></ActivityIndicator>
          <GridLayout v-if="!isLoadingModules" rows="auto,*,auto" columns="*">
            <label row="0" class="text-dark-black p-20" :textWrap="true" fontSize="14%" textAlignment="center">Select all the modules you are currently registered for</label>  
            <ScrollView row="1">
              <StackLayout>
                <GridLayout @tap="selectModule(_module._id)" rows="auto,auto" columns="auto,*" class="p-10" verticalAlignment="center" textAlignment="center" v-for="(_module,i) in modules" :key="i">
                  <label row="0" col="0" rowSpan="2" verticalAlignment="center" textAlignment="center" :class="{'text-dark-blue':selectedModules.some(s => s._id == _module._id)}" class="mdi m-5" fontSize="25%" :text="`mdi-${selectedModules.some(s => s._id == _module._id) ? 'checkbox-marked-circle-outline' : 'radiobox-blank'}` | fonticon"></label>
                  <label row="0" col="1" :textWrap="true" class="font-weight-bold" fontSize="16%" verticalAlignment="center" :text="_module.name"></label>
                  <label row="1" col="1" :textWrap="true" class="text-dark-black" verticalAlignment="center" fontSize="14%" :text="_module.code"></label>
                </GridLayout>
              </StackLayout>
            </ScrollView>  
            <ActivityIndicator row="2" verticalAlignment="center" textAlignment="center" v-show="isSavingChanges" :busy="isSavingChanges"></ActivityIndicator>
            <Button v-if="!isSavingChanges" row="2" text="Save changes" :isEnabled="!isSavingChanges" class="submit-button bg-dark-black text-white" @tap="SaveModules()"></Button>
          </GridLayout>
        </StackLayout>
        <CardView margin="5" :elevation="selectedSetting == 2 ? '10' : '0'">
          <Ripple @tap="selectedSetting == 2 ? selectedSetting = 0 : selectedSetting = 2">
            <GridLayout class="m-10 p-y-5" rows="auto" columns="auto,*,auto">
              <label row="0" col="0" rowSpan="2" verticalAlignment="center" textAlignment="center" class="mdi m-5 text-dark-black" fontSize="35%" :text="'mdi-lock' | fonticon"></label>
              <label row="0" col="1" :textWrap="true" verticalAlignment="center" fontSize="18%" class="p-5 text-dark-black" text="Change password"></label>
              <label row="0" col="2" rowSpan="2" verticalAlignment="center" textAlignment="center" class="mdi m-5 text-dark-black" fontSize="35%" :text="`mdi-${selectedSetting == 2 ? 'chevron-up' : 'chevron-down'}` | fonticon"></label>
            </GridLayout>
          </Ripple>
        </CardView>
        <StackLayout v-if="selectedSetting == 2">
          <GridLayout rows="auto,*,auto" columns="*">
            <label row="0" class="text-dark-black p-20" :textWrap="true" fontSize="14%" textAlignment="center">Enter your old password and your new password</label>  
            <ScrollView row="1">
              <StackLayout>
                 <GridLayout class="m-10 text-dark-black" rows="auto,auto" columns="auto,*">
                  <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-lock-outline' | fonticon"></label>
                  <label row="0" col="1" class="h3 font-weight-bold text-mute text-dark-black" text="Old Password"></label>
                  <TextField row="1" col="1" ref="password" secure="true" returnKeyType="next" v-model="oldPassword"></TextField>
                </GridLayout>
                <GridLayout class="m-10 text-dark-black" rows="auto,auto" columns="auto,*">
                  <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-lock' | fonticon"></label>
                  <label row="0" col="1" class="h3 font-weight-bold text-mute text-dark-black" text="New Password"></label>
                  <TextField row="1" col="1" ref="password" secure="true" returnKeyType="next" v-model="newPassword"></TextField>
                </GridLayout>
                <GridLayout class="m-10 text-dark-black" rows="auto,auto" columns="auto,*">
                  <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-lock' | fonticon"></label>
                  <label row="0" col="1" class="h3 font-weight-bold text-mute text-dark-black" text="Confirm Password"></label>
                  <TextField row="1" col="1" ref="password" secure="true" returnKeyType="next" v-model="confirmPassword"></TextField>
                </GridLayout>
              </StackLayout>
            </ScrollView>  
            <ActivityIndicator row="2" verticalAlignment="center" textAlignment="center" v-show="isSavingChanges" :busy="isSavingChanges"></ActivityIndicator>
            <Button v-if="!isSavingChanges" row="2" text="Save changes" :isEnabled="!isSavingChanges" class="submit-button bg-dark-black text-white" @tap="SavePassword()"></Button>
          </GridLayout>
        </StackLayout>
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
        oldPassword:'',
        newPassword:'',
        confirmPassword:'',
        selectedSetting:0,
        isLoadingModules:false,
        isSavingChanges:false,
        modules:[],
        selectedModules:[]
      };
    },
    mounted() {
      this.pageLoaded();
    },
    methods: {
      pageLoaded() {
        this.$store.commit("refreshCache", {
          db: this.$db,
          api: this.$api,
          appSettings: this.appSettings,
          doc: "admin"
        });  
        try{
         this.selectedModules = JSON.parse(JSON.stringify(this.$store.state.cache.cachedUser.user.modules));
        }catch(err){

        }
      },
      LoadModules(){
        this.selectedSetting == 1 ? this.selectedSetting = 0 : this.selectedSetting = 1;
        this.isLoadingModules = true;
        this.$api.getAllModules().then(modules =>{
          this.modules = JSON.parse(JSON.stringify(modules));
          this.isLoadingModules = false;
        }).catch(err =>{
          this.$feedback.error({
            title:err.message
          });
          this.isLoadingModules = false;
        }); 
      },
      SaveModules(){
        this.isSavingChanges = true;
        var student = JSON.parse(JSON.stringify(this.$store.state.cache.cachedUser.user));
        student.modules = this.selectedModules;
        this.$api.updateStudent(student._id,student).then(result => {
          this.$store.commit("cacheUser", {
            db: this.$db,
            api: this.$api,
            appSettings: this.appSettings,
            user: {
              user:student,
              userType:this.$store.state.cache.cachedUser.userType
            }
          });
          this.$feedback.success({
            title:"Setting successfully applied"
          });
          this.isSavingChanges = false;
          this.selectedSetting = 0;
        }).catch(err =>{
          this.$feedback.error({
            title:err.message
          });
          this.isSavingChanges = false;
        }); 
      },
      SavePassword(){
        if(this.newPassword != this.confirmPassword){
          this.$feedback.error({
            title:"Your passwords do not match"
          });
          return;
        }
        
        if(!this.newPassword || this.newPassword.length < 4){
          this.$feedback.error({
            title:"Password too short",
            message:"Atleast 4 charactors are required"
          });
          return;
        }
        
        this.isSavingChanges = true;
        this.$api.changePassword(this.$store.state.cache.cachedUser.user._id,this.appSettings.getString("userType"),this.oldPassword,this.newPassword).then(result => {
          this.$feedback.success({
            title:"Setting successfully applied"
          });
          this.isSavingChanges = false;
          this.selectedSetting = 0;
        }).catch(err =>{
          this.$feedback.error({
            title:err.message
          });
          this.isSavingChanges = false;
        }); 
      },
      selectModule(moduleId){
        if(this.selectedModules.some(s => s._id == moduleId)){
          this.selectedModules = this.selectedModules.filter(m => m._id != moduleId);
        }else{
          this.selectedModules.push({
            _id:moduleId,
            name:this.modules.find(m => m._id == moduleId).name,
            code:this.modules.find(m => m._id == moduleId).code
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .topMainText {
    color: white;
    background-color: linear-gradient( top bottom, rgba(255, 0, 0, 0.5), rgba(255, 20, 0, 0.7), rgba(255, 0, 30, 0.5), rgba(255, 20, 30, 0.7));
  }
  
  .backgroundImage {
    background: url("~/assets/images/suit77_black_white.jpeg") no-repeat center center;
    background-size: cover;
    padding-top: 3%;
    padding-bottom: 3%;
  }
  
  .backgroundImageOverlay {
    background-color: rgba(0, 0, 0, 0.3);
    z-index: -1;
  }
  
  .bg-dark-blue-overlay {
    background-color: rgba(0, 0, 0, 0.4);
  }
</style>
