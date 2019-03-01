<template>
  <page actionBarHidden="true">
    <StackLayout>
      <GridLayout>
        <ListView for="timetable in timetables" height="50px">
          <v-template>
            <CardView
              verticalAlignment="center"
              padding="2"
              margin="2"
              elevation="10"
              shadowOffsetHeight="10"
              shadowOpacity="0.2"
              shadowRadius="50"
            >
              <Ripple>
                <GridLayout rows="*" columns="auto,auto,auto,auto,auto,auto,auto">
                  <label col="1" class="h4 text-dark-black" :text="timetable.day"></label>
                  <label col="2" class="h4 text-dark-black" :text="timetable.moduleCode"></label>
                  <label col="3" class="h4 text-dark-black" :text="timetable.moduleName"></label>
                  <label col="4" class="h4 text-dark-black" :text="timetable.venue"></label>
                  <label col="5" class="h4 text-dark-black" :text="timetable.type"></label>
                  <label
                    col="6"
                    class="h4 text-dark-black"
                    :text="'${timetable.startTime}.${:}. ${timetable.endTime}'"
                  ></label>
                </GridLayout>
              </Ripple>
            </CardView>
          </v-template>
        </ListView>
      </GridLayout>
    </StackLayout>
  </page>
</template>

<script>
export default {
  data() {
    return {
      //Current Timetable Data
      timetables: [
        {
          day: "Monday",
          moduleCode: "CSC2A10",
          moduleName: "Computer Science 2A",
          venue: "C Les 201",
          type: "CLASS",
          startTime: "10:00",
          endTime: "10:30"
        },
        {
          day: "Tuesday",
          moduleCode: "IFM2A10",
          moduleName: "INFORMATICS 2A",
          venue: "C Les 201",
          type: "TEST",
          startTime: "10:00",
          endTime: "10:30"
        }
      ]
    };
  }
};
</script>