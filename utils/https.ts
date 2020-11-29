const https = require('https')

export async function postJson(hostname: string, path: string, accessToken: string, jsonParams: Object): Promise<Object> {
  const requestBody = JSON.stringify(jsonParams)

  return httpsRequest(
    hostname,
    path,
    {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(requestBody),
      'Authorization': 'Bearer ' + accessToken
    },
    'POST',
    requestBody
  )
}

export function httpsRequest(hostname: string, path: string, headers: Object, method: string, requestBody: string): Promise<Object> {
  const opts = {
    hostname: hostname,
    path: path,
    headers: headers,
    method: method,
  }

  return new Promise((resolve, reject) => {
    const req = https.request(opts, (res: any) => {
      // res.setEncoding('utf8')
      res.on('data', (responseBody: Object) => {
        resolve(responseBody)
      })
    }).on('error', (error: Object) => {
      reject(error)
    })

    req.write(requestBody)
    req.end()
  })
}
