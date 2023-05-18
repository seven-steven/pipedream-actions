import axios from 'axios';
import crypto from 'crypto';

export default defineComponent({
    name: 'Send Message To FeiShu Bot Webhook',
    version: '0.0.2',
    key: 'send-message-to-feishu-bot-webhook',
    description: "Send Message To FeiShu Bot Webhook. [See the docs](https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN)",
    type: 'action',
    props: {
        webhook_url: {
            type: 'string',
            label: 'Webhook Url',
            description: 'Webhook Url. [See the docs](https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN#d3815c88)',
        },
        secret: {
            type: 'string',
            label: 'Secret',
            description: 'Secret which need to be used for sign. Leave blank if You don\'t need to sign your request. [See the docs](https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN#348211be)',
            optional: true
        },
        request_data: {
            type: 'string',
            label: 'Request Data',
            description: 'Data witch will be send to the webhook. [See the docs](https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN#8b0f2a1b)'
        }
    },
    methods: {
        /**
         * 生成签名
         * 签名的算法：把 timestamp + "\n" + 密钥 当做签名字符串，使用 HmacSHA256 算法计算签名，再进行 Base64 编码
         * @param {number} timestamp 时间戳，eg: 1599360473
         * @param {string} secret 密钥
         * @returns 签名
         */
        generate_sign() {
            const timestamp = Math.floor(Date.now() / 1000);
            const str = Buffer.from(`${timestamp}\n${this.secret}`, 'utf8');
            const sign = crypto.createHmac('SHA256', str);
            sign.update(Buffer.alloc(0));
            return { timestamp, sign: sign.digest('base64') };
        },
    },
    async run({ steps, $ }) {
        let request_data = {
            ...JSON.parse(this.request_data),
        }
        if (Boolean(this.secret)) {
            request_data = {
                ...this.generate_sign(),
                ...request_data,
            }
        }

        console.log(JSON.stringify(request_data));

        const { data } = await axios({
            method: "POST",
            url: this.webhook_url,
            data: request_data,
        })
        return data;
    },
})



// {
//     "msg_type": "post",
//         "content": {
//         "post": {
//             "zh_cn": {
//                 "title": "待整理收件箱-记录重复: {{ steps?.archive_or_update_duplicate_records_in_notion_database?.$return_value?.remain_record?.properties?.Name?.title[0]?.plain_text || '未知' }}",
//                     "content": [
//                         [
//                             {
//                                 "tag": "text",
//                                 "text": "已更新重复记录状态为：暂不收录\\n"
//                             }
//                             {{
//                                 steps?.archive_or_update_duplicate_records_in_notion_database?.$return_value?.duplicate_records.length <= 0 ? '' :
//                                     ',' + steps?.archive_or_update_duplicate_records_in_notion_database?.$return_value?.duplicate_records.map((record, index) => ([
//                                         {
//                                             tag: "text",
//                                             "text": "\\n",
//                                         },
//                                         {
//                                             tag: 'a',
//                                             text: '点击连接查看重复记录' + (index + 1) + '\\n',
//                                             href: `"${record.url}"`
//                                         }
//                                     ])).flat().map(item => JSON.stringify(item)).join(',')
//                             }}
//                         ]
//                     ]
//         }
//     }
// }
// }