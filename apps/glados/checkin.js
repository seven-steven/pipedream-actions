import axios from 'axios'
// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
  name: 'GLaDOS Checkin',
  version: '0.0.1',
  key: 'glados-checkin',
  description: "GLaDOS Checkin, [glados](https://1lq2b-q22hs-lpfk7-tduwv.glados.space)",
  type: 'action',
  props: {
    authorization: {
      type: 'string',
      label: 'Authorization',
      description: 'HTTP header Authorization',
      optional: false,
    },
    cookie: {
      type: 'string',
      label: 'Cookie',
      description: 'HTTP header Cookie',
      optional: false,
    },
  },
  async run({ steps, $ }) {
    return await axios.post('https://glados.rocks/api/user/checkin', {
      token: 'glados.network'
    }, {
      headers: {
        'authority': 'glados.rocks',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9',
        'authorization': this.authorization,
        'cache-control': 'no-cache',
        'content-type': 'application/json;charset=UTF-8',
        'cookie': this.cookie,
        'dnt': '1',
        'origin': 'https://glados.rocks',
        'pragma': 'no-cache',
        'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
      }
    }).then(response => {
      console.log(response);
      return response.data;
    }).catch(error => {
      console.error(error);
    });
  },
})