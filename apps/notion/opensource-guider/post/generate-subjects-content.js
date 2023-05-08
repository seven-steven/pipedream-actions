// To use previous step data, pass the `steps` object to the run() function
export default defineComponent({
    props: {
        subjects: {
            type: 'string',
            label: 'Subjects',
            description: 'Notion::OSDB/Subject array, [Ref](https://www.notion.so/tagly/2802f8ddbb294101b52d698c5f37aba9?v=11ad3e397caf4ef29a3b97c1261afbba)',
        },
        template: {
            type: 'string',
            label: 'Template',
            description: 'Content Template of single Subject'
        },
        placeholders: {
            type: 'string[]',
            label: 'Placeholders',
            description: 'Placeholders in Template',
            reloadProps: true,
        },
    },
    async additionalProps() {
        const properties = {
            a: {
                type: 'string',
                label: 'a',
                description: 'a',
            }
        };
        return properties;
    },
    // async additionalProps() {
    //     // const { properties } = await this.notion.retrieveDatabase(this.parent);
    //     // const selectedProperties = pick(properties, this.propertyTypes);
    //     // return this.buildAdditionalProps({
    //     //     properties: selectedProperties,
    //     //     meta: this.metaTypes,
    //     // });
    //     const placeholder_list = JSON.parse(this.placeholder_list || '[]');
    //     if (!typeof placeholder_list === 'array') {
    //         console.log("ERROR");
    //     }
    //     const properties = {
    //         a: {
    //             type: 'string',
    //             label: 'a',
    //             description: 'a',
    //         }
    //     };
    //     placeholder_list.forEach(e => {
    //         properties[e] = {
    //             type: 'string',
    //             label: e,
    //             description: e,
    //         }
    //     })
    //     return properties;
    // },
    methods: {
        generateTopic(topic) {
            // TODO 判空
            // TODO 属性不存在就不打印属性名
            return `# ${topic?.properties?.Name?.title[0]?.plain_text || ''}

${topic?.properties?.Introduction?.rich_text[0]?.plain_text || ''}`;
        },
        generateSubjects(subjectList) {
            let subjectContent = '';
            subjectList.forEach(subject => {
                let introduction = subject?.properties?.Description?.rich_text[0]?.plain_text || '';

                subjectContent += `
## ${subject?.properties?.Name?.title[0]?.plain_text || ''}

${subject?.properties?.Summary?.rich_text[0]?.plain_text || ''}
Stars: ${subject?.properties?.Stars?.number || 0}  Fork: ${subject?.properties?.Forks?.number || 0} License: ${subject?.properties?.License?.select?.name || 'Unknown'} Type: ${subject?.properties?.Type?.select?.name || 'Unknown'}
URL: ${subject?.properties?.URL?.url || ''}

> ${introduction}
`});
            return subjectContent;
        },
        generatePostContent(topic, subjectList) {
            return this.generateTopic(topic) + this.generateSubjects(subjectList);
        }
    },
    async run({ steps, $ }) {
        const placeholder_list = JSON.parse(this.placeholder_list || '[]');
        if (!typeof placeholder_list === 'array') {
            console.log("ERROR");
        }
        placeholder_list.forEach(e => {
            this.props[e] = {
                type: 'string',
                label: e,
                description: e,
            }
        })

        // Return data to use it in future steps
        return this.generatePostContent(steps.trigger.event, steps.query_subject_by_topic.$return_value.results);
    },
})