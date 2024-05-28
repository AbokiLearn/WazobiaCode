// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files';
var Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/*.md`,
  fields: {
    title: { type: 'string', required: true },
    author: { type: 'string', required: true },
    date: { type: 'date', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => {
        return `/content/${post._raw.flattenedPath.split('/')[1]}`;
      },
    },
  },
}));
var contentlayer_config_default = makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
});
export { Post, contentlayer_config_default as default };
//# sourceMappingURL=compiled-contentlayer-config-H52GDBYJ.mjs.map
