import { Client } from "@notionhq/client"
import MarkdownIt from 'markdown-it';
import attrs from 'markdown-it-attrs';

const md = new MarkdownIt();
md.use(attrs);

export default defineComponent({
  name: 'Create OSG Post',
  version: '0.0.1',
  key: 'osg-post-create',
  description: "Create OSG Post",
  type: 'action',
  props: {
    notion: {
      type: "app",
      app: "notion",
    },
    parent_database_id: {
      type: 'string',
      label: 'ParentDatabaseId',
      description: 'ParentDatabaseId',
    },
    cover: {
      type: 'string',
      label: 'Cover URL',
      description: 'Cover external URL',
      optional: true,
    },
    title: {
      type: 'string',
      label: 'Title',
      description: 'Title',
    },
    content: {
      type: 'string',
      label: 'Page Content',
      description: 'Page Content',
      optional: true,
    },
    topic: {
      type: 'string[]',
      label: 'Topic',
      description: 'Topic',
      optional: true,
    },
    subjects: {
      type: 'string[]',
      label: 'Subjects',
      description: 'Subjects',
      optional: true,
    },
    summary: {
      type: 'string',
      label: 'Summary',
      description: 'Summary',
      optional: true,
    }
  },
  methods: {
    markdown2Blocks(markdown, page_id) {
      if (!Boolean(markdown) || !Boolean(page_id)) {
        return [];
      }

      const tokens = md.parse(markdownText, {});
      let splits = [];

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        const block = {
          object: 'block',
          parent: {
            type: 'page_id',
            page_id: page_id,
          },
        };
        switch (token.type) {
          case 'image':
            const imageName = token.attrGet('alt');
            const imageUrl = token.attrGet('src');
            block = {
              ...block,
              type: 'image',
              image: {
                type: 'external',
                external: imageUrl,
              },
              caption: [
                {
                  type: 'text',
                  text: {
                    content: imageName,
                    link: null
                  }
                }
              ]
            }
            break;
          default:
            block = {
              ...block,
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: token.content
                    }
                  }
                ]
              }
            }
            break;
        }

        if (token.type === 'image') {
          splits.push(JSON.stringify({ image_name: imageName, image_url: imageUrl }));
        } else {
        }
      }

      return splits;
    }
  },
  async run({ steps, $ }) {

  },
})
