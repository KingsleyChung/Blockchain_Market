<template>
  <div class="container">
    <div class="user-info" v-if="username">
      <div>
        <img class="user-icon" src="../assets/icons/user.png" />
        {{username}}
      </div>
      <img class="logout-icon" src="../assets/icons/logout.png" @click="logout"/>
    </div>
    <div class="recommand-title" v-if="recommandStatus">为您推荐</div>
    <div class="no-recommand" v-if="recommandStatus && goods.length == 0">无推荐</div>
    <div class="goods-container">
      <div class="sub-container">
        <goods-card v-if="leftGoods" v-for="good in leftGoods" :goods="good" :key="good._id"/>
      </div>
      <div class="sub-container">
        <goods-card v-if="rightGoods" v-for="good in rightGoods" :goods="good" :key="good._id"/>
      </div>
    </div>
    <el-button class="recommand-btn" type="primary" :icon="recommandStatus ? 'el-icon-star-on' : 'el-icon-star-off'" circle @click="changeGoodsList"></el-button>
  </div>
</template>

<script>
import goodsCard from '../components/goodsCard'
export default {
  components: {
    goodsCard
  },
  async created () {
    this.getAllGoods()
  },
  data () {
    return {
      goods: [],
      recommandStatus: false,
      username: this.$store.getters.getStorage ? this.$store.getters.getStorage.username : null
    }
  },
  computed: {
    leftGoods () {
      let goods = []
      for (let i = 0; i < this.goods.length; i++) {
        if (i % 2 === 0) {
          goods.push(this.goods[i])
        }
      }
      return goods
    },
    rightGoods () {
      let goods = []
      for (let i = 0; i < this.goods.length; i++) {
        if (i % 2 !== 0) {
          goods.push(this.goods[i])
        }
      }
      return goods
    }
  },
  methods: {
    async getAllGoods () {
      let res = await this.$axios.get(`/api/allGoods`)
      this.goods = res.data.goods
    },
    async getRecommandGoods () {
      let res = await this.$axios.get(`/api/recommandGoods`)
      this.goods = res.data.recommands
    },
    changeGoodsList () {
      if (this.recommandStatus) {
        this.getAllGoods()
      } else {
        this.getRecommandGoods()
      }
      this.recommandStatus = !this.recommandStatus
    },
    logout () {
      this.$store.commit('removeStorage')
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.user-info {
  width: 96%;
  padding: 0.4rem 0.2rem 0.2rem 0.2rem;
  font-size: 0.6rem;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user-info > div {
  display: flex;
  align-items: center;
}
.user-icon {
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.2rem;
}
.logout-icon {
  width: 0.5rem;
  height: 0.5rem;
}
.goods-container {
  display: flex;
}
.sub-container {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sub-container:nth-child(1) {
  padding-left: 0.2rem;
  padding-right: 0.1rem;
}
.sub-container:nth-child(2) {
  padding-left: 0.1rem;
  padding-right: 0.2rem;
}
.el-card__body {
  padding: 0;
}
.recommand-btn {
  position: fixed;
  bottom: 0.2rem;
  right: 0.2rem;
}
.recommand-title {
  font-size: 0.8rem;
}
.no-recommand {
  margin-top: 5rem;
  font-size: 0.6rem;
}
</style>
