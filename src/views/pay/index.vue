<template>
  <div class="xtx-pay-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>支付订单</XtxBreadItem>
      </XtxBread>
      <!-- 付款信息 -->
      <div class="pay-info" v-if="order">
        <span class="icon iconfont icon-queren2"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <!-- v-if="order.countdown > 0" -->
          <p v-if="order.countdown > 0">
            支付还剩 <span>{{ formatTime(order.countdown) }}</span
            >, 超时后将取消订单
          </p>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <!-- {{ order.payMoney }} -->
          <span>¥{{ order.payMoney }}</span>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a class="btn wx" href="javascript:;"></a>
          <a
            class="btn alipay"
            @click="visibleDialog = true"
            target="_blank"
            :href="payUrl"
          ></a>
        </div>
        <div class="item">
          <p>支付方式</p>
          <a class="btn" href="javascript:;">招商银行</a>
          <a class="btn" href="javascript:;">工商银行</a>
          <a class="btn" href="javascript:;">建设银行</a>
          <a class="btn" href="javascript:;">农业银行</a>
          <a class="btn" href="javascript:;">交通银行</a>
        </div>
      </div>
    </div>
    <XtxDialog title="正在支付..." v-model:visible="visibleDialog">
      <div class="pay-wait">
        <img src="@/assets/images/load.gif" alt="" />
        <div v-if="order">
          <p>如果支付成功：</p>
          <a href="javascript:;"> 查看订单详情> </a>
          <p>如果支付失败：</p>
          <a href="javascript:;">查看相关疑问></a>
        </div>
      </div>
    </XtxDialog>
  </div>
</template>
<script>
import { useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getOrderInfo } from '@/api/order'
import { useIntervalFn } from '@vueuse/core'
import { baseURL } from '@/utils/request'
import dayjs from 'dayjs'
export default {
  name: 'XtxPayPage',
  setup() {
    const route = useRoute()
    const order = ref(null)
    onMounted(async () => {
      const data = await getOrderInfo(route.query.id)
      console.log(data, 'pay')
      order.value = data.result
      console.log(order.value)
      //
      resume()
    })
    //
    const { resume, pause } = useIntervalFn(
      () => {
        order.value.countdown--
        if (order.value.countdown <= 0) {
          pause
        }
      },
      1000,
      { immediate: false }
    )
    onUnmounted(() => pause())
    // onMounted(() => {
    //   const data=await getOrderInfo
    // })
    const formatTime = (time) => {
      return dayjs.unix(time).format('mm分ss秒')
    }
    const payUrl = computed(() => {
      if (order.value) {
        const redirectUrl = encodeURIComponent(
          'http://localhost:8080/#/user/pay/result'
        )
        return `${baseURL}pay/aliPay?orderId=${order.value.id}&redirect=${redirectUrl}`
      }
      return 'javascript :;'
    })
    const visibleDialog = ref(false)

    return { order, formatTime, payUrl, visibleDialog }
  }
}
</script>
<style scoped lang="less">
.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;
  .icon {
    font-size: 80px;
    color: #1dc779;
  }
  .tip {
    padding-left: 10px;
    flex: 1;
    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }
      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }
  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }
      &:last-child {
        color: var(--price-color);
        font-size: 20px;
      }
    }
  }
}
.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;
  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;
    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }
  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
      border-color: var(--xtx-color);
    }
    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png)
        no-repeat center / contain;
    }
    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg)
        no-repeat center / contain;
    }
  }
}
.pay-wait {
  display: flex;
  justify-content: space-around;
  p {
    margin-top: 30px;
    font-size: 14px;
  }
  a {
    color: var(--xtx-color);
  }
}
</style>
