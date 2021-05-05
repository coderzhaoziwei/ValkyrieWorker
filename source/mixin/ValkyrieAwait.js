export default {
  data() {
    return {

    }
  },
  methods: {
    await(timeout = 1000) {
      return new Promise(resolve => setTimeout(() => resolve(), timeout))
    },
    awaitPack(timeout = 30000) {
      return new Promise(resolve => {
        this.on(`pack`, function(data, off) {
          if (this.hasOwn(data, `eqs`) && this.hasOwn(data, `items`)) {
            resolve(true)
            off()
          }
        })
        setTimeout(() => resolve(false), timeout)
      })
    },
  },
  mounted() {

  },
}
