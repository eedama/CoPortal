<template>
  <page actionBarHidden="true">
    <GridLayout rows="*,auto" columns="*">
      <PDFView :src="pdfNoteFile"></PDFView>
      <ActivityIndicator
        v-if="!pdfNoteFile"
        verticalAlignment="center"
        textAlignment="center"
        :busy="!pdfNoteFile"
      ></ActivityIndicator>
      <StackLayout row="1">
        <GridLayout rows="auto" columns="*,*">
          <Ripple col="0" verticalAlignment="center" textAlignment="center">
            <label
              class="font-weight-bold mdi p-x-10"
              textAlignment="center"
              fontSize="45%"
              :text="'mdi-download' | fonticon "
            ></label>
          </Ripple>
          <Ripple col="1" verticalAlignment="center" textAlignment="center">
            <label
              class="font-weight-bold mdi p-x-10"
              textAlignment="center"
              fontSize="45%"
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
var fs = require("tns-core-modules/file-system");
export default {
  data() {
    return {
      pdfNoteFile: null
    };
  },
  props: ["noteId"],
  mounted() {
    this.DownloadNotes();
  },
  methods: {
    onLoad() {},
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: this.appSettings,
        doc: "admin"
      });
    },
    DownloadNotes() {
      if (!this.noteId) {
        this.navigate(null);
      }
      this.$api
        .downloadNotes(this.noteId)
        .then(noteFile => {
          noteFile = JSON.parse(JSON.stringify(noteFile));
          if (!noteFile || !noteFile.base64StringFile) {
            throw new Error("File can not be downloaded");
          }
          var documents = fs.knownFolders.documents();
          var path = fs.path.join(documents.path, noteFile.fileName);
          var pdfFile = fs.File.fromPath(path);

          const base64 = require("base64topdf");
          this.pdfNoteFile = base64.base64Decode(
            noteFile.base64StringFile,
            noteFile.fileName
          );

          alert(this.pdfNoteFile);

          pdfFile.writeText(noteFile.base64StringFile).then(
            () => {
              alert("Saved at " + path);
            },
            error => {
              alert(error);
            }
          );
        })
        .catch(err => {
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
