const { execSync } = require('child_process')

let changeFiles = execSync('git status --porcelain || true').toString().split('\n')
const gitAddFiles = []
changeFiles.forEach(fileName => {
  const reg = /^[A-Z]\s{2}(?!\s)/
  if (reg.test(fileName)) {
    const dirReg = /\/(.+?)\//
    if (dirReg.test(fileName)) {
      return gitAddFiles.push(fileName.match(dirReg)[1])
    }
    gitAddFiles.push(fileName.replace(reg, ''))
  }
})

module.exports = {
  prompt: {
    scopes: gitAddFiles,
    customScopesAlign: !gitAddFiles ? 'top-bottom' : 'bottom',
    enableMultipleScopes: true,
    scopeEnumSeparator: ",",
	}
}