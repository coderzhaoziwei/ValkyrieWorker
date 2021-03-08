import ValkyrieWorker from './ValkyrieWorker'

(function() {
  if (unsafeWindow.ValkyrieWorker) return
  unsafeWindow.ValkyrieWorker = new ValkyrieWorker()
})()
