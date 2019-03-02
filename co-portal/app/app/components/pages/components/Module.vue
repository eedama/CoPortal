<template>
  <page actionBarHidden="true">
    <GridLayout v-if="currentModule" rows="auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label row="0" verticalAlignment="center" textAlignment="center" class="text-dark-black" fontSize="35%" :text="module.code"></label>
          <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" :text="module.name"></label>
        </GridLayout>
      </StackLayout>
      <StackLayout row="1">
        <TabView tabBackgroundColor="white" selectedTabTextColor="black" androidSelectedTabHighlightColor="black">
          <TabViewItem title="Notes">
            <ScrollView>
              <WrapLayout>
                <StackLayout width="50%" v-for="note in module.notes" :key="note._id">
                  <CardView elevation="15" margin="5">
                    <GridLayout class="p-10" rows="auto,auto,auto" columns="*,auto,auto">
                      <label row="0" col="0" colSpan="3" :textWrap="true" verticalAlignment="center" textAlignment="center" class="font-weight-bold" fontSize="16%" :text="note.title"></label>
                      <label row="1" col="0" colSpan="3" verticalAlignment="center" textAlignment="center" class="font-weight-bold mdi p-15" fontSize="75%" :text="'mdi-file-pdf' | fonticon "></label>
                      <label row="2" col="0" verticalAlignment="bottom" class="h4 text-dark-black" :text="getMoment(note.date).fromNow()"></label>
                      <Ripple row="2" col="1" verticalAlignment="bottom" textAlignment="right">
                        <label class="font-weight-bold mdi p-x-5" textAlignment="right" fontSize="20%" :text="'mdi-download' | fonticon "></label>
                      </Ripple>
                      <Ripple row="2" col="2" verticalAlignment="bottom" textAlignment="right">
                        <label class="font-weight-bold mdi p-x-5" textAlignment="right" fontSize="20%" :text="'mdi-share-variant' | fonticon "></label>
                      </Ripple>
                    </GridLayout>
                  </CardView>
                </StackLayout>
              </WrapLayout>
            </ScrollView>
          </TabViewItem>
          <TabViewItem title="Marks">
             <ScrollView>
              <StackLayout>
                <CardView v-for="(marked,i) in currentMarks" :key="i"   elevation="15" margin="5">                  
                    <GridLayout verticalAlignment="center" class="p-10" rows="auto,auto,auto" columns="auto,auto,*">
                      <label row="0" rowSpan="3"    verticalAlignment="center"  textAlignment="center" class="font-weight-bold mdi p-15" fontSize="54" :text="'mdi-chart-pie' | fonticon "></label>
                      <label row="0" col="1" verticalAlignment="center" class="font-weight-bold"  :textWrap="true" fontSize="17%" :text="marked.title"></label>
                      <label row="0" col="3" verticalAlignment="center" textAlignment="right"   :color="colorLoaded(marked.mark)"   rowSpan="2" :textWrap="true" fontSize="45" :text="marked.mark"></label>
                     <label row="2" col="1" verticalAlignment="center" 
                   class="font-weight-bold p-x-10 p-b-2"
                  fontSize="13"
                  borderRadius="50"
                  color="white"
                  :style="{backgroundColor:colorLoaded(marked.mark)}"
                   textAlignment="center"
                     :text="marked.type.toLowerCase()"></label>
                      <label row="2" col="2" verticalAlignment="center"     textAlignment="right"  class="h4 text-dark-black" :text="getMoment(marked.date).fromNow()"></label>
                    </GridLayout>
                </CardView>
              </StackLayout>
            </ScrollView>
          </TabViewItem>
          <TabViewItem title="Tests">
            <ScrollView>
              <StackLayout>
                <CardView v-for="(test,i) in currentModule.questionaires" :key="i" elevation="15" margin="5">
                  <Ripple @tap="TakeTest(test)">
                    <GridLayout verticalAlignment="center" class="p-10" rows="auto,auto" columns="auto,*,auto">
                      <label row="0" rowSpan="2" verticalAlignment="center" textAlignment="center" class="font-weight-bold mdi p-15" fontSize="25%" :text="'mdi-file-document-box-multiple' | fonticon "></label>
                      <label row="0" col="1" verticalAlignment="center"  class="font-weight-bold" :textWrap="true" fontSize="17%" :text="test.title"></label>
                      <label row="1" col="1" verticalAlignment="center" :textWrap="true" fontSize="15%" :text="test.questions.length + ' Questions'"></label>
                      <label row="1" col="2" verticalAlignment="center" class="h4 text-dark-black" :text="getMoment(test.date).fromNow()"></label>
                    </GridLayout>
                  </Ripple>
                </CardView>
              </StackLayout>
            </ScrollView>
          </TabViewItem>
        </TabView>
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
        currentModule: null,
        currentMarks:[]
      };
    },
    mounted() {
      this.pageLoaded();
      this.$api.getModuleMarks(this.$store.state.cache.cachedUser.user._id,this.module._id)
      .then(marks=>
      {
this.currentMarks = marks;
 if (marks.length == 0) {
          this.$feedback.warning({
            title: "Marks",
            message: "No Marks to display yet",
            duration: 3000
          });
        
        }
      })
      .catch(error=>
      {
  this.$feedback.error({
            title: "Marks",
            message: "Can not retrieve marks at this time",
            duration: 3000
          });
      })
    
    },
    props: ["module"],
    methods: {
      pageLoaded() {
        if(!this.module){
          this.navigate(null);
        }
        this.currentModule = this.module;  
      },
      TakeTest(test) {
        this.navigate("/take/test", {
          dbQuestionaire: test
        });
      },colorLoaded(marked)
      {
        if(marked < 50)
        {
          return "darkred"
        }else
        {
          return "darkgreen"
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  
</style>
