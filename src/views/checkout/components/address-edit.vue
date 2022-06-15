<template>
  <XtxDialog
    v-model:visible="dialogVisible"
    :title="`${form.id ? '修改' : '添加'}收货地址`"
  >
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label"><i class="red">*</i>收货人：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入收货人"
              v-model="form.receiver"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label"><i class="red">*</i>手机号：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入手机号"
              v-model="form.contact"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label"><i class="red">*</i>地区：</div>
          <div class="field">
            <XtxCity
              placeholder="请选择所在地区"
              :fullLocation="form.fullLocation"
              @change="changeCity"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label"><i class="red">*</i>详细地址：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入详细地址"
              v-model="form.address"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入邮政编码"
              v-model="form.postalCode"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入地址标签，逗号分隔"
              v-model="form.addressTags"
            />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <XtxButton
        @click="dialogVisible = false"
        type="gray"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton @click="submit()" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { ref } from 'vue'
import { insertAddress, updateAddress } from '@/api/order'
import Message from 'erabbit-ui/packages/components/Message'
export default {
  name: 'AddressEdit',
  emits: ['on-success'],
  setup(props, { emit }) {
    const dialogVisible = ref(false)
    // 打开函数
    const open = (addr) => {
      form.value = { ...addr }
      dialogVisible.value = true
    }
    const form = ref({})
    const changeCity = (ret) => {
      for (const key in ret) {
        form.value[key] = ret[key]
      }
    }
    const submit = async () => {
      if (form.value.id) {
        try {
          await updateAddress(form.value)
          Message({ type: 'success', text: '修改收货地址成功' })
          emit('on-success')
          dialogVisible.value = false
        } catch (e) {
          Message({
            type: 'error',
            text: e.response.data.message || '修改失败'
          })
        }
      } else {
        try {
          form.value.isDefault = 1
          await insertAddress(form.value)
          Message({ type: 'success', text: '添加收货地址成功' })
          emit('on-success')
          dialogVisible.value = false
        } catch (e) {
          Message({
            type: 'error',
            text: e.response.data.message || '添加失败'
          })
        }
      }
    }
    return { dialogVisible, open, form, changeCity, submit }
  }
}
</script>
<style scoped lang="less">
.address-edit {
  .xtx-dialog {
    :deep(.wrapper) {
      max-height: 100%;
      overflow-y: auto;
      width: 780px;
      .body {
        font-size: 14px;
      }
    }
  }
  .address-edit {
    .red {
      color: var(--price-color);
      position: relative;
      top: 2px;
      margin-right: 2px;
    }
    .xtx-form {
      padding: 0;
      input {
        outline: none;
        &::placeholder {
          color: #ccc;
        }
      }
    }
    .xtx-city {
      width: 320px;
      :deep(.select) {
        height: 50px;
        line-height: 48px;
        display: flex;
        padding: 0 10px;
        justify-content: space-between;
        .placeholder {
          color: #ccc;
        }
        i {
          color: #ccc;
          font-size: 18px;
        }
        .value {
          font-size: 14px;
        }
      }
      :deep(.option) {
        top: 49px;
      }
    }
  }
}
</style>
