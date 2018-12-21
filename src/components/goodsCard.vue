<template>
  <div @click="goToDetail">
    <el-card class="card">
      <div class="image">
        <img :src='imageUrl' />
      </div>
      <div class="title">{{goods.title}}</div>
      <div class="text-area">
        <div class="stock sub-text">库存: {{goods.stock}}</div>
        <div class="price sub-text">价格: $ {{goods.price}}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['goods'],
  computed: {
    imageUrl () {
      return `http://139.199.59.246:3000/uploads/${this.goods.filename}`
    }
  },
  methods: {
    goToDetail () {
      console.log('click')
      this.$router.push({path: `/detail/${this.goods._id}`})
    }
  }
}
</script>

<style>
.card {
  width: 100%;
  margin-top: 0.2rem;
}
.image {
  width: 100%;
}
.image > img {
  width: 100%;
}
.title {
  font-size: 0.5rem;
  font-weight: bold;
  padding: 0 0.2rem;
}
.text-area {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.2rem 0.2rem 0.2rem;
}
.sub-text {
  color: gray;
}
.el-card__body {
  padding: 0;
}
</style>
