<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item
          ><a href="/items">物品管理</a></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-row>
    <el-row class="queryContainer">
      <el-form :inline="true" :model="pagination" class="queryForm" size="mini">
        <el-form-item label="">
          <el-input
            type="text"
            v-model="pagination.name"
            placeholder="物品关键字..."
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
        :data="itemList"
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

        <el-table-column prop="name" label="物品名称"></el-table-column>
        <el-table-column prop="image" label="图片" width="120">
            <template slot-scope="scope">
                <img :src="scope.row.image" alt="" class="rowImage">
            </template>
        </el-table-column>
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
    <el-dialog title="物品详情" :visible.sync="dialogVisible" width="200">
      <el-form
        ref="form"
        :model="currentItem"
        label-width="80px"
        size="mini"
        :rules="rules"
        status-icon>
            <el-form-item label="物品名称" prop="name">
                <el-input v-model="currentItem.name"></el-input>
            </el-form-item>
            <el-form-item label="图片">
                <el-upload
                    class="avatar-uploader"
                    :action="uploadURL"
                    :show-file-list="false"
                    :on-success="uploadSuccess"
                    :before-upload="beforeUpload">
                    <img v-if="currentItem.image" :src="currentItem.image" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
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
import { create, list, remove, getById, edit, deleteMany,listAllRoot, upLoadUrl } from "@/api/items.js";

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
      currentItem: {
          name: ''
      },
      rules: {
        name: [
            { required: true, message: '请输入物品名称', trigger: 'blur' },
        ],
      },
      itemList: [],
      selectedIds: [],
      selectList: [],
      uploadURL: upLoadUrl
    };
  },
  methods: {
      save() {
      this.$refs.form.validate(async (valid) => {
        if(valid) {
          let ret = null
          if(this.currentItem._id) {
              ret = await edit(this.currentItem)
          }else{
              ret = await create(this.currentItem)
          }
          let { data: { code, text } }= ret
          this.currentItem = {}
          console.log(code,text)
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
        this.itemList = listData
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
      this.$confirm("此操作将删除该物品, 是否继续?", "提示", {
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
        console.log(code,data)
        if(code === 1) {
            this.currentItem = data
            this.dialogVisible = true
        }else{
            this.$message({
                type: 'error',
                message: '获取失败'
            })
        }
    },
    removeSelected() {
      this.$confirm('此操作将批量删除所选物品，是否继续？','警告',{
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
    uploadSuccess(res) {
        console.log(res)
        this.$set(this.currentItem,'image',res.url)
    },
    beforeUpload() {

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
.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
}
.avatar-uploader:hover {
    border-color: #313743;
}
.avatar-uploader-icon {
    font-size: 14px;
    color: #313743;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;

}
.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
>>> .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #313743;
}
>>> .el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #313743;
}
.rowImage{
    width: 45px;
    height: 45px;
}

</style>