<template>
  <page actionBarHidden="true">
    <StackLayout>
      <GridLayout>
        <ListView for="timetable in timetables" height="50px">
          <ScrollView>
            <v-template>
              <StackLayout v-for="(day,i) in daysOfTheWeek" :key="i">
                <label :text="day" textAlignment="center" class="font-weight-bold"></label>
                <StackLayout v-for="(timeTable,t) in timetables" :key="t">
                <CardView verticalAlignment="center" padding="2" margin="2" elevation="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50" v-if="day == timeTable.day" >
                  <GridLayout rows="auto,auto" columns="auto,auto,auto" class="p-4">
                    <label
                      row="0"
                      col="0" colSpan="1"
                      :textWrap="true"
                      class="h4 text-dark-black"
                      :text="timeTable.moduleName"
                    ></label>
                    <label
                      row="1"
                      col="0"
                      :textWrap="true"
                      class="h4 text-dark-black"
                      :text="timeTable.venue"
                    ></label>
                    <label
                      row="1"
                      col="1"
                      :textWrap="true"
                      class="h4 text-dark-black"
                      :text="timeTable.type"
                    ></label>
                    <label
                      row="0"
                      col="1" rowSpan="1"
                      :textWrap="true"
                      class="h4 text-dark-black"
                      :text="timeTable.startTime + '-' + timeTable.endTime"
                    ></label>
                  </GridLayout>
                </CardView>
                </StackLayout>
              </StackLayout>
            </v-template>
          </ScrollView>
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
    var daysOfTheWeek:String[]; 
    daysOfTheWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday"]
  }
};
</script>