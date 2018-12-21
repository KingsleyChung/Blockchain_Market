<template>
  <div v-if="goods" class="container">
    <div class="image">
      <img :src='imageUrl' />
    </div>
    <div class="text">
      <div class="title">{{goods.title}}</div>
      <div class="row-area">
        <div class="stock">库存: {{goods.stock}}</div>
        <div class="price">价格: $ {{goods.price}}</div>
        <div class="view">浏览: {{goods.view}}</div>
      </div>
    </div>
    <div class="description">
      {{goods.description}}
    </div>
    <div class="blank"/>
    <div class="order-area">
      <el-input-number class="buy-amount" v-model="amount" :min="1" :max="goods.stock"></el-input-number>
      <el-button class="buy-btn" type="primary" @click="buyConfirm">购买</el-button>
    </div>
  </div>
</template>

<script>
export default {
  async created () {
    this.getGoods()
    this.addView()
  },
  data () {
    return {
      goods: null,
      amount: 1
    }
  },
  computed: {
    imageUrl () {
      if (!this.goods) return ''
      return `http://139.199.59.246:3000/uploads/${this.goods.filename}`
    }
  },
  methods: {
    async getGoods () {
      let res = await this.$axios.get(`/api/goods?goodsId=${this.$route.params.goodsId}`)
      this.goods = res.data.goods
    },
    async addView () {
      await this.$axios.get(`/api/view?goodsId=${this.$route.params.goodsId}`)
    },
    buyConfirm () {
      this.$confirm(`您确认要花费 $${this.goods.price * this.amount} 购买「${this.goods.title}」吗`, '确认购买', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.buy()
      }).catch(() => {})
    },
    async buy () {
      let res = await this.$axios.get(`/api/buyGoods?goodsId=${this.goods._id}&amount=${this.amount}`)
      if (res.data.code === 0) {
        this.getGoods()
        this.$notify({
          title: '已购买',
          message: `已成功购买${this.amount}件商品`,
          type: 'success'
        })
      } else {
        this.$notify.error({
          title: '错误',
          message: res.data.code === 2 ? res.data.msg : '系统错误'
        })
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.image {
  width: 100%;
  border-bottom: 1px solid rgb(214, 214, 214);
}
.image > img {
  width: 100%;
}
.text {
  width: 94%;
  padding-bottom: 0.1rem;
  margin-bottom: 0.3rem;
  border-bottom: 1px solid gray;
}
.title {
  font-size: 0.9rem;
  font-weight: bold;
}
.row-area {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: gray;
}
.description {
  width: 94%;
  font-size: 0.5rem;
}
.order-area {
  position: fixed;
  width: 94%;
  bottom: 3vw;
  display: flex;
  justify-content: space-between;
}
.buy-amount {
  width: 48%;
}
.buy-btn {
  width: 48%;
}
.blank {
  height: 9vh;
}
</style>
