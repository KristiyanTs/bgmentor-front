<template>
  <v-sheet height="calc(100vh - 135px)" color="rgba(0,0,0,0)">
    <v-calendar
      ref="calendar"
      v-model="local_focus"
      color="rgba(0,0,0,0)"
      first-interval="8"
      interval-count="11"
      :weekdays="weekdays"
      :events="events"
      event-start="start_time"
      event-end="end_time"
      :event-color="getEventColor"
      :event-margin-bottom="3"
      :now="today"
      :type="type"
      :weekday-format="(d) => $t(`calendar.weekdays.${d.weekday}`)"
      :interval-format="(d) => d.time"
      @click:event="showEvent"
      @click:more="viewDay"
      @click:date="viewDay"
      @click:time="newEvent"
      @change="updateRange"
    ></v-calendar>
    <v-menu
      v-if="selectedEvent && selectedEvent.id"
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
    >
      <LessonPreview
        v-if="current_user.role == 'teacher' || current_user.admin"
        :lesson_id="selectedEvent.id"
        :color="getEventColor(selectedEvent)"
        :eventDialogOpen="eventDialogOpen"
        @lessonDeleted="lessonDeleted"
        @editLesson="editLesson"
        @onClose="selectedOpen = false"
      />
      <LessonInfo
        v-else
        :lesson_id="selectedEvent.id"
        :color="getEventColor(selectedEvent)"
        :eventDialogOpen="eventDialogOpen"
        @lessonDeleted="lessonDeleted"
        @editLesson="editLesson"
        @onClose="selectedOpen = false"
      />
    </v-menu>
  </v-sheet>
</template>

<script>
import LessonPreview from './LessonPreview'
import LessonInfo from './LessonInfo'
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  components: {
    LessonPreview,
    LessonInfo
  },
  props: {
    focus: {
      type: String,
      default: null,
      description: 'Currently selected date'
    },
    today: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'week',
      description: 'Type of the calendar view day/week/month'
    },
    start: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      local_focus: null,
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      events: [],
      eventDialogOpen: false,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      new_event_start: null
    }
  },
  mounted() {
    store.dispatch('fetchSlots')
  },
  methods: {
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    viewDay({ date }) {
      this.$emit('updateType', 'day')
    },
    newEvent(props) {
      this.selectedEvent = { ...store.state.lessons.new_lesson }
      if (this.selectedOpen) {
        this.selectedOpen = false
        return
      }
      this.new_event_start = props
      this.eventDialogOpen = true
    },
    lessonDeleted() {
      this.selectedEvent = {}
      this.selectedElement = null
    },
    editLesson() {
      this.eventDialogOpen = true
    },
    updateRange(props) {
      this.$emit('updateRange', props)
    },
    getEventColor(event) {
      if (event.group) {
        let location = this.locations.find(
          (l) => l.id === event.group.location_id
        )
        return location ? location.color : '#fff'
      } else {
        return '#fff'
      }
    }
  },
  computed: {
    ...mapGetters(['lessons', 'locations', 'current_user'])
  },
  watch: {
    focus: {
      immediate: true,
      handler() {
        this.local_focus = this.focus
      }
    },
    local_focus() {
      this.$emit('updateFocus', this.local_focus)
    },
    lessons() {
      this.events = this.lessons.map((l) => {
        return {
          ...l,
          start_time: this.$moment
            .tz(l.start_time, 'Europe/Sofia')
            .format('YYYY-MM-DD HH:mm'),
          end_time: this.$moment
            .tz(l.end_time, 'Europe/Sofia')
            .format('YYYY-MM-DD HH:mm'),
          color: 'primary',
          name: `${l.teacher ? l.teacher.name : ''} - ${
            l.group ? l.group.name : ''
          }`
        }
      })
    }
  }
}
</script>

<style scoped>
>>> .v-calendar-daily__scroll-area {
  overflow-y: auto;
}
>>> .v-calendar.v-calendar-daily {
  background-color: rgba(0, 0, 0, 0) !important;
}
.v-calendar-daily {
  border: 0px;
}
</style>
