<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item
          ><a href="/ads">广告位</a></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-row>
    <el-row class="queryContainer">
      <el-form :inline="true" :model="pagination" class="queryForm" size="mini">
        <el-form-item label="">
          <el-input
            type="text"
            v-model="pagination.name"
            placeholder="广告关键字..."
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
        :data="adsList"
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

        <el-table-column prop="name" label="广告名称"></el-table-column>
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
    <el-dialog title="广告详情" :visible.sync="dialogVisible" width="200" @closed="closeDialog">
        <el-form
            ref="adsForm"
            :model="currentAds"
            label-width="80px"
            size="mini"
            :rules="rules"
            status-icon>
            <el-tabs v-model="activeName">
                <el-tab-pane label="基础属性" name="base">
                    <el-form-item label="广告名称" prop="name">
                        <el-input v-model="currentAds.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="save">保存</el-button>
                        <el-button @click="dialogVisible = false">取消</el-button>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="广告栏" prop='ads'>
                    <el-button-group>
                        <el-button type="success" icon="el-icon-plus" class="addAds" size="mini" @click="addAds"></el-button>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="save"></el-button>
                    </el-button-group>
                    <div class="adsList" v-for="(item,index) in currentAds.items" :key='index'>
                        <el-form-item label="图片" :prop="'items.' + index + '.photo'">
                            <el-upload
                                class="avatar-uploader"
                                :action="uploadURL"
                                :show-file-list="false"
                                :on-success="(res) => $set(item,'photo',res.url)"
                                :before-upload="beforeUpload">
                                <img v-if="item.photo" :src="item.photo" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="链接" :prop="'items.' + index + '.link'">
                            <el-input v-model="item.link"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-button type="danger" icon="el-icon-delete" @click="currentAds.items.splice(index,1)"></el-button>
                        </el-form-item>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { create, list, remove, getById, edit, deleteMany, upLoadUrl } from "@/api/ads.js";

export default {
  data() {
    return {
      activeName: 'base',
      dialogVisible: false,
      pagination: {
        total: 0,
        currentPage: 1,
        size: 10,
        name: ''
      },
      currentAds: {
          _id: null,
          name: '',
          items: []
      },
      rules: {
        name: [
            { required: true, message: '请输入广告名称', trigger: 'blur' },
        ],
        items: []
      },
      adsList: [],
      selectedIds: [],
      selectList: [],
      uploadURL: upLoadUrl
    };
  },
  methods: {
    save() {
      this.$refs.adsForm.validate(async (valid) => {
        if(valid) {
          let ret = null
          if(this.currentAds._id) {
              ret = await edit(this.currentAds)
          }else{
              ret = await create(this.currentAds)
          }
          let { data: { code, text } }= ret
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
        this.adsList = listData
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
            this.currentAds = data
            this.dialogVisible = true
        }else{
            this.$message({
                type: 'error',
                message: '获取失败'
            })
        }
    },
    removeSelected() {
      this.$confirm('此操作将批量删除所选广告，是否继续？','警告',{
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
    beforeUpload() {

    },
    closeDialog() {
        console.log('close')
        this.activeName = 'base'
    //   this.$refs.adsForm.resetFields()
        this.currentAds.name = ''
        this.currentAds._id = null
        this.currentAds.items = []
    },
    addAds() {
        this.currentAds.items.push({})
    }
  },
  created() {
    this.list();
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
    border: 1px solid #ccc;
}
 .adsList{
    display: inline-block;
    width: 27%;
    margin-right: 5px;
    padding: 20px;
    border-left: 1px dashed #ccc;
    border: 1px dashed #ccc;
    border-radius: 4px;
  }
  .addAds{
    margin-bottom: 30px;
    display: block;
  }

</style>