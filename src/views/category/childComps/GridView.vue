<template>
  <div class="grid-view" ref="gridView">
    <slot></slot>
  </div>
</template>

<script>
export default {
  // 商品子分类item
  name: 'GridView',
  props: {
    cols: { // 列数
      type: Number,
      default: 2
    },
    hMargin: { // 上下内边距
      type: Number,
      default: 8
    },
    vMargin: { // 左右内边距
      type: Number,
      default: 8
    },
    itemSpace: { // 右内边距
      type: Number,
      default: 8
    },
    lineSpace: { // 上内边距
      type: Number,
      default: 8
    }
  },
  mounted: function () {
    setTimeout(this.autoLayout, 20)
  },
  updated: function () {
    this.autoLayout()
  },
  methods: {
    autoLayout: function () {
      // 1.获取gridEl和children
      const gridEl = this.$refs.gridView
      const children = gridEl.children

      // 2.设置gridEl的内边距
      gridEl.style.padding = `${this.vMargin}px ${this.hMargin}px`

      // 3.计算item的宽度  （（clientWidth = width+左右padding）- 2 X 左右内边距 -（列数-1）X 右内边距 ） ÷ 列数
      const itemWidth = (gridEl.clientWidth - 2 * this.vMargin - (this.cols - 1) * this.itemSpace) / this.cols
      for (let i = 0; i < children.length; i++) {
        const item = children[i]
        item.style.width = itemWidth + 'px'
        if ((i + 1) % this.cols !== 0) {
          item.style.marginRight = this.itemSpace + 'px'
        }
        if (i >= this.cols) {
          item.style.marginTop = this.lineSpace + 'px'
        }
      }
    }
  }
}
</script>

<style scoped>
  .grid-view {
    display: flex;
    flex-wrap: wrap;
  }
</style>
