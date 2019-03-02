<template>
  <page actionBarHidden="true">
    <GridLayout rows="*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto" columns="*">
          <label row="0" verticalAlignment="center" textAlignment="center" class="text-dark-black font-weight-bold m-t-0 text-dark-black" fontSize="35%" text="TiMETABLE"></label>
          </GridLayout>
    <StackLayout>
          <ScrollView>
            <StackLayout>
            <StackLayout v-for="(day,i) in daysOfTheWeek" :key="i">
                <label :text="day" textAlignment="center" class="font-weight-bold text-dark-black p-t-15 p-b-5" fontSize="20%"></label>
                <StackLayout v-for="(timeTable,t) in timetables" :key="t">
                <CardView verticalAlignment="center" class="" margin="10" elevation="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50" v-if="day == timeTable.day" >
                  <GridLayout rows="auto,auto,auto" columns="*,*" class="m-15">
                    <label
                      row="0"
                      col="0" colSpan="1"
                      :textWrap="true" textAlignment="center" fonSize="20%"
                      class="font-weight-bold text-dark-black"
                      :text="timeTable.moduleName"
                    ></label>
                    <label
                      row="1"
                      col="0"
                      :textWrap="true" textAlignment="center"
                      class="text-dark-black" fontSize="19%"
                      :text="timeTable.moduleCode"
                    ></label>
                    <label
                      row="2"
                      col="0"
                      :textWrap="true" textAlignment="center"
                      class="text-dark-black" fontSize="17%"
                      :text="timeTable.venue"
                    ></label>
                    <label
                      row="0"
                      col="1"
                      :textWrap="true" textAlignment="top right"
                      class="text-dark-black" fontSize="13%"
                      :text="timeTable.type.bagde"
                    ></label>
                    <label
                      row="0"
                      col="1" textAlignment="right"
                      :textWrap="true"
                      class="text-dark-black" fontSize="19%" class="font-weight-bold"
                      :text="timeTable.startTime + '-' + timeTable.endTime"
                    ></label>
                  </GridLayout>
                </CardView>
                </StackLayout>
              </StackLayout>
              </StackLayout>
          </ScrollView>
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
          day: "Monday",
          moduleCode: "CSC2A10",
          moduleName: "Computer Science 2A",
          venue: "C Les 201",
          type: "CLASS",
          startTime: "10:00",
          endTime: "10:30"
        },
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
      ],
      daysOfTheWeek:[ "Monday", "Tuesday", "Wenesday"," Thursday","Nppe"],
    };
  }
}

</script>
