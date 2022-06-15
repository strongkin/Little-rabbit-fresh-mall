<template>
  <div class="xtx-checkout-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>填写订单</XtxBreadItem>
      </XtxBread>
      <div class="wrapper" v-if="info">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text" v-if="defAddr">
              <!-- <div class="none">您需要先添加收货地址才可提交订单。</div> -->
              <ul>
                <li>
                  <span>收<i />货<i />人：</span>{{ defAddr.receiver }}
                </li>
                <li><span>联系方式：</span>{{ defAddr.contact }}</li>
                <li>
                  <span>收货地址：</span
                  >{{ defAddr.fullLocation + defAddr.address }}
                </li>
              </ul>
              <a href="javascript:;" @click="openDialog(defAddr)">修改地址</a>
            </div>
            <div class="text" v-else>
              <div class="none">你需要先添加收货地址才能提交订单</div>
            </div>
            <div class="action">
              <XtxButton class="btn" @click="openSelectDialog()"
                >切换地址</XtxButton
              >
              <XtxButton class="btn" @click="openDialog({})"
                >添加地址</XtxButton
              >
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in info.goods" :key="item.skuId">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="item.picture" alt="" />
                    <div class="right">
                      <p>{{ item.name }}</p>
                      <p>{{ item.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ item.price }}</td>
                <td>{{ item.count }}</td>
                <td>&yen;{{ item.totalPrice }}</td>
                <td>&yen;{{ item.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;"
            >不限送货时间：周一至周日</a
          >
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color: #999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ info.summary.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ info.summary.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ info.summary.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">
                ¥{{ info.summary.totalPayPrice.toFixed(2) }}
              </dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <XtxButton type="primary" @click="submitOrder">提交订单</XtxButton>
        </div>
      </div>
    </div>
    <AddressEdit ref="dialog" @on-success="success" />
    <XtxDialog title="选择收货地址" v-model:visible="visibleDialog" v-if="info">
      <div
        class="text item"
        @click="selectedId = item.id"
        :class="{ active: item.id === selectedId }"
        v-for="item in info.userAddresses"
        :key="item.id"
      >
        <ul>
          <li>
            <span>收<i />货<i />人：</span> {{ item.receiver }}
          </li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation + item.address }}</li>
        </ul>
      </div>
      <template #footer>
        <XtxButton
          @click="visibleDialog = false"
          type="gray"
          style="margin-right: 20px"
        >
          取消
        </XtxButton>
        <XtxButton type="primary" @click="confirm"> 确认 </XtxButton>
      </template>
    </XtxDialog>
  </div>
</template>
<script>
import { getCheckoutInfo, getAddress, createOrder } from '@/api/order'
import Message from 'erabbit-ui/packages/components/Message'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AddressEdit from './components/address-edit'

export default {
  name: 'XtxCheckoutPage',
  components: { AddressEdit },
  setup() {
    const info = ref(null)
    onMounted(async () => {
      const data = await getCheckoutInfo()
      info.value = data.result
      console.log(data.result)
    })
    //默认地址
    const defAddr = computed(() => {
      // 有选中地址优先权
      if (confirmId.value) {
        return info.value.userAddresses.find(
          (item) => item.id === confirmId.value
        )
      }
      if (info.value && info.value.userAddresses) {
        const defaultAddress = info.value.userAddresses.find(
          (item) => item.isDefault === 0
        )
        return defaultAddress ? defaultAddress : info.value.userAddresses[0]
      }
      return null
    })
    const dialog = ref(null)
    const openDialog = (addr) => {
      dialog.value.open(addr)
    }
    const success = async () => {
      const data = await getAddress()
      info.value.userAddresses = data.result
    }
    const visibleDialog = ref(false)
    const openSelectDialog = () => {
      selectedId.value = null
      visibleDialog.value = true
    }
    const selectedId = ref(null)
    const confirmId = ref(null)
    const confirm = () => {
      confirmId.value = selectedId.value
      visibleDialog.value = false
    }
    //
    const router = useRouter()
    const submitOrder = async () => {
      if (!defAddr.value) return Message({ text: '请添加收货地址' })
      try {
        const data = await createOrder({
          goods: info.value.goods.map(({ skuId, count }) => ({ skuId, count })),
          addressId: defAddr.value.id,
          //
          deliveryTimeType: 1,
          payType: 1,
          payChannel: 1,
          buyerMessage: ''
        })
        router.push(`/user/pay?id=${data.result.id}`)
      } catch (e) {
        Message({
          type: 'error',
          text: e.response.data.message || '确认订单失败'
        })
      }
    }
    return {
      info,
      defAddr,
      openDialog,
      dialog,
      success,
      visibleDialog,
      openSelectDialog,
      selectedId,
      confirm,
      submitOrder
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    max-height: 100%;
    overflow-y: auto;
    .body {
      font-size: 14px;
    }
  }
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: var(--xtx-color);
        background: lighten(#3eaf7c, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
        i {
          width: 0.5em;
          display: inline-block;
        }
      }
    }
  }
}
.xtx-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }
}
.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: var(--xtx-color);
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  .info {
    display: flex;
    text-align: left;
    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }
    .right {
      line-height: 24px;
      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }
  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }
    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      &:first-child {
        border-left: 1px solid #f5f5f5;
      }
      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}
.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;
  &.active,
  &:hover {
    border-color: var(--xtx-color);
  }
}
.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }
    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;
      &.price {
        font-size: 20px;
        color: var(--price-color);
      }
    }
  }
}
.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>
