<template>
    <div>
        <el-row>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/categories">分类管理</a></el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
        <el-row class="queryContainer">
            <el-form :inline="true" :model="query" class="queryForm" size='mini'>
                <el-form-item label="">
                    <el-input type="text" v-model="query.name" placeholder="分类关键字...">
                        <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" icon="el-icon-plus" @click="create">创建</el-button>
                </el-form-item>
                <el-form-item v-show="selectedIds.length > 0">
                    <el-button icon="el-icon-delete"  @click="create">删除</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row class="table">
            <el-table
                :data="categoryList"
                border
                size='mini'
                :header-cell-style="{
                    'background-color':'rgb(80, 80, 80)',
                    'color': '#fff'
                }"
                style="width: 100%">
                <el-table-column
                prop="date"
                label="日期"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
                label="姓名"
                width="180">
                </el-table-column>
                <el-table-column
                prop="address"
                label="地址">
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-pagination
                background
                small
                layout="prev, pager, next"
                :total="1000">
            </el-pagination>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            query: {
                name: ""
            },
            selectedIds: []
        }
    }
}
</script>
<style scoped>
    .queryContainer{
        box-sizing: border-box;
        border: 1px solid rgba(231, 231, 231,0.5);
        padding:15px 15px;
        border-radius: 4px;
        margin-top: 30px;
        margin-bottom: 30px;
        box-shadow: 1px 1px 3px 0 #e6e6e6;
        height: 70px;
    }
    .queryForm{
        color:rgb(80, 80, 80)
    }
    .table{
        margin-bottom: 30px;
    }
</style>