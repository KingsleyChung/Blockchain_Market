<template>
  <div class='container'>
    <el-upload
      ref="upload"
      class="avatar-uploader"
      action="/api/upload/image"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :before-upload="beforeImageUpload"
      :on-change='handleImageChange'
      :auto-upload="false">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <form class="goods-info">
      <div class="input-with-label">
        <div class='label'>商品标题:</div>
        <el-input class='input' v-model="title" />
      </div>
      <div class="input-with-label">
        <div class='label'>商品价格:</div>
        <el-input-number v-model="price" :precision="2" ></el-input-number>
      </div>
      <div class="input-with-label">
        <div class='label'>商品库存:</div>
        <el-input-number v-model="stock" :min="1"></el-input-number>
      </div>
      <div class="input-with-label">
        <div class='label'>商品介绍:</div>
        <el-input
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="description">
        </el-input>
      </div>
      <el-button type="primary" round @click="confirmSubmit">提交</el-button>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      price: null,
      stock: null,
      description: '',
      imageUrl: ''
    }
  },
  methods: {
    async handleImageSuccess (res, file) {
      if (res.code !== 0) return
      let uploadRes = await this.$axios.post('/api/addGoods', {
        goods: {
          title: this.title,
          price: this.price,
          stock: this.stock,
          description: this.description,
          filename: res.filename
        }
      })
      if (uploadRes.data.code === 0) {
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: res.data.code === 2 ? res.data.msg : '系统错误'
        })
      }
    },
    handleImageChange (file) {
      const isJPG = file.raw.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      if (isJPG && isLt2M) {
        this.imageUrl = URL.createObjectURL(file.raw)
      }
    },
    beforeImageUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    },
    confirmSubmit () {
      this.$confirm(`您确认要发布「${this.title}」`, '确认发布', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.submit()
      }).catch(() => {})
    },
    async submit () {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 16.7rem;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 1rem;
  color: #8c939d;
  width: 3rem;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  border: 2px dashed #8c939d;
  border-radius: 0.7rem;
}
.avatar {
  max-width: 8.4rem;
  max-height: 8rem;
  display: block;
  border-radius: 0.2rem;
}
.input-with-label {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: 0.5rem 0;
}
.label {
  margin-right: 0.5rem;
  font-size: 0.5rem;
}
.input {
  width: 6rem;
}
.el-input-number {
  width: 6rem;
}
.el-button {
  margin-top: 0.5rem;
}
</style>
