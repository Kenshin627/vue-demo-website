<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item
          ><a href="/heros">英雄管理</a></el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-row>
    <el-row class="queryContainer">
      <el-form :inline="true" :model="pagination" class="queryForm" size="mini">
        <el-form-item label="">
          <el-input
            type="text"
            v-model="pagination.name"
            placeholder="英雄关键字..."
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
        :data="heroList"
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
        <el-table-column prop="name" label="英雄名称"></el-table-column>
        <el-table-column prop="description" label="英雄描述" width="300"></el-table-column>
        <el-table-column prop="categories" label="英雄分类" width="200">
            <template slot-scope="scope">
                <el-tag class="heroCat" size="small " hit effect="plain" type="info" v-for="cat in scope.row.categories" :key="cat._id">{{ cat.name }}</el-tag>
            </template>
        </el-table-column>
         <el-table-column prop="avator" label="头像" width="120" align="center">
             <template slot-scope="scope">
                 <img :src="scope.row.avator" alt="" class="avatorImg">
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
    <el-dialog :title="currentHero.name?currentHero.name : '未命名'" :visible.sync="dialogVisible" width="200" @close="dialogClose">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础属性" name="base">
          <el-form
            ref="form"
            :model="currentHero"
            label-width="80px"
            size="mini"
            :rules="rules"
            status-icon
          >
            <el-form-item label="英雄名称" prop="name">
              <el-input v-model="currentHero.name"></el-input>
            </el-form-item>
            <el-form-item label="英雄描述" prop="description">
                <el-input v-model="currentHero.description"></el-input>
            </el-form-item>
            <el-form-item label="头像">
                <el-upload
                class="avatar-uploader"
                :action="uploadURL"
                :show-file-list="false"
                :on-preview="preview"
                :on-remove="removeAvator"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload">
                    <img v-if="currentHero.avator" :src="currentHero.avator" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-dialog :visible.sync="previewDialog">
                    <img width="100%" :src="currentHero.url" alt="">
                </el-dialog>
            </el-form-item> 
            <el-form-item label="英雄分类" prop="categories">
                <el-select v-model="currentHero.categories" multiple :multiple-limit="2">
                    <el-option :label="cat.name" :value="cat._id" v-for="cat in heroCategories" :key="cat._id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="顺风出装">
              <el-select v-model="currentHero.item1" multiple :multiple-limit="6">
                <el-option
                  v-for="item in heroItems"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="逆风出装">
              <el-select v-model="currentHero.item2" multiple :multiple-limit="6">
                <el-option
                  v-for="item in heroItems"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上手难度">
                <el-rate v-model="currentHero.scores.difficult" :colors="colors" :max="5" show-text :texts="text1"></el-rate>
            </el-form-item>
            <el-form-item label="技能强度">
                <el-rate v-model="currentHero.scores.skill" :colors="colors" :max="5" show-text :texts="text2"></el-rate>
            </el-form-item>
            <el-form-item label="攻击强度">
                <el-rate v-model="currentHero.scores.attack" :colors="colors" :max='5' show-text :texts="text2"></el-rate>
            </el-form-item>
            <el-form-item label="生存系数">
                <el-rate v-model="currentHero.scores.survive" :colors="colors" :max="5" show-text :texts="text2"></el-rate>
            </el-form-item>
            <el-form-item label="使用技巧">
              <el-input type="textarea" :rows="1" v-model="currentHero.usageTips"></el-input>
            </el-form-item>
            <el-form-item label="对线技巧">
            <el-input type="textarea" :rows="1" v-model="currentHero.battleTips"></el-input>
            </el-form-item>
            <el-form-item label="团战技巧">
            <el-input type="textarea" :rows="1" v-model="currentHero.teamTips"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">保存</el-button>
              <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="相生相克" name="relative">
            <el-form
            ref="form"
            :model="currentHero"
            label-width="50px"
            size="mini"
            :rules="rules"
            status-icon
            label-position="left">
            <el-row :gutter="100">
              <el-col :span="12">
                <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="addPartner" class="addMates">最佳伙伴</el-button>
                <div v-for="(partner,index) in currentHero.partners" :key="partner._id" class="form-item-loop">
                  <el-form-item label="英雄" size="mini">
                    <el-select v-model="partner._id">
                      <el-option
                        v-for="hero in heros"
                        :key="hero._id"
                        :label="hero.name"
                        :value="hero._id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="描述">
                    <el-input v-model="partner.description" style="width: 60%"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="danger" icon="el-icon-delete" @click="currentHero.partners.splice(index,1)"></el-button>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <el-button type="danger" icon="el-icon-circle-plus" size="mini" @click="addEnemy" class="addMates">天生克星</el-button>
                <div v-for="(enemy,index) in currentHero.enemies" :key="enemy._id" class="form-item-loop">
                  <el-form-item label="英雄">
                    <el-select v-model="enemy._id">
                      <el-option
                        v-for="hero in heros"
                        :key="hero._id"
                        :label="hero.name"
                        :value="hero._id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="描述">
                    <el-input v-model="enemy.description"  style="width: 60%"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="danger" icon='el-icon-delete' @click="currentHero.enemies.splice(index,1)"></el-button>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
              </el-form-item>
            </el-row>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="技能管理" name="skills">
          <el-form
            ref="form"
            :model="currentHero"
            label-width="40px"
            size="mini"
            :rules="rules"
            status-icon
            label-position="left"
          >
            <el-button-group class="addSkills">
              <el-button type="success" icon="el-icon-plus" size="mini" @click="addSkills" ></el-button>
              <el-button type="primary" icon="el-icon-edit" size='mini' @click='save'>  </el-button>
            </el-button-group>
            <div
            v-for="(skill,index) in currentHero.skills" :key="index" class="skillList"
            >
              <el-form-item label="名称">
                <el-input v-model="skill.name"></el-input>
              </el-form-item>
              <el-form-item label="图标">
                 <el-upload
                    class="avatar-uploader"
                    :action="uploadURL"
                    :show-file-list="false"
                    :on-preview="preview"
                    :on-remove="removeAvator"
                    :on-success="(res) => $set(skill,'photo',res.url)"
                    :before-upload="beforeUpload">
                    <img v-if="skill.photo" :src="skill.photo" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="skill.description"></el-input>
              </el-form-item>
              <el-form-item label="贴士">
                <el-input v-model="skill.tips"></el-input>
              </el-form-item>
              <el-form-item label="冷却">
                <el-input v-model="skill.coldDown" type="number">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
              <el-form-item label="消耗">
                <el-input v-model="skill.consume">
                  <template slot="append">mana</template>
                </el-input>
              </el-form-item>
              <el-form-item label="大招">
                <el-switch v-model="skill.isUlt" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" icon="el-icon-delete" @click="currentHero.skills.splice(index,1)"></el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { create, list, remove, getById, edit, deleteMany, uploadURL, fetchHeroCategories, fetchHeroItems, fetchHeros } from "@/api/heros.js";

