export default {
  data() {
    return {
      exitList: [],
    }
  },
  mounted() {
    this.on(`exits`, function(data) {
      if (data.items instanceof Array) {
        this.exitList.splice(0)
        Object.keys(data.items).forEach(x => {
          const name = data.items[x]
          const command = `go ${x}`
          this.exitList.push({ name, command })
        })
      }
    })
  },
}
