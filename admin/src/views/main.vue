<template>
    <el-container class="container">
        <el-header></el-header>
        <el-container>
            <el-aside width="11%">
                <el-menu
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
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    
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
</style>