export default {
  data() {
    return {
      activeName: 'base',
      dialogVisible: false,
      previewDialog: false,
      pagination: {
        total: 0,
        currentPage: 1,
        size: 10,
        name: ''
      },
      currentHero: {
          name: '',
          avator: '',
          description: '',
          categories: [],
          scores: {
              difficult: 1,
              skill: 1,
              attack: 1,
              survive: 1
          },
          usageTips: '',
          battleTips: '',
          teamTips: '',
          item1: [],
          item2: [],
          partners: [],
          enemies: [],
          skills: []
      },
      rules: {
        name: [
            { required: true, message: '请输入英雄名称', trigger: 'blur' },
        ],
        description: [
            { required: true, message: '请输入英雄描述',trigger: 'blur' }
        ],
        categories: [
            { required: true, message: '请选择英雄分类',trigger: 'blur' } 
        ]
      },
      heroList: [],
      selectedIds: [],
      selectList: [],
      heroCategories: [],
      heroItems: [],
      heros: [],
      text1: ['简单','一般','稍难','苦难','折磨'],
      text2: ['弱','一般','稍强','强','非常强'],
      colors: ['#b7b7b7', '#7691c5', '#1f4ba0'],
      uploadURL: uploadURL
    };
  },
  methods: {
      save() {
      this.$refs.form.validate(async (valid) => {
        if(valid) {
          let ret = null
          if(this.currentHero._id) {
              ret = await edit(this.currentHero)
          }else{
              ret = await create(this.currentHero)
          }
          let { data: { code, text } }= ret
          this.currentHero = {}
          if (code === 1) {
            this.dialogVisible = false;
            this.list();
            this.currentHero.name = ''
            this.currentHero.url = ''
            this.currentHero.categories = [],
            this.currentHero.description = '',
            this.currentHero.scores = {
                difficult: 1,
                skill: 1,
                attack: 1,
                survive: 1
            }
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
        this.heroList = listData
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
      this.$confirm("此操作将删除该英雄, 是否继续?", "提示", {
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
            this.currentHero = data
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
    uploadSuccess(res) {
        this.currentHero.avator = res.url
    },
    beforeUpload() {

    },
    removeAvator() {
        this.currentHero.url = ''
    },
    preview() {
        this.previewDialog = true
    },
    dialogClose() {
        this.currentHero.name = ''
        this.currentHero.avator = ''
        this.currentHero._id = null
        this.currentHero.partners = []
        this.currentHero.enemies = []
        this.currentHero.skills = []
        this.activeName = 'base'
        this.currentHero.description = ''
        this.currentHero.categories = []
        this.currentHero.item1 = []
        this.currentHero.item2 = []
    },
    async fetchHeroCategories() {
        let { data: { code, text, listData } } = await fetchHeroCategories('hero')
        if(code === 1) {
            this.heroCategories = listData
        }else{
            this.$message({
                type:'error',
                text: text
            })
        }
    },
    async fetchHeroItems() {
       let { data: { code, text, listData } } = await fetchHeroItems()
        if(code === 1) {
            this.heroItems = listData
        }else{
            this.$message({
                type:'error',
                text: text
            })
        }
    },
    async fetchHeros() {
      let { data: { code, text, listData } } = await fetchHeros()
      if(code === 1) {
          this.heros = listData
      }else{
          this.$message({
              type:'error',
              text: text
          })
      }
    },
    addPartner() {
      if(this.currentHero.partners.length >= 3) {
        this.$message({
          type: 'warning',
          message: '最大允许添加3个伙伴'
        })
      }else{
        this.currentHero.partners.push({

      })
      }
    },
    addEnemy() {
      if(this.currentHero.enemies.length >= 3) {
        this.$message({
          type: 'warning',
          message: '最大允许添加3个敌人'
        })
      }else{
        this.currentHero.enemies.push({})
      }
    },
    addSkills() {
      if(this.currentHero.skills.length >= 4){
        this.$message({
          type: 'info',
          message: '每个英雄最多添加四个技能'
        })
      }else{
        this.currentHero.skills.push({})
      }
    },
    uploadSkillPhoto(skill,res) {
      console.log(skill,res)
    }
  },
  created() {
    this.list()
    this.fetchHeroCategories()
    this.fetchHeroItems()
    this.fetchHeros()
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
.avatar-uploader {
    border: 1px dashed #313743;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 50px;
    height: 50px;
  }
  .avatar-uploader:hover {
    border-color: #d9d9d9;
  }
  .avatar-uploader-icon {
    font-size: 14px;
    color: #313743;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
  .avatorImg{
      width: 25px;
      height: 25px;
      border: 1px solid #ccc;
  }
  .heroCat{
      margin-right: 10px;
  }
  .addMates{
    margin-bottom: 10px;
    margin-left: 0;
  }
  .form-item-loop{
    border-bottom: 1px dashed rgba(119, 118, 118, 0.3);
    padding: 15px 5px 5px 0;
    margin: 5px auto;
  }
  .skillList{
    display: inline-block;
    width: 19%;
    margin-right: 5px;
    padding: 20px;
    border-left: 1px dashed #ccc;
    border: 1px dashed #ccc;
    border-radius: 4px;
  }
  .addSkills{
    margin-bottom: 30px;
    display: block;
  }
  .el-rate{
    margin-top: 0.36rem;
  }
</style>