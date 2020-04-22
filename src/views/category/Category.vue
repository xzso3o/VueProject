<template>
  <div id="category">
    <!--基本导航组件-->
    <nav-bar class="nav-bar"><div slot="center">商品分类</div></nav-bar>
    <div class="content">
      <!--商品分类菜单组件-->
      <tab-menu :categories="categories" @selectItem="selectItem"/>
      <!--封装的Scroll滚动组件-->
      <scroll id="tab-content" :data="[categoryData]">
        <div>
          <!--商品子分类列表-->
          <tab-content-category :subcategories="showSubcategory"/>
          <!-- 商品类型选项卡组件 -->
          <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl" />
          <!-- 商品列表组件 -->
          <goods-list :goods="showGoods" />
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
// 基本导航组件
import NavBar from 'components/common/navbar/NavBar'
// 商品分类菜单组件
import TabMenu from './childComps/TabMenu'
// 商品子分类列表
import TabContentCategory from './childComps/TabContentCategory'
// 商品类型选项卡组件
import TabControl from "../../components/content/tabControl/TabControl";
// 商品列表组件
import GoodsList from "../../components/content/goods/GoodsList";

// 封装的Scroll滚动组件
import Scroll from 'components/common/scroll/Scroll'

// 获取数据
import {getCategory, getSubcategory, getCategoryDetail} from "../../network/category";
import {POP, SELL, NEW} from "../../common/const";
import {tabControlMixin} from "../../common/mixin";

export default {
  name: 'Category',
  components: {
    NavBar,
    TabMenu,
    TabContentCategory,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [tabControlMixin],
  data () {
    return {
      categories: [], // 商品分类
      categoryData: {}, // 每个类别的子数据
      currentIndex: -1 // 当前子分类索引
    }
  },
  mounted () {
    // this.scroll = new BScroll(this.$refs.wrapper, {
    //   probeType: 2
    // })
    // this.scroll.on('scroll', (position) => {
    //   console.log(position)
    // })
  },
  created () {
    // 1.请求商品分类数据
    this.getCategory()
  },
  computed: {
    // 显示对应商品子分类列表
    showSubcategory () {
      if (this.currentIndex === -1) return {}
      return this.categoryData[this.currentIndex].subcategories
    },
    showGoods () {
      if (this.currentIndex === -1) return []
      return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
    }
  },
  methods: {
    // 获取商品分类数据
    getCategory () {
      getCategory().then(res => {
        // 1.获取分类数据
        this.categories = res.data.category.list
        // 2.初始化每个类别的子数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},
            categoryDetail: {
              pop: [],
              new: [],
              sell: []
            }
          }
        }
        // 3.请求第一个分类的子分类数据
        this.getSubcategories(0)
      })
    },
    // 根据分类获取子分类
    getSubcategories (index) {
      this.currentIndex = index
      const mailKey = this.categories[index].maitKey
      getSubcategory(mailKey).then(res => {
        this.categoryData[index].subcategories = res.data
        this.categoryData = { ...this.categoryData }
        this.getCategoryDetail(POP)
        this.getCategoryDetail(SELL)
        this.getCategoryDetail(NEW)
      })
    },
    getCategoryDetail (type) {
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey
      // 2.发送请求,传入miniWallkey和type
      getCategoryDetail(miniWallkey, type).then(res => {
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res
        this.categoryData = { ...this.categoryData }
      })
    },
    // 事件响应相关的方法
    // 根据分类获取子分类
    selectItem (index) {
      this.getSubcategories(index)
    }
  }
}
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content {
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
  }

  #tab-content {
    height: 100%;
    flex: 1;
  }
</style>
