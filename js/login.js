const loginIdValidator = new FieldValidator("txtLoginId", (val) => {
    if (!val) {
        return "请填写账号";
    }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", (val) => {
    if(!val) {
        return "请填写密码";
    }
})

const form = $(".user-form");


form.addEventListener("submit", async (e) => {
    // 阻止表单默认行为
    e.preventDefault();

    const result = FieldValidator.validate(
        loginIdValidator,
        loginPwdValidator
    );

    // 验证未通过
    if (!result) return;

    const formData = new FormData(form); // 传入表单DOM，得到一个表单数据对象
    const data = Object.fromEntries(formData.entries());

    const resp = await API.login(data);
    if (resp.code === 0) {
        alert("登录成功，点击确定，跳转到首页");
        location.href = "./index.html";
    } else {
        loginIdValidator.err.innerText = "账号或密码错误";
        loginPwdValidator.input.value = "";
    }
}, false);