<template>
  <page actionBarHidden="true">
    <GridLayout rows="*,auto" columns="*">
      <PDFView :src="$api.getDownloadNotesURL(noteId)" @onLoad="loadedPDF()"></PDFView>
      <ActivityIndicator
        v-show="isDownloadingFile"
        verticalAlignment="center"
        textAlignment="center"
        :busy="isDownloadingFile"
      ></ActivityIndicator>
      <StackLayout row="1">
        <GridLayout rows="auto" columns="*,*">
          <Ripple class="p-10" col="0" verticalAlignment="center" textAlignment="center">
            <label
              class="font-weight-bold mdi p-x-25 p-y-10 text-dark-black"
              textAlignment="center"
              fontSize="30%"
              :text="'mdi-download' | fonticon "
            ></label>
          </Ripple>
          <Ripple class="p-10" col="1" verticalAlignment="center" textAlignment="center">
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
export default {
  data() {
    return {
      pdfNoteFile: null,
      isDownloadingFile: true
    };
  },
  props: ["noteId"],
  mounted() {
   // this.DownloadNotes();
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

          alert(this.pdfNoteFile);

          /*
          var documents = fs.knownFolders.documents();
          var path = fs.path.join(documents.path, noteFile.fileName);
          var pdfFile = fs.File.fromPath(path);

          pdfFile.writeText(noteFile.base64StringFile).then(
            () => {
              alert("Saved at " + path);
            },
            error => {
              alert(error);
            }
          );
          */
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
