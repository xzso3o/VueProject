<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probe-type="3">
      <detail-swiper :topImages="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommendList"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <toast :message="message" :show="show"/>
  </div>
</template>

<script>
    import DetailNavBar from "./childComps/DetailNavBar";
    import DetailSwiper from "./childComps/DetailSwiper";
    import DetailBaseInfo from "./childComps/DetailBaseInfo";
    import DetailShopInfo from "./childComps/DetailShopInfo";
    import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
    import DetailParamInfo from "./childComps/DetailParamInfo";
    import DetailCommentInfo from "./childComps/DetailCommentInfo";
    import DetailBottomBar from "./childComps/DetailBottomBar";
    import BackTop from "../../components/content/backTop/BackTop";

    import Scroll from "../../components/common/scroll/Scroll";
    import GoodsList from "../../components/content/goods/GoodsList";
    import Toast from "../../components/common/toast/Toast";

    import {getDetail, Goods, Shop, GoodsParam} from "../../network/detail";
    import {getRecommend} from "../../network/detail";
    import {itemListenerMixin} from "../../common/mixin";
    import {debounce} from "../../common/utils";

    export default {
      name: "Detail",
      data() {
        return {
          iid: null,
          topImages: [],
          goods: {},
          shop: {},
          detailInfo: {},
          paramInfo: {},
          commentInfo: {},
          recommendList: [],
          itemImgListener: null,
          themeTopYs: [],
          getThemeTopY: null,
          currentIndex : 0,
          isShowBackTop: false,
          message: '',
          show: false
        }
      },
      components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        DetailBottomBar,
        Scroll,
        GoodsList,
        BackTop,
        Toast
      },
      mixins: [itemListenerMixin],
      created() {
        //1.保存传入的iid
        this.iid = this.$route.params.iid

        //2.根据iid请求详情数据
        getDetail(this.iid).then( res => {
          // 1.获取顶部的图片轮播数据
          const data = res.result;
          this.topImages = data.itemInfo.topImages

          // 2.获取商品信息
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

          //3.创建店铺信息
          this.shop = new Shop(data.shopInfo)

          // 4.保存商品的详情数据
          this.detailInfo = data.detailInfo;

          // 5.获取参数的信息
          this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

          // 6.保存评论信息
          if (data.rate.list) {
            this.commentInfo = data.rate.list[0];
          }
        })

        getRecommend().then((res) => {
          this.recommendList = res.data.list
        })

        this.getThemeTopY = debounce( () => {
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop-44)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44)
          this.themeTopYs.push(Number.MAX_VALUE)
        }, 100)
      },
      mounted() {
      },
      destroyed() {
        this.$bus.$off('imageLoad',this.itemImgListener)
      },
      methods: {
        imageLoad(){
          this.$refs.scroll.refresh()
          this.getThemeTopY()
        },

        titleClick(index){
          console.log(index);
          this.$refs.scroll.scrollTo(0 , -this.themeTopYs[index], 200)
        },

        contentScroll(position){
          const positionY = -position.y
          let length = this.themeTopYs.length
          for(let i = 0; i < length-1 ; i++){
            if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
              this.currentIndex = i;
              this.$refs.nav.currentIndex = this.currentIndex
            }
            // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i]
            //   && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))){
            //   this.currentIndex = i;
            //   this.$refs.nav.currentIndex = this.currentIndex
            // }
          }

          this.isShowBackTop = (-position.y) > 1000

        },

        backClick(){
          this.$refs.scroll.scrollTo(0,0)
        },

        addToCart(){
          // 1.创建对象
          const product = {}
          // 2.对象信息
          product.iid = this.iid;
          product.imgge = this.topImages[0]
          product.title = this.goods.title
          product.desc = this.goods.desc;
          product.price = this.goods.realPrice;

          //3.将商品添加到购物车
          this.$store.dispatch('addCart',product).then(res => {
            this.show = true;
            this.message = res;
            setTimeout(() => {
              this.show = false;
              this.message = '';
            },1500)
          })
        }
      }
    }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>
