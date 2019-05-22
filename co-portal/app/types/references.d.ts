/// <reference path="../node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="../node_modules/tns-platform-declarations/android-26.d.ts" />

import Vue, { ComponentOptions } from "vue";
declare module "vue/types/vue" {
  interface Vue {
    currentPage: number;
    $navigator: any;
    $firebase: any;
    navigate: any;
  }
}
