import axios from 'axios'

// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  methods: {
    async imageUrlToBase64(url) {
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer'
        });
        const base64Data = Buffer.from(response.data).toString('base64');
        return `data:${response.headers['content-type']};base64,${base64Data}`;
      } catch (error) {
        console.error(error);
      }
    }
  },
  async run({ steps, $ }) {
    // Return data to use it in future steps
    const url = 'https://api.apiflash.com/v1/urltoimage/cache/m1pm3v5py1.webp?access_key=b72022f2f4474e3c9d8e49172891eda3';

    const base64String = await imageUrlToBase64(url);
    return base64String;

  },
})
