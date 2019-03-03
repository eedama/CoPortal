<template>
  <page actionBarHidden="true">
    <StackLayout>
      <GridLayout rows="auto" columns="*">
        <label
          row="0"
          verticalAlignment="center"
          textAlignment="center"
          class="text-dark-black font-weight-bold m-t-0 text-dark-black"
          fontSize="35%"
          text="TIMETABLE"
        ></label>
      </GridLayout>
      <ScrollView>
        <StackLayout>
          <StackLayout v-for="(day,i) in orderdDays" :key="i">
            <label :text="day" class="text-dark-black p-t-15 p-b-5 p-x-10" fontSize="22%"></label>
            <StackLayout v-for="(timeTable,t) in timetables" :key="t">
              <CardView
                verticalAlignment="center"
                margin="10"
                elevation="10"
                v-if="day == timeTable.day"
                :class="{'currentPeriod':timeTable.isCurrentPeriod}"
              >
                <GridLayout rows="auto,auto,auto" columns="*,auto" class="m-15">
                  <label
                    row="0"
                    col="0"
                    :textWrap="true"
                    verticalAlignment="center"
                    fontSize="17%"
                    class="font-weight-bold text-dark-black p-2"
                    :text="timeTable.moduleName"
                  ></label>
                  <label
                    row="1"
                    col="0"
                    :textWrap="true"
                    verticalAlignment="center"
                    class="text-dark-black p-2"
                    fontSize="15%"
                    :text="timeTable.moduleCode"
                  ></label>
                  <label
                    row="2"
                    col="0"
                    :textWrap="true"
                    verticalAlignment="center"
                    class="text-dark-black p-2"
                    fontSize="14%"
                    :text="timeTable.venue"
                  ></label>
                  <label
                    row="0"
                    col="1"
                    :textWrap="true"
                    textAlignment="center"
                    class="text-dark-black font-weight-bold p-x-10 P-2"
                    fontSize="13%"
                    borderRadius="50"
                    style="color:White;background-color:black;"
                    verticalAlignment="center"
                    :text="timeTable.type"
                  ></label>
                  <label
                    row="1"
                    col="1"
                    textAlignment="right"
                    :textWrap="true"
                    class="text-dark-black font-weight-bold p-2"
                    fontSize="15%"
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
          endTime: "10:30",
          isCurrentPeriod: false
        },
        {
          day: "Monday",
          moduleCode: "CSC2B10",
          moduleName: "Computer Science 2A",
          venue: "C Les 201",
          type: "CLASS",
          startTime: "12:00",
          endTime: "14:00",
          isCurrentPeriod: false
        },
        {
          day: "Monday",
          moduleCode: "CSC2A10",
          moduleName: "Computer Science 2A",
          venue: "C Les 201",
          type: "CLASS",
          startTime: "10:00",
          endTime: "10:30",
          isCurrentPeriod: false
        },
        {
          day: "Tuesday",
          moduleCode: "IFM2A10",
          moduleName: "INFORMATICS 2A",
          venue: "C Les 201",
          type: "TEST",
          startTime: "1:30",
          endTime: "2:0 `0",
          isCurrentPeriod: false
        }
      ],
      daysOfTheWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      orderdDays: []
    };
  },
  methods: {
    getCurrentPeriod(timetable) {
      var nowTime = this.getMoment().format("HH:mm");
      var nowDay = this.getMoment().format("dddd");
      if (timetable.day == nowDay) {
        if (timetable.startTime <= nowTime && timetable.endTime >= nowTime) {
          timetable.isCurrentPeriod = true;
        }
      }
      if (!this.orderdDays.some(v => v == timetable.day)) {
        this.orderdDays.push(timetable.day);
      }
    }
  },
  mounted() {
    this.timetables.forEach(timetable => {
      this.getCurrentPeriod(timetable);
    });
  }
};
</script>
<style>
.currentPeriod {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
