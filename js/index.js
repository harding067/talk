const doms = {
  aside: {
    nickname: $("#nickname"),
    loginId: $("#loginId"),
  },
  close: $(".close"),
  chatContainer: $(".chat-container"),
  txtMsg: $("#txtMsg"),
  msgContainer: $(".msg-container"),
};

// 验证是否有登录，如果没有登录，跳转到登录页，如果有登录，获取到登录的用户信息
(async () => {
  const resp = await API.profile();
  const user = resp.data;


  if (!user) {
    // 未登录状态
    alert("未登录或登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }

  // 设置用户信息
  const setUserInfo = () => {
    // 此处不能使用 innerHTML 有安全隐患，用户昵称输入 eg：<h1>Yeah!</h1> 会改变显示形式
    const { loginId, nickname } = user;
    doms.aside.loginId.innerText = loginId;
    doms.aside.nickname.innerText = nickname;
  };

  // 根据消息对象，将其添加到页面中
  /*
   content: "123"
   createdAt: 1719768832283
   from: "wangwu"
   to: null
   */
  const addChat = async (chatInfo) => {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      // 表示是人为发送的消息
      div.classList.add("me");
    }
    const img = $$$("img");
    img.classList.add("chat-avatar");
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.classList.add("chat-content");
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.classList.add("chat-date");
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);

    doms.chatContainer.appendChild(div);
  };

  /**
   * 格式化时间
   * @param {Number} timestamp 
   * @returns String
   */
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = (date.getHours()).toString().padStart(2, "0");
    const minutes = (date.getMinutes()).toString().padStart(2, "0");
    const seconds = (date.getSeconds()).toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 加载历史记录
  const loadHistory = async () => {
    const resp = await API.getHistory();
    const { data } = resp;
    for (const item of data) {
      addChat(item);
    }
    scrollBottom();
  }

  // 将聊天区域的滚动条，滚动到最后
  const scrollBottom = () => {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  // 发送消息
  const sendChat = async () => {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }

    // 首先响应用户的发送消息操作，提高用户体验
    addChat({
      content,
      createdAt: Date.now(),
      from: user.loginId,
      to: null
    });
    // 清空输入
    doms.txtMsg.value = "";

    scrollBottom();

    const resp = await API.sendChat(content);

    // 显示回复的内容
    addChat({
      from: null,
      to: user.loginId,
      // 展开剩余属性
      ...resp.data
    });

    scrollBottom();
  }

  // 以下代码，一定是登录状态
  setUserInfo();

  // 注销事件
  doms.close.addEventListener(
    "click",
    () => {
      API.loginOut();
      location.href = "./login.html";
    },
    false
  );

  // 加载历史消息
  loadHistory();

  // 发送消息事件
  doms.msgContainer.addEventListener("submit", (e) => { 
    // 阻止表单默认行为 
    e.preventDefault();
    // 发送消息
    sendChat();
   }, false);
})();
