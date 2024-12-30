<template>
  <div>
    <q-page>
      <h5>Schedule Your Interview</h5>
      <div class="calendar-container">
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
        @eventClick="handleEventClick"
      />
      </div>
      <br/>
      <div>
        <JobCalendarFormLecturer
          @save-event="saveEventData"
          @cancel-event="cancelEventData"
          :eventData="selectedEvent"
        />
      </div>
<!--      <q-card v-if="calendarOptions.events.length > 0" class="q-mt-md">-->
<!--        <q-card-section>-->
<!--          <h3>Select a Time</h3>-->
<!--          <q-list bordered>-->
<!--            <q-item-->
<!--              v-for="time in calendarOptions.events"-->
<!--              :key="time"-->
<!--              clickable-->
<!--              @click="selectTime(time)"-->
<!--            >-->
<!--              <q-item-section>{{ time }}</q-item-section>-->
<!--            </q-item>-->
<!--          </q-list>-->
<!--        </q-card-section>-->
<!--      </q-card>-->

    </q-page>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue"; // FullCalendar Core
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 클릭/드래그 인터랙션 플러그인
import axios from "axios";
import JobCalendarFormLecturer from "pages/JobCalendarFormLecturer.vue";

export default {
  components: {
    FullCalendar, JobCalendarFormLecturer
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: 'en',
        events: [],  // 빈 배열로 초기화
        height: 500,
        expandRows: true,
        eventClick:this.handleEventClick
      },
      selectedEvent: null, // 선택된 이벤트 저장
      updatedData:[],
      availableTimes: [], // 선택한 날짜의 가능한 시간들
      selectedDate: null, // 선택된 날짜
      savedData:[],
      canceledData:[]
    };
  },
  mounted() {
    this.getAllJobInterviewTimes();
  },

  methods: {
    // onDateClick(info) {
    //   this.selectedDate = info.dateStr; // FullCalendar에서 제공하는 선택된 날짜
    //   this.fetchAvailableTimes(this.selectedDate);
    // },

    getAllJobInterviewTimes(){
      axios.get('http://localhost:8080/getAllInterviewTime')
        .then(({data})=>{
          const events = data.map(event =>({
            title: event.lecturer_name && event.lecturer_user_id
              ? `${event.lecturer_name}(${event.lecturer_user_id})`
              : 'available',
            start: event.interview_date_time,
            extendedProps:{
              lecturer_user_id : event.lecturer_user_id,
              lecturer_name : event.lecturer_name,
              start_time : event.interview_date_time,
              job_interview_id:event.job_interview_id
            }
          }));
          this.calendarOptions.events = events;
          console.log('getAllInterviewTime >>>', this.calendarOptions.events);
      })
    },

    handleEventClick(info) {
      // 현재 사용자의 lecturer_user_id 가져오기 (예: 로그인 상태에서 가져옴)
      const currentLecturerId = this.$store.state.lecturerInfo.lecturer_user_id; // 현재 로그인한 사용자 ID

      // 클릭한 이벤트의 lecturer_user_id
      const eventLecturerId = info.event.extendedProps.lecturer_user_id;

      // ID가 다르면 클릭 동작 취소
      // TODO     밑 조건에 추가하기.
      if (eventLecturerId !== currentLecturerId && eventLecturerId !== null) {
        this.$q.dialog({
          title: "Not Available",
          message: 'You cannot select this time slot',
          ok: { label: "OK", color: "primary" },
        });
        info.jsEvent.preventDefault(); // 클릭 이벤트 취소
        return;
      }

      // 클릭한 이벤트의 데이터 추출
      const eventData = {
        title: info.event.extendedProps.lecturer_name,
        start: info.event.start.toISOString(),
        lecturer_name: info.event.extendedProps.lecturer_name,
        lecturer_user_id: info.event.extendedProps.lecturer_user_id,
        start_time : info.event.extendedProps.start_time,
        job_interview_id: info.event.extendedProps.job_interview_id
      };

      // 이벤트 추가 후 캘린더를 리프레시하여 새로 추가된 이벤트가 보이게 함
      //this.$refs.fullCalendar.getApi().addEvent(eventData);

      this.selectedEvent = eventData;
      console.log('job eventData >>>', eventData);
      console.log('job this.selectedEvent >>>', this.selectedEvent); // 클릭한것 보여줌. 작동함.
    },

    saveEventData(saveData){ //자식에서 수정후 부모에서 emit받은 것.
      // TODO 저장성공후, 필드 값이 비워야. 241211

      console.log('자식에서 수정후 부모에서 emit받은 것. >>>', saveData);
      // this.initialEvents = {...this.initialEvents, ...updateData};
      // console.log('pronunciationRating >>>', this.initialEvents[1].pronunciationRating);
      //자식에서 emit하고, 바로 위에서 업데한 것으로, 서버에 insert? update?

      //console.log('saveData.lecturer_user_id >>>', saveData.lecturer_user_id); // haha
      //if (this.selectedEvent && this.selectedEvent.lecturer_user_id === saveData.lecturer_user_id) {

      this.$set(this, 'selectedEvent', { ...saveData, isSaved: true, isCanceled: false });
      //this.selectedEvent = {...saveData, isSaved:true, isCanceled: false};
      //}
      //console.log('saveData this.selectedEvent.lecturer_user_id >>>', this.selectedEvent.lecturer_user_id); //
      // 바로 위처럼후에, FullCalendar에서 이벤트 업데이트
      //const calendarApi = this.$refs.fullCalendar.getApi(); // FullCalendar 인스턴스 가져오기

        this.saveSchedule();
    },

    async saveSchedule(){
      // const savePayload = {
      //   lecturer_user_id: this.selectedEvent.lecturer_user_id, // 서버에서 이벤트를 식별하는 ID
      //   lecturer_name: this.selectedEvent.lecturer_name, // 수정된 제목
      //   start_time: this.selectedEvent.start_time, // 발음 평가
      //   job_interview_id:this.selectedEvent.job_interview_id
      // };

        const formDataWithout = this.selectedEvent;
        if(formDataWithout.start_time){
          formDataWithout.interview_date_time = formDataWithout.start_time
          delete formDataWithout.start_time;
        }
        delete formDataWithout.title;
        delete formDataWithout.start;
        delete formDataWithout.isSaved;
        delete formDataWithout.isCanceled;
        //console.log('formDataWithout >>>', formDataWithout);

        await this.$store.dispatch('countByLecturerUserId',
          {lecturer_user_id: this.selectedEvent.lecturer_user_id}
        )
          .then((res)=>{
            // console.log('count res >>>', res);
            // console.log('saveInterviewTime formDataWithout>>>', formDataWithout); //
            if(res.data !== null){
              axios.post('http://localhost:8080/saveInterviewTime', formDataWithout)
                .then(res=>{

                  // FullCalendar에서 이벤트 업데이트(저장/삭제등후 바로 FullCalendar를 갱신 하는 것.)
                  const calendarApi = this.$refs.fullCalendar.getApi(); // FullCalendar 인스턴스 가져오기

                  // 캘린더에 있는 기존 이벤트들을 가져옴
                  const currentEvents = calendarApi.getEvents();

                  // 수정된 이벤트와 일치하는 이벤트를 찾고, 해당 이벤트를 수정
                  console.log('existingEvent save this.selectedEvent >>>', this.selectedEvent); //
                  const existingEvent = currentEvents.find(
                    (event) => event.extendedProps.start_time === this.selectedEvent.interview_date_time);
                  console.log('existingEvent >>>',existingEvent ); //undefined

                  if (existingEvent) {
                    // 기존 이벤트를 업데이트만 하는 것.
                    existingEvent.setProp('title', `${this.selectedEvent.lecturer_name}(${this.selectedEvent.lecturer_user_id})`);
                    existingEvent.setStart(this.selectedEvent.start);
                    existingEvent.setExtendedProp('lecturer_user_id', this.selectedEvent.lecturer_user_id);
                    existingEvent.setExtendedProp('lecturer_name', this.selectedEvent.lecturer_name);
                    existingEvent.setExtendedProp('start_time', this.selectedEvent.interview_date_time);
                    existingEvent.setExtendedProp('job_interview_id', this.selectedEvent.job_interview_id);
                    // '저장됨' 상태 플래그 추가
                    existingEvent.setExtendedProp('isSaved', true);
                  }
                })
                .catch(error => {
                  console.error('save 실패:', error.response || error.message);
                });
            } else {
              this.$q.dialog({
                title: "Not Available",
                message: 'No more interview. Your interview has already been scheduled. If you want to reschedule, CANCLE the interview first',
                ok: { label: "OK", color: "primary" },
              }).onOk(()=>{
                this.selectedEvent = '';
              })

            }
          })
    },

    cancelEventData(cancelData){ //자식에서 수정후 부모에서 emit받은 것.
      console.log('자식에서 수정후 부모에서 emit받은 것. cancelData >>>', cancelData);
      // this.initialEvents = {...this.initialEvents, ...updateData};
      // console.log('pronunciationRating >>>', this.initialEvents[1].pronunciationRating);
      //자식에서 emit하고, 바로 위에서 업데한 것으로, 서버에 insert? update?

      console.log('cancelData.lecturer_user_id >>>', cancelData.lecturer_user_id); // abcd
      //if (this.selectedEvent && this.selectedEvent.lecturer_user_id === saveData.lecturer_user_id) {
      this.selectedEvent = {...cancelData, isCanceled:true, isSaved:false};
      //}
      console.log('cancelData this.selectedEvent.lecturer_user_id >>>', this.selectedEvent.lecturer_user_id); //abcd

      this.cancelSchedule(this.selectedEvent.lecturer_user_id);
    },

    cancelSchedule(lecturer_user_id){
      const param = {lecturer_user_id : lecturer_user_id};
      console.log('cancelSchedule param >>>', param);
      const queryString = new URLSearchParams(param).toString(); // 쿼리 문자열 생성

      axios.post(`http://localhost:8080/cancelInterviewTime?${queryString}` )
        .then(res=>{
          console.log('cancelInterviewTime res >>>', res);
          //this.selectedEvent = '';

          // FullCalendar에서 이벤트 업데이트(저장/삭제등후 바로 FullCalendar를 갱신 하는 것.)
          const calendarApi = this.$refs.fullCalendar.getApi(); // FullCalendar 인스턴스 가져오기

          // 캘린더에 있는 기존 이벤트들을 가져옴
          const currentEvents = calendarApi.getEvents();

          // 수정된 이벤트와 일치하는 이벤트를 찾고, 해당 이벤트를 수정
          console.log('existingEvent this.selectedEvent.start_time >>>', this.selectedEvent); // 객체 있음.
          const existingEvent = currentEvents.find(
            (event) => event.extendedProps.start_time === this.selectedEvent.start_time);
          console.log('existingEvent >>>', existingEvent ); // 있음.

          if (existingEvent) {
            // 기존 이벤트를 업데이트만 하는 것.
           // existingEvent.setProp('title', `${this.selectedEvent.lecturer_name}(${this.selectedEvent.lecturer_user_id})`);
            existingEvent.setProp('title', `available`);
            existingEvent.setStart(this.selectedEvent.start);
            existingEvent.setExtendedProp('lecturer_user_id', null);
            existingEvent.setExtendedProp('lecturer_name', null);
            existingEvent.setExtendedProp('start_time', this.selectedEvent.start_time);
            existingEvent.setExtendedProp('job_interview_id', this.selectedEvent.job_interview_id);
            // '취소됨' 상태 플래그 추가
            existingEvent.setExtendedProp('isCanceled', true);
          }
        })
        .catch(error => {
          console.error('delete 실패:', error.response || error.message);
        });
    },

    fetchAvailableTimes(date) {
      // API 호출하여 선택된 날짜의 가능한 시간을 가져오기
      axios
        .get(`/api/interview-times?date=${date}`)
        .then((response) => {
          this.availableTimes = response.data.times || [];
        })
        .catch((error) => {
          console.error("Error fetching times:", error);
          this.availableTimes = [];
        });
    },
    selectTime(time) {
      // 선택한 시간으로 인터뷰 예약
      axios
        .post("/api/schedule-interview", {
          date: this.selectedDate,
          time,
        })
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: `Interview scheduled for ${this.selectedDate} at ${time}`,
          });
          this.$router.push("/lecturer-main"); // 원래 페이지로 이동
        })
        .catch((error) => {
          console.error("Error scheduling interview:", error);
          this.$q.notify({
            type: "negative",
            message: "Failed to schedule interview. Please try again later.",
          });
        });
    },
  },
};
</script>
