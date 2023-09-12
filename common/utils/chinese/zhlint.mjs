import { run } from 'zhlint';
export default defineComponent({
    name: 'zhlint',
    version: '0.0.2',
    key: 'zhlint',
    description: "A linting tool for Chinese text content， see the [doc](https://github.com/Jinjiang/zhlint)",
    type: 'action',
    props: {
        text: {
            type: 'string',
            label: 'Text',
            description: 'plain text which need to be formate',
        },
    },

    methods: {
        zhlint(text) {
            if (!Boolean(text)) {
                return '';
            }

            const options = { rules: { preset: 'default' } };
            const output = run(text, options);
            console.log(output);
            return (output.result || '').trim();
        },
    },
    async run({ steps, $ }) {
        return this.zhlint(this.text);
    },
})
