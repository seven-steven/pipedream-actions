import moment from 'moment-timezone'
// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'Date Format',
  version: '0.0.1',
  key: 'date-format',
  description: "Date Format",
  type: 'action',
  props: {
    date: {
      type: 'string',
      label: 'Date',
      description: 'Date, default to `new Date()`',
      optional: true,
    },
    timezone: {
      type: 'string',
      label: 'Timezone',
      description: 'Timezone, eg: Asia/Shanghai, see [Timezone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). default to UTC',
      optional: true,
      options: [
        { label: 'UTC', value: 'UTC' },
        { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
      ],
    },
    format: {
      type: 'string',
      label: 'Format',
      description: 'Format String, eg: YYYY-MM-DDTHH:mm:ss.SSS[Z]. Format AS ISO8601 if not set',
      optional: true,
      options: [
        { label: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', value: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]' },
        { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
      ],
    }
  },
  async run({ steps, $ }) {
    const date = Boolean(this.date) ? this.date : new Date();
    const timezone = this.timezone || 'UTC';
    // Return data to use it in future steps
    return {
      timezone: timezone,
      format_date: moment.tz(date, timezone).format(this.format),
      iso8601: {
        date: moment.tz(date, timezone).format('YYYY-MM-DD'),
        time: moment.tz(date, timezone).format('HH:mm:ss.SSS[Z]'),
        timestamp: moment.tz(date, timezone).format(),
      }
    };
  },
})