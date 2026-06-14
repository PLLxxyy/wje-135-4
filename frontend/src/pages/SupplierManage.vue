<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import EmptyState from "../components/common/EmptyState.vue";
import { usePagination } from "../hooks/usePagination";
import { useProductStore } from "../stores/productStore";
import { useSupplierStore } from "../stores/supplierStore";
import type { Supplier } from "../types";

const supplierStore = useSupplierStore();
const productStore = useProductStore();
const { page, pageSize, total, pagedItems, resetPage } = usePagination(() => supplierStore.suppliers, 10);

const dialogVisible = ref(false);
const bindDialogVisible = ref(false);
const editingId = ref<string | null>(null);
const selectedSupplierId = ref("");
const selectedProductIds = ref<string[]>([]);
const form = reactive({
  name: "",
  contactPerson: "",
  contactPhone: "",
  email: "",
  address: "",
  remark: ""
});

onMounted(async () => {
  await Promise.all([supplierStore.fetchSuppliers(), productStore.fetchProducts()]);
});

function resetForm() {
  form.name = "";
  form.contactPerson = "";
  form.contactPhone = "";
  form.email = "";
  form.address = "";
  form.remark = "";
  editingId.value = null;
}

function openCreate() {
  resetForm();
  dialogVisible.value = true;
}

function openEdit(row: Supplier) {
  editingId.value = row.id;
  form.name = row.name;
  form.contactPerson = row.contactPerson || "";
  form.contactPhone = row.contactPhone || "";
  form.email = row.email || "";
  form.address = row.address || "";
  form.remark = row.remark || "";
  dialogVisible.value = true;
}

async function submitForm() {
  const payload = {
    name: form.name,
    contactPerson: form.contactPerson || undefined,
    contactPhone: form.contactPhone || undefined,
    email: form.email || undefined,
    address: form.address || undefined,
    remark: form.remark || undefined
  };
  if (editingId.value) {
    await supplierStore.update(editingId.value, payload);
    ElMessage.success("供应商已更新");
  } else {
    await supplierStore.create(payload);
    ElMessage.success("供应商已创建");
  }
  dialogVisible.value = false;
  resetForm();
}

async function removeSupplier(row: Supplier) {
  await ElMessageBox.confirm(`确定删除供应商「${row.name}」？`, "删除确认", { type: "warning" });
  await supplierStore.remove(row.id);
  ElMessage.success("供应商已删除");
}

function openBind(row: Supplier) {
  selectedSupplierId.value = row.id;
  selectedProductIds.value = row.productSuppliers?.map((ps) => ps.product.id) || [];
  bindDialogVisible.value = true;
}

async function submitBind() {
  await supplierStore.bindProducts(selectedSupplierId.value, selectedProductIds.value);
  ElMessage.success("关联商品已更新");
  bindDialogVisible.value = false;
}
</script>

<template>
  <section class="supplier-page">
    <div class="panel">
      <div class="panel-title">
        <h2>供应商列表</h2>
        <el-button type="primary" @click="openCreate">新增供应商</el-button>
      </div>
      <el-table :data="pagedItems" v-loading="supplierStore.loading">
        <el-table-column prop="name" label="供应商名称" min-width="140" />
        <el-table-column prop="contactPerson" label="联系人" width="120" />
        <el-table-column prop="contactPhone" label="联系电话" width="140" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column label="关联商品" width="100">
          <template #default="{ row }">{{ row.productSuppliers?.length || 0 }} 种</template>
        </el-table-column>
        <el-table-column label="订单数" width="90">
          <template #default="{ row }">{{ row._count?.orders || 0 }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="openBind(row)">关联商品</el-button>
            <el-button link type="danger" @click="removeSupplier(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <EmptyState v-if="!supplierStore.loading && !supplierStore.suppliers.length" title="暂无供应商" description="点击上方按钮新增" />
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" layout="prev, pager, next" :total="total" />
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑供应商' : '新增供应商'" width="520px" @close="resetForm">
      <el-form label-position="top">
        <el-form-item label="供应商名称" required>
          <el-input v-model="form.name" placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="bindDialogVisible" title="关联商品" width="520px">
      <el-select v-model="selectedProductIds" multiple placeholder="选择关联商品" style="width: 100%">
        <el-option v-for="product in productStore.products" :key="product.id" :label="`${product.name} / ${product.sku}`" :value="product.id" />
      </el-select>
      <template #footer>
        <el-button @click="bindDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBind">确定</el-button>
      </template>
    </el-dialog>
  </section>
</template>
