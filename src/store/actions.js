import {
  ADD_COUNTER,
  ADD_TO_CART
}from './mutation-types'

export default {
  addCart(content, payload){
    return new Promise((resolve,reject) =>{
      let oldProduct = content.state.cartList.find(item => item.iid === payload.iid)

      if(oldProduct) {  //如果购物车已经有了该商品 调用mutations里的方法+1
        content.commit(ADD_COUNTER, oldProduct)
        resolve('当前的数量+1')
      }else{            //没用就调用另一个方法,并赋值数量为1
        payload.count = 1
        content.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')
      }
    })
  }
}

