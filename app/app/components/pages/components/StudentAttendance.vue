<template>
  <page actionBarHidden="true">
    <GridLayout rows="*,auto" columns="*">
      <PDFView :src="$api.getDownloadNotesURL(noteId)" @load="loadedPDF()"></PDFView>
      <ActivityIndicator
        v-show="isDownloadingFile"
        verticalAlignment="center"
        textAlignment="center"
        :busy="isDownloadingFile"
      ></ActivityIndicator>
      <StackLayout row="1">
        <GridLayout rows="auto" columns="*,*">
          <Ripple @tap="ShareFile" class="p-10" col="1" verticalAlignment="center" textAlignment="center">
            <label
              class="font-weight-bold mdi p-x-25 p-y-10 text-dark-black"
              textAlignment="center"
              fontSize="30%"
              :text="'mdi-share-variant' | fonticon "
            ></label>
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
import { HandleFile } from 'nativescript-handle-file';
import * as SocialShare from "nativescript-social-share";

export default {
  data() {
    return {
      pdfNoteFile: null,
      isDownloadingFile: true
    };
  },
  props: ["noteId","fileName"],
  mounted() {
  },
  methods: {
    loadedPDF() {
      this.isDownloadingFile = false;
    },
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: this.appSettings,
        doc: "admin"
      });
    },
    ShareFile(){
      SocialShare.shareUrl(this.$api.getDownloadNotesURL(this.noteId), this.fileName, "How would you like to share the notes?")
    },
    DownloadFile(){
        let handleFile = new HandleFile();
        handleFile.open({
          name :this.fileName,
          url: this.$api.getDownloadNotesURL(this.noteId),
          directory: "downloads", // only in android [downloads, pictures, movies, music]
          tittle: this.fileName // only in android
        }).then(result => {
          console.log(result);
        });
    },
    DownloadNotes() {
      if (!this.noteId) {
        this.navigate(null);
      }
      this.isDownloadingFile = true;
      this.$api
        .downloadNotes(this.noteId)
        .then(noteFile => {
          this.isDownloadingFile = false;
          noteFile = JSON.parse(JSON.stringify(noteFile));
          if (!noteFile || !noteFile.base64StringFile) {
            throw new Error("File can not be downloaded");
          }
          this.pdfNoteFile = noteFile.base64StringFile;
        })
        .catch(err => {
          this.isDownloadingFile = false;
          this.$feedback.error({
            title: err.message
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
