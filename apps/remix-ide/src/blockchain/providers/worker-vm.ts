import { Provider } from '@remix-project/remix-simulator'
import { bigIntToHex } from '@ethereumjs/util'

let provider: Provider = null
self.onmessage = (e: MessageEvent) => {
  const data = e.data
  switch (data.cmd) {
    case 'init': 
    {
      provider = new Provider({ fork: data.fork })
      if (provider) provider.init()
      break
    }
    case 'sendAsync':
    {
      if (provider) {
        provider.sendAsync(data.query, (error, result) => {
          result = JSON.parse(JSON.stringify(result, (key, value) => {
            if (typeof value === 'bigint') return bigIntToHex(value)
            return value
          }))
          self.postMessage({
              cmd: 'sendAsyncResult',
              error,
              result,
              stamp: data.stamp
            })
        })
      } else {
        self.postMessage({
          cmd: 'sendAsyncResult',
          error: 'Provider not instanciated',
          result: null,
          stamp: data.stamp
        })
      }
      
      break
    }      
  }
}
