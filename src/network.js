export default class Network {
  static request(method, url, data, auth) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      let urlString = url
      if(method == "GET") {
        const param = Object.keys(data).filter((e) => data[e] != null)
        .map((e) => {
          const value = data[e]
          return `${e}=${encodeURIComponent(value)}`
        }).join("&")
        urlString += "?" + param
      }

      xhr.open(method, urlString, true)
      xhr.responseType = "json"
      if(auth) xhr.setRequestHeader("Authorization", auth)

      xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE) {
          if(xhr.status == 200 || xhr.status == 204) {
            resolve(xhr.response)
          } else {
            console.error(xhr.status)
            reject(xhr.response)
          }
        }
      }
      if(method == "GET") {
        xhr.send()
      } else {
        if(data) {
          xhr.setRequestHeader("Content-Type", "application/json")
          xhr.send(JSON.stringify(data))
        } else {
          xhr.send()
        }
      }
    })
  }
}
