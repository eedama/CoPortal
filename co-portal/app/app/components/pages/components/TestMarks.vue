<template>
    <page actionBarHidden="true">
        <GridLayout rows="auto,*,auto" columns="*">
            <StackLayout row="0">
                <GridLayout rows="auto,auto" columns="*">
                    <label row="0" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="20%" text="solutionId"></label>
                    <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="20%" :text="solutionId"></label>
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
      solutions: [],
      Questionaire: null,
      txtError: "",
      isLoading: false
    };
  },
  mounted() {},
  props: ["solutionId"],
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
