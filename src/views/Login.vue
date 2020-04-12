<template>
    <div>
        <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off"
                          placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-checkbox label="记住密码" name="type" v-model="checked"></el-checkbox>
            <el-button class="loginBtn" type="primary" style="width: 100%;" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    username: "admin",
                    password: "123"
                },
                checked: true,
                rules: {
                    username: [{required: true, message: "请输入用户名", trigger: "blur"}],
                    password: [{required: true, message: "请输入密码", trigger: "blur"}]
                }
            }
        },
        methods: {
            submitLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        /* 登录的请求 */
                        this.postKeyValueRequest('/permission/doLogin', this.loginForm).then(resp => {
                            if (resp) {
                                window.sessionStorage.setItem("user", JSON.stringify(resp.data));
                                setTimeout(() => {
                                    this.$Notice.success({
                                        title: `欢迎登录：${resp.data.name}`,
                                        desc: 'The desc will hide when you set render.',
                                        render: h => {
                                            return h('span', [
                                                `北京时间：${dateFormat("YYYY-mm-dd HH:MM", new Date())}`,
                                            ])
                                        }
                                    });
                                    /* 跳转页面 */
                                    this.$router.replace("/home");
                                }, 1000);
                            }
                        });
                    } else {
                        this.$Message.error('请填写所有的信息进行登录！');
                        return false;
                    }
                });
            }
        }
    }

    function dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
            ;
        }
        ;
        return fmt;
    }
</script>

<style scoped>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .loginBtn {
        margin-top: 15px;
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }
</style>
