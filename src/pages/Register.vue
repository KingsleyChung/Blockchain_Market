<template>
  <div class="container">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <div class="row-area">
      <el-button type="primary" @click="submitForm">注册</el-button>
      <el-button @click="goToLogin">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '请确认密码', trigger: 'blur'},
          {validator: this.password === this.confirmPassword, message: '密码不一致', trigger: 'blur'}
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
            message: '信息填写有误'
          })
          return
        }
        let res = await this.$axios.post(`/api/register`, {
          username: this.form.username,
          password: this.form.password
        })
        if (res.data.code === 0) {
          this.$store.commit('setStorage', res.data.userInfo)
          this.$router.push('/')
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.code === 2 ? res.data.msg : '系统错误'
          })
        }
      })
    },
    goToLogin () {
      this.$router.push('/login')
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
