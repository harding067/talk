// 用户登录和注册的表单项验证（通用）

/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
    /**
     * 构造器
     * @param {String} txtId 文本框的Id
     * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误信息，若没有则无误
     */
    constructor(txtId, validatorFunc) {
        this.input = $(`#${txtId}`);
        this.err = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        // 失去焦点验证
        this.input.addEventListener("blur", () => { 
            this.validate();
         }, false);
        // 表单提交验证
    }

    /**
     * 验证，成功返回true，失败返回false
     */
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            // 有错误
            this.err.innerText = err;
            return false;
        } else {
            this.err.innerText = "";
            return true;
        }
    }

    /**
     * 对传入的所有验证其进行统一的验证，如果所有的验证均通过，则返回true，否则返回false
     * @param {FieldValidator[]} validators 
     */
    static async validate(...validators) {
        const proms = validators.map(v => v.validate());
        const result = await Promise.all(proms);
        
        return result.every(r => r);
    }
}