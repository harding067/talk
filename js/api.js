
/**
 * 避免污染全局
 */
const API = (() => { 
    const BASE_URL = "https://study.duyiedu.com";
    const TOKEN_KEY = "token";

    // fetch 二次封装
    const requestCommon = (path, { headers, method, body }) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        headers.authorization = `Bearer ${token}`;
      }
      return fetch(BASE_URL + path, { headers, method, body });
    };

    // GET 请求
    const get = (path) => {
      return requestCommon(path, { headers: {} });
    };

    // POST 请求
    const post = (path, bodyObj) => {
      return requestCommon(path, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(bodyObj),
      });
    };

    /**
     * 用户注册
     * @param {*} userInfo
     */
    const reg = async (userInfo) => {
      const resp = await post("/api/user/reg", userInfo);
      return await resp.json();
    };

    /**
     * 用户登录
     * @param {*} loginInfo
     */
    const login = async (loginInfo) => {
      const resp = await post("/api/user/login", loginInfo);
      const result = await resp.json();
      if (result.code === 0) {
        // 登录成功

        // 将响应头中的token保存起来(localStorage)
        const token = resp.headers.get("authorization");
        localStorage.setItem(TOKEN_KEY, token);
      }
      return result;
    };

    /**
     * 当前帐号是否存在
     * @param {*} loginId
     */
    const exists = async (loginId) => {
      const resp = await get(`/api/user/exists?loginId=${loginId}`);
      return resp.json();
    };

    /**
     * 人物简介
     */
    const profile = async () => {
      const resp = await get("/api/user/profile");
      return resp.json();
    };

    /**
     * 发送内容
     * @param {*} content
     */
    const sendChat = async (content) => {
      const resp = await post("/api/chat", { content });
      return resp.json();
    };

    /**
     * 获取消息历史
     */
    const getHistory = async () => {
      const resp = await get("/api/chat/history");
      return resp.json();
    };

    /**
     * 退出登录
     */
    const loginOut = () => {
      localStorage.removeItem(TOKEN_KEY);
    };

    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut
    }
 })();