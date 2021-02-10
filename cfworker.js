addEventListener('fetch', event => {
    event.respondWith(postWeChatUrl(event.request))
})

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}


async function postWeChatUrl(request) {
  // 获取token链接，自行修改企业id和秘钥
  const url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=*********&corpsecret=*********************"
  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  }
  // 发出get请求获得token
  const response = await fetch(url, init)
  const results = await gatherResponse(response)
  var jsonObj = JSON.parse(results)
  // 从cf workers截取发送内容，默认/后面全为发送内容，可自行添加参数之类的，切记把替换链接换成非发送内容部分
  var text = decodeURI(request.url.replace("https://lingering-sound-f816.qyu0615.workers.dev/", ""))
  var key = jsonObj["access_token"]
  var wechat_work_url = "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" + key;
  var template = 
 {
  "touser": "",
  "toparty": "1",
  "totag": "2",
  "msgtype": "text",
  // 应用id，记得修改
  "agentid": *****,
  "text": {
    // 发送文本内容（网页版总是带个favicon.ico，把他替换成空白）
    "content": text.replace("favicon.ico", "")
  },
  "safe": 0,
  "enable_id_trans": 0,
  "enable_duplicate_check": 0,
  "duplicate_check_interval": 1800
}

  const init2 = {
    body: JSON.stringify(template),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // 发送post请求
  const response1 = await fetch(wechat_work_url, init2)  
  return  response1
}

