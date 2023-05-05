import moment from 'moment-timezone'
// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'Date Format',
  version: '0.0.1',
  key: 'date-format',
  description: "Date Format",
  type: 'action',
  props: {
    timezone: {
      type: 'string',
      label: 'Timezone',
      description: 'Timezone, eg: Asia/Shanghai, see [Timezone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)',
      optional: true,
      options: [
        { label: 'UTC', value: 'UTC' },
        { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
      ],
    },
    format: {
      type: 'string',
      label: 'Format',
      description: 'Format String, eg: YYYY-MM-DDTHH:mm:ss.SSS[Z]',
      optional: true,
      options: [
        { label: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', value: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]' },
        { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
      ],
    }
  },
  async run({ steps, $ }) {
    const timezone = this.timezone || 'UTC';
    const format = this.format || 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
    // Return data to use it in future steps
    return {
      timezone: timezone,
      format_date: moment.tz(new Date(), timezone).format(format),
      iso8601: {
        date: moment.tz(new Date(), timezone).format('YYYY-MM-DD'),
        time: moment.tz(new Date(), timezone).format('HH:mm:ss.SSS[Z]'),
        timestamp: moment.tz(new Date(), timezone).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      }
    };
  },
})