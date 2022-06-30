// cz.config.js
// eslint-disable-next-line no-undef
module.exports = {
  messages: {
    type: '选择你要提交的类型 :',
    scope: '选择一个提交范围（可选）:',
    customScope: '请输入自定义的提交范围 :',
    subject: '填写简短的变更描述 :\n',
    body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
    breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
    footerPrefixsSelect: '选择关联issue前缀（可选）:',
    customFooterPrefixs: '输入自定义issue前缀 :',
    footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
    confirmCommit: '是否提交或修改commit ?'
  },
  types: [
    { value: 'feat', name: 'feat:           ✨特性 | 新增功能', emoji: ':sparkles:' },
    { value: 'fix', name: 'fix:             🐛修复 | 修复缺陷', emoji: ':bug:' },
    { value: 'docs', name: 'docs:           📝文档 | 文档变更', emoji: ':memo:' },
    { value: 'style', name: 'style:         💄格式 | 代码格式（不影响功能，例如空格、分号等格式修正）', emoji: ':lipstick:' },
    { value: 'refactor', name: 'refactor:   ♻️重构 | 代码重构（不包括 bug 修复、功能新增）', emoji: ':recycle:' },
    { value: 'perf', name: 'perf:           ⚡️性能 | 性能优化', emoji: ':zap:' },
    { value: 'test', name: 'test:           ✅测试 | 添加或修改测试代码', emoji: ':white_check_mark:' },
    { value: 'build', name: 'build:         📦️构建 | 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）', emoji: ':package:' },
    { value: 'ci', name: 'ci:               🎡集成 | 修改 CI 配置、脚本', emoji: ':ferris_wheel:' },
    { value: 'revert', name: 'revert:       ⏪️回退 | 回滚 commit', emoji: ':hammer:' },
    { value: 'chore', name: 'chore:         🔨其他 | 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）', emoji: ':rewind:' }
  ],
  useEmoji: true,
  themeColorCode: '',
  scopes: [],
  allowCustomScopes: true,
  allowEmptyScopes: true,
  customScopesAlign: 'bottom',
  customScopesAlias: '以上都不是？我要自定义',
  emptyScopesAlias: '跳过',
  upperCaseSubject: false,
  markBreakingChangeMode: false,
  allowBreakingChanges: ['feat', 'fix'],
  breaklineNumber: 100,
  breaklineChar: '|',
  skipQuestions: [],
  issuePrefixs: [
    // 如果使用 gitee 作为开发管理
    { value: 'link', name: 'link:     链接 ISSUES 进行中' },
    { value: 'closed', name: 'closed:   标记 ISSUES 已完成' }
  ],
  customIssuePrefixsAlign: 'top',
  emptyIssuePrefixsAlias: '跳过',
  customIssuePrefixsAlias: '自定义前缀',
  allowCustomIssuePrefixs: true,
  allowEmptyIssuePrefixs: true,
  confirmColorize: true,
  maxHeaderLength: Infinity,
  maxSubjectLength: Infinity,
  minSubjectLength: 0,
  scopeOverrides: undefined,
  defaultBody: '',
  defaultIssues: '',
  defaultScope: '',
  defaultSubject: ''
}
