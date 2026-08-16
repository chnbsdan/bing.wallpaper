<template>
  <input
    type="date"
    :value="dateValue"
    @input="onDateChange"
    @blur="onBlur"
    :max="maxDate"
    class="date-input"
    placeholder="日期或年份"
  />
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const dateValue = ref('')

watch(
  () => route.params.date,
  (newDate) => {
    if (typeof newDate === 'string' && newDate.includes('-')) {
      dateValue.value = newDate
    } else {
      dateValue.value = ''
    }
  },
  { immediate: true }
)

const maxDate = new Date().toISOString().split('T')[0]

// 判断格式
const isYear = (val: string): boolean => /^\d{4}$/.test(val)
const isYearMonth = (val: string): boolean => /^\d{6}$/.test(val)
const isFullDate = (val: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(val)

const onDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const date = target.value
  if (!date) {
    router.push('/')
    return
  }
  
  const currentMkt = route.query.mkt || 'zh-CN'
  
  // 1. 年份：2018 → /year/2018
  if (isYear(date)) {
    router.push(`/year/${date}?mkt=${currentMkt}`)
    return
  }
  
  // 2. 年月：201705 → /year-month/201705
  if (isYearMonth(date)) {
    router.push(`/year-month/${date}?mkt=${currentMkt}`)
    return
  }
  
  // 3. 完整日期：2018-08-15 → /2018-08-15
  if (isFullDate(date)) {
    router.push(`/${date}?mkt=${currentMkt}`)
    return
  }
  
  router.push(`/${date}?mkt=${currentMkt}`)
}

const onBlur = (event: Event) => {
  const target = event.target as HTMLInputElement
  const val = target.value
  if (!val) return
  
  const currentMkt = route.query.mkt || 'zh-CN'
  
  if (isYear(val)) {
    router.push(`/year/${val}?mkt=${currentMkt}`)
    return
  }
  
  if (isYearMonth(val)) {
    router.push(`/year-month/${val}?mkt=${currentMkt}`)
  }
}
</script>

<style scoped>
.date-input {
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: transparent;
  font-size: 14px;
  color: inherit;
  cursor: pointer;
  max-width: 130px;
}
.date-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}
@media (max-width: 640px) {
  .date-input {
    max-width: 110px;
    font-size: 12px;
    padding: 2px 6px;
  }
}
</style>
