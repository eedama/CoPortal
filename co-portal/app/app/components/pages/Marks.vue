<template>
  <page actionBarHidden="true">
    <ScrollView>
      <GridLayout rows="*,auto,auto" columns="*">
        <StackLayout row="1">
          <GridLayout rows="auto,auto" columns="*">
            <label row="0" verticalAlignment="center" textAlignment="center" class="mdi p-15 text-dark-black" fontSize="50%" :text="'mdi-checkbox-marked-circle-outline' | fonticon"></label>
            <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" text="Marks"></label>
          </GridLayout>
        </StackLayout>
 
        <StackLayout row="2">
                 <ActivityIndicator verticalAlignment="center" textAlignment="center" row="1" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
         
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
      marks: [],

    };
  },
  mounted() {
    this.pageLoaded();     
    this.isLoading = true;
   
  },
  methods: {
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: this.appSettings,
        doc: "admin"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
