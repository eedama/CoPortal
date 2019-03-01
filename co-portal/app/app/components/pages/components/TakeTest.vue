<template>
    <page actionBarHidden="true">
        <GridLayout rows="auto,*,auto" columns="*">
            <StackLayout row="0">
                <GridLayout rows="auto,auto" columns="*">
                    <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="20%" text="Question 4 of 10"></label>
                </GridLayout>
                <Progress class="text-dark-black" :value="50"></Progress>
            </StackLayout>
            <StackLayout verticalAlignment="center" row="1">
                <CardView elevation="5" margin="10">
                    <GridLayout class="p-5" rows="auto,auto" columns="*">
                        <label row="0" class="text-dark-black m-10 font-weight-bold" :textWrap="true" fontSize="17%" colSpan="2" text="Who is it any way?"></label>
                        <ScrollView class="p-x-15 m-l-25" row="1">
                            <StackLayout :textWrap="true">
                                <CheckBox fillColor="black" class="p-15 text-dark-black" name="circleToggle" boxType="circle" text="Yes" v-for="a in 4" :key="a" :checked="a == 3"></CheckBox>
                            </StackLayout>
                        </ScrollView>
                    </GridLayout>
                </CardView>
            </StackLayout>
            <StackLayout row="2">
                <GridLayout class="p-5" rows="auto" columns="auto,*,auto">
                    <Ripple class="m-15" col="0" verticalAlignment="bottom" textAlignment="left">
                        <label class="font-weight-bold mdi p-5" textAlignment="left" fontSize="50%" :text="'mdi-chevron-left' | fonticon "></label>
                    </Ripple>
                    <Ripple class="m-15" col="2" verticalAlignment="bottom" textAlignment="right">
                        <label class="font-weight-bold mdi p-5" textAlignment="right" fontSize="50%" :text="'mdi-chevron-right' | fonticon "></label>
                    </Ripple>
                </GridLayout>
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
      notification: {
        sender: "Admin",
        time: "3 mins ago",
        title: "WHO IS THIS?",
        message: "I think i know you, dont I???"
      },
      introTxt: "Digitalize your business and keep track of all your earnings."
    };
  },
  mounted() {
    this.pageLoaded();
  },
  props: ["questionaireId"],
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
