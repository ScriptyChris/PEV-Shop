module.exports = class JestWatchPlugin {
  apply(jestHooks) {
    jestHooks.onFileChange(({projects}) => {
      projects.forEach(item => {
        setTimeout(() => {
          console.log('--- watch plugin /item:', item);
        }, 5000)
      })
    })
  }
}
