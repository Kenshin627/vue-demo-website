<template>
    <div class="login-container">
        <el-card class="login-form">
            <div slot="header" class="login-header">后台管理</div>
            <div>
                <el-form ref="loginForm" :model="loginModel" size="small" :rules="rules" status-icon="">
                    <el-form-item label="" prop="username">
                        <el-input prefix-icon="el-icon-user" v-model="loginModel.username"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="password">
                        <el-input show-password prefix-icon="el-icon-lock" v-model="loginModel.password"></el-input>
                    </el-form-item>
                    <el-form-item size="small">
                        <el-button class="login-btn" type="success" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>    
</template>
<script>
import { login } from '@/api/login'
export default {
    data() {
        return {
            loginModel: {
                username: '',
                password: ''
            },
            rules:{
                username: [
                    { required: true, message:'请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message:'请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        async login() {
            try {
                const { data: { code, data } } = await login(this.loginModel)
                if(code === 1){
                    this.$store.commit('login',data)
                    localStorage.setItem('token',data.token)
                    this.$router.push('/')
                }
            } catch(err) {
                console.log(err)
            }
        }
    }
}
</script>
<style scoped>
    .login-container{
        height: 100vh;
        background: rgb(241, 241, 241);
        position: relative;
    }
    .login-header{
        color: #7c828e; 
        font-size: 20px;
        word-spacing: revert;
        font-family: '微软雅黑';
        font-weight: 600;
        font-style: italic;
    }
    .login-form{
        width: 25%;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: 0 auto;
        transform: translate(-50%,-70%);
    }
    .login-btn{
        background: #465c84;
        border: #465c84;
    }
</style>