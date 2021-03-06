<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item
          ><a href="/articles">文章管理</a></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-row>
    <el-row class="queryContainer">
      <el-form :inline="true" :model="pagination" class="queryForm" size="mini">
        <el-form-item label="">
          <el-input
            type="text"
            v-model="pagination.name"
            placeholder="文章关键字..."
          >
            <el-button
              type="primary"
              slot="append"
              icon="el-icon-search"
              @click="list"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            icon="el-icon-plus"
            @click="dialogVisible = true"
            >创建</el-button
          >
        </el-form-item>
        <el-form-item v-show="selectedIds.length > 0">
          <el-button icon="el-icon-delete" @click="removeSelected" type="danger">删除</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="table">
      <el-table
        :data="articleList"
        border
        ref="table"
        size="mini"
        :header-cell-style="{
          'background-color': 'rgb(80, 80, 80)',
          'color': '#fff',
        }"
        style="width: 100%"
        @selection-change="selectChange">
        <el-table-column width="50" type="selection"> </el-table-column>
        <el-table-column type="index" width="100" prop="prop" label="编号">
        </el-table-column>

        <el-table-column prop="name" label="标题"></el-table-column>
        <el-table-column label="操作" align="center" width="145">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="openEdit(scope.row._id)"
              >
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="remove(scope.row._id)"
              >
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        background
        :page-size.sync="pagination.size"
        :total="pagination.total"
        :current-page.sync="pagination.currentPage"
        @current-change="list"
        layout="prev, pager, next"
      >
      </el-pagination>
    </el-row>
    <el-dialog :title="dialogTitle + '文章'" :visible.sync="dialogVisible" width="50%" @close="closeDialog">
      <el-form
        ref="articleForm"
        :model="currentModel"
        label-width="80px"
        size="mini"
        :rules="rules"
        status-icon>
            <el-form-item label="标题" prop="name">
                <el-input v-model="currentModel.name"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="categories">
                <el-select v-model="currentModel.categories" multiple class="select100">
                    <el-option :label="cat.name" :value="cat._id" v-for="cat in categories" :key="cat._id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <wangeditor 
                :minHeight="200" 
                :uploadUrl="uploadURL" 
                :uploadImgHeaders="uploadHeader"
                :fail="uploadFail"
                :error="uploadError"
                v-model="currentModel.content"></wangeditor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { create, list, remove, getById, edit, deleteMany, fetchCategories, uploadURL } from "@/api/articles.js";
import Wangeditor from '@/components/Wangeditor'
export default {
  data() {
    return {
      uploadURL: uploadURL,
      dialogVisible: false,
      pagination: {
        total: 0,
        currentPage: 1,
        size: 10,
        name: ''
      },
      currentModel: {
          name: '',
          content: '',
          _id: null,
          categories: []
      },
      rules: {
        name: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
        ],
        categories: [
            { 
              validator: (rule, value, callback) => {
                  if(!value || value.length === 0){
                    return callback(new Error('请至少选择一个分类'))
                  }
                  callback()
              }, 
              trigger: 'change' 
              }
        ],
        content: [
            { required: true, message:'请输入文章内容', trigger: 'blur' }
        ]
      },
      categories: [],
      articleList: [],
      selectedIds: [],
      selectList: []
    };
  },
  components: {
      Wangeditor
  },
  methods: {
      save() {
      this.$refs.articleForm.validate(async (valid) => {
        if(valid) {
          let ret = null
          if(this.currentModel._id) {
              ret = await edit(this.currentModel)
          }else{
              ret = await create(this.currentModel)
          }
          let { data: { code, text } }= ret
          console.log(code,text)
          if (code === 1) {
            this.dialogVisible = false;
            this.list();
            this.$message({
              type: "success",
              message: text,
            });
          } else {
            this.$message({
              type: "error",
              message: text,
            });
          }
        }else{
          return false
        }
      })
    },
    async list() {
      let { data: { count, listData, code, text } } = await list(this.pagination)
      if (code === 1) {
        this.articleList = listData
        this.pagination.total = count
        if(listData.length === 0 && this.pagination.currentPage > 1) {
            this.pagination.currentPage -= 1
            this.list()
        }
      } else {
        this.$message({
          type: "error",
          message: text,
        });
      }
    },
    remove(id) {
      this.$confirm("此操作将删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(async () => {
        let {
          data: { code, text },
        } = await remove(id);
        if (code === 1) {
          this.list();
          this.$message({
            type: "success",
            message: `删除成功`,
          });
        } else {
          this.$message({
            type: "error",
            message: text,
          });
        }
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "取消删除",
        });
      });
    },
    async openEdit(id) {
        let { data: { code, data } } = await getById(id)
        console.log(code,data)
        if(code === 1) {
            this.currentModel = data
            this.dialogVisible = true
        }else{
            this.$message({
                type: 'error',
                message: '获取失败'
            })
        }
    },
    removeSelected() {
      this.$confirm('此操作将批量删除所选文章，是否继续？','警告',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async () => {
        const { data: { code, text } } =  await deleteMany({ ids: this.selectedIds})
        if (code === 1) {
          this.list();
          this.$message({
            type: "success",
            message: `删除成功`,
          });
        } else {
          this.$message({
            type: "error",
            message: text,
          });
        }
      })
      .catch( () => {
        this.$message({
          type:'info',
          message: '取消删除'
        })
      })
    },
    selectChange(list) {
        this.selectedIds = list.map( item =>{
            return item._id
        })
    },
    closeDialog() {
      this.currentModel.name = ''
      this.currentModel._id = null
      this.currentModel.categories = []
      this.currentModel.content = ''
      this.$refs.articleForm.clearValidate()
    },
    async fetchCategories() {
        let { data: { code, text, listData } }  = await fetchCategories('news')
        if(code === 1) {
            this.categories = listData
        }else{
            this.$message({
                type: 'error',
                message: text
            })
        }
    },
    uploadFail(xhr, editor, resData) {
        console.log(xhr, editor, resData)
    },
    uploadError(xhr, editor, resData) {
        console.log(xhr, editor, resData)
    }
  },
  created() {
    this.list();
    this.fetchCategories()
  },
};
</script>
<style scoped>

</style>