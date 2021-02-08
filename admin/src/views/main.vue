<template>
    <el-container class="container">
        <el-header>
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                <img :src="user.avator" class="user-avatar">
                <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided @click.native="loginOut">
                    <span style="display:block;">登出</span>
                </el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-aside width="11%">
                <el-menu
                unique-opened
                router
                :default-active="this.$route.path"
                class=""
                background-color="#313743"
                text-color="#fff"
                active-text-color="#ffd04b">
                <el-menu-item index="/" class="index">
                    <span slot="title">首页</span>
                </el-menu-item>
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">内容管理</span>
                     </template>
                     <el-menu-item index="/categories">分类管理</el-menu-item>
                     <el-menu-item index="/items">物品管理</el-menu-item>
                     <el-menu-item index="/heros">英雄管理</el-menu-item>
                     <el-menu-item index="/articles">文章管理</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-magic-stick"></i>
                        <span slot="title">广告位</span>
                    </template>
                    <el-menu-item index="/ads">广告位</el-menu-item>
                </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-user"></i>
                            <span slot="title">系统设置</span>
                        </template>
                        <el-menu-item index="/adminUsers">管理员</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters([
            'user'
        ])
    },
    methods: {
        loginOut() {
            this.$store.commit('loginOut')
            this.$router.push('/login')
        }
    }
    
}
</script>
<style lang="css">
    html,body{
        margin: 0;
        padding: 0;
    }
    .container{
        height: 100vh;
    }
    .el-header{
        background: #313743;
        border-bottom:1px solid rgb(73, 73, 73);
    }
    .el-aside{
        background: #313743;
    }
</style>
<style lang="css" scoped>
    >>> .el-menu{
        border-right: none;
    }
    .index {
        border-bottom: 1px solid rgb(73,73,73);
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
    }
    .avatar-container {
      margin-right: 30px;
    }
    .avatar-wrapper {
        margin-top: 5px;
        position: relative;
    }
     .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
    }
    .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
    }
</style>
