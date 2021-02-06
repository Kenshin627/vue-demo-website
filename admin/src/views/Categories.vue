<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item
          ><a href="/categories">分类管理</a></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-row>
    <el-row class="queryContainer">
      <el-form :inline="true" :model="pagination" class="queryForm" size="mini">
        <el-form-item label="">
          <el-input
            type="text"
            v-model="pagination.name"
            placeholder="分类关键字..."
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
        :data="categoryList"
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
        <el-table-column prop="parent.name" label="上级分类" width="180">
          <template slot-scope="scope">
            {{ scope.row.parent? scope.row.parent.name: 'Root' }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称"> </el-table-column>
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
    <el-dialog title="分类详情" :visible.sync="dialogVisible" width="200" @close="closeDialog">
      <el-form
        ref="form"
        :model="currentCategory"
        label-width="80px"
        size="mini"
        :rules="rules"
        status-icon
      >
        <el-form-item label="父级分类" prop="parent">
            <el-select size="mini" v-model="currentCategory.parent" placeholder="根分类">
                <el-option :label="item.name" :value="item._id" v-for="item in selectList" :key="item._id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="currentCategory.name"></el-input>
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
import { create, list, remove, getById, edit, deleteMany,listAllRoot } from "@/api/categories.js";

export default {
  data() {
    return {
      dialogVisible: false,
      pagination: {
        total: 0,
        currentPage: 1,
        size: 10,
        name: ''
      },
      currentCategory: {
          name: '',
          parent: null,
          _id: null
      },
      rules: {
        name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      categoryList: [],
      selectedIds: [],
      selectList: []
    };
  },
  methods: {
      save() {
      this.$refs.form.validate(async (valid) => {
        if(valid) {
          let ret = null
          if(this.currentCategory._id) {
              ret = await edit(this.currentCategory)
          }else{
              ret = await create(this.currentCategory)
          }
          let { data: { code, text } }= ret
          if (code === 1) {
            this.dialogVisible = false;
            this.list();
            this.listRoot();
            // this.pagination.currentPage = Math.floor(this.pagination.total / this.pagination.size)
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
        this.categoryList = listData
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
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
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
          this.listRoot();
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
        if(code === 1) {
            this.currentCategory = data
            this.dialogVisible = true
        }else{
            this.$message({
                type: 'error',
                message: '获取失败'
            })
        }
    },
    removeSelected() {
      this.$confirm('此操作将批量删除，是否继续？','警告',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async () => {
        const { data: { code, text } } =  await deleteMany({ ids: this.selectedIds})
        if (code === 1) {
          this.list();
          this.listRoot();
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
    async listRoot() {
        let { data: { listData, code, text } } = await listAllRoot()
      if (code === 1) {
        this.selectList = listData
        
      } else {
        this.$message({
          type: "error",
          message: text,
        });
      }
    },
    closeDialog() {
      this.currentCategory.name = ''
      this.currentCategory.parent = null
      this.currentCategory._id = null
    }
  },
  created() {
    this.list();
    this.listRoot();
  },
};
</script>
<style scoped>
.queryContainer {
  box-sizing: border-box;
  padding: 15px 15px 15px 1px;
  border-radius: 4px;
  margin-top: 30px;
  margin-bottom: 30px;
  box-shadow: 1px 1px 3px 0 #e6e6e6;
  height: 70px;
  
}
.queryForm {
  color: rgb(80, 80, 80);
  padding-top: 10px;
}
.table {
  margin-bottom: 30px;
}
>>> .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #313743;
}
>>> .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #313743;
}

</style>