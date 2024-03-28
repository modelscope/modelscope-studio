const messages: Record<string, Record<string, string>> = {
  delete: {
    'zh-CN': '删除',
    'en-US': 'Delete',
  },
  duplicate: {
    'zh-CN': '复制',
    'en-US': 'Duplicate',
  },
  rename: {
    'zh-CN': '重命名',
    'en-US': 'Rename',
  },
  'upload.drop_file': {
    'zh-CN': '点击或拖拽文件到此区域上传',
    'en-US': 'Click or drag file to this area to upload',
  },
};
export const i18n = (key: string, locale = 'en-US') => {
  return messages[key]?.[locale] || messages[key]?.['en-US'] || key;
};
