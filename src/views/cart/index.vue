<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart" v-if="$store.getters['cart/validList'].length">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox
                  @change="checkAll"
                  :modelValue="$store.getters['cart/isCheckAll']"
                  >全选</XtxCheckbox
                >
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr
              v-for="item in $store.getters['cart/validList']"
              :key="item.skuId"
            >
              <td>
                <XtxCheckbox
                  @change="($event) => checkOne(item.skuId, $event)"
                  :modelValue="item.selected"
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink to="/"
                    ><img :src="item.picture" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ item.name }}
                    </p>
                    <p class="attr">{{ item.attrText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
                <p v-if="item.price - item.nowPrice > 0">
                  比加入时降价
                  <span class="red">&yen;{{ item.price - item.nowPrice }}</span>
                </p>
              </td>
              <td class="tc">
                <XtxNumbox
                  :modelValue="item.count"
                  @change="changeCount(item.skuId, $event)"
                  :min="1"
                  :max="item.stock"
                />
              </td>
              <td class="tc">
                <p class="f16 red">
                  &yen;{{ (item.nowPrice * 100 * item.count) / 100 }}
                </p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p>
                  <a
                    class="green"
                    href="javascript:;"
                    @click="deleteCart(item.skuId)"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action" v-if="$store.getters['cart/validList'].length">
        <div class="batch">
          <XtxCheckbox
            @change="checkAll"
            :modelValue="$store.getters['cart/isCheckAll']"
            >全选</XtxCheckbox
          >
          <!-- @click="deleteCart(item.skuId)" -->
          <a href="javascript:;" @click="batchDeleteCart()">删除商品</a>
        </div>
        <div class="total">
          共 {{ $store.getters['cart/validTotal'] }} 件商品，已选择
          {{ $store.getters['cart/selectedTotal'] }}
          件，商品合计：
          <span class="red">¥{{ $store.getters['cart/selectedAmount'] }}</span>
          <XtxButton type="primary" @click="goCheckout()">下单结算</XtxButton>
        </div>
      </div>
      <CartNone v-else />
    </div>
  </div>
</template>
<script>
import CartNone from './component/cart-none'
import Confirm from 'erabbit-ui'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from 'erabbit-ui/packages/components/Message'
export default {
  name: 'XtxCartPage',
  components: { CartNone },
  setup() {
    const store = useStore()
    //单选
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', { skuId, selected })
    }
    // 全选
    const checkAll = (selected) => {
      store.dispatch('cart/checkAllCart', selected)
    }
    //删除商品
    const deleteCart = (skuId) => {
      store.dispatch('cart/deleteCart', skuId)
    }
    //批量删除商品
    const batchDeleteCart = () => {
      Confirm({ text: '' }).then(() => {
        store.dispatch('cart/batchDeleteCart')
      })
    }
    //
    const changeCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }
    // 跳转结算页面
    const router = useRouter()
    const goCheckout = () => {
      //判断是否选中有效商品
      //判断是否已经登录，未登录弹窗提示
      //进行跳转 需要做访问权限控制
      if (store.getters['cart/selectedTotal'] === 0)
        return Message({ text: '至少选中一件商品才能结算' })
      if (!store.state.user.profile.token) {
        Confirm({ text: '下单结算需要登录，你是否去登录？' })
          .then(() => {
            //点击确认
            router.push('/user/checkout')
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        router.push('/user/checkout')
      }
    }
    return {
      checkOne,
      checkAll,
      deleteCart,
      batchDeleteCart,
      changeCount,
      goCheckout
    }
  }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: var(--price-color);
}
.green {
  color: var(--xtx-color);
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
