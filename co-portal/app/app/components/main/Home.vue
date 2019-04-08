<template>
  <page actionBarHidden="true">
    <GridLayout rows="*" columns="*">
      <ScrollView row="0">
        <StackLayout>
          
        </StackLayout>
      </ScrollView>
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
      introTxt: "Digitalize your business and keep track of all your earnings."
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
    }
  }
};
</script>

<style lang="scss" scoped>
.topMainText {
  color: white;
  background-color: linear-gradient(
    top bottom,
    rgba(255, 0, 0, 0.5),
    rgba(255, 20, 0, 0.7),
    rgba(255, 0, 30, 0.5),
    rgba(255, 20, 30, 0.7)
  );
}

.backgroundImage {
  background: url("~/assets/images/suit77_black_white.jpeg") no-repeat center
    center;
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
