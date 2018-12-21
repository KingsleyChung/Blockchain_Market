<template>
  <div class="container">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
    </el-form>
    <div class="row-area">
      <el-button type="primary" @click="submitForm()">登录</el-button>
      <el-button @click="goToRegister">注册</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async submitForm () {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          })
          return
        }
        let res = await this.$axios.post(`/api/login`, {
          username: this.form.username,
          password: this.form.password
        })
        if (res.data.code === 0) {
          this.$store.commit('setStorage', res.data.userInfo)
          if (this.$route.query.redirect) {
            this.$router.push(this.$route.query.redirect)
          } else {
            this.$router.push('/')
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.code === 2 ? res.data.msg : '系统错误'
          })
        }
      })
    },
    goToRegister () {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.row-area {
  display: flex;
  flex-direction: row;
}
</style>
