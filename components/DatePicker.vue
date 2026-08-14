<template>
  <div class="date-picker">
    <input
      type="date"
      :value="dateValue"
      @input="onDateChange"
      :max="maxDate"
      class="date-input"
    />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const dateValue = ref('')

watch(
  () => route.params.date,
  (newDate) => {
    if (Array.isArray(newDate) && newDate.length === 3) {
      const [year, month, day] = newDate
      dateValue.value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    } else if (typeof newDate === 'string' && newDate.includes('-')) {
      dateValue.value = newDate
    } else {
      dateValue.value = ''
    }
  },
  { immediate: true }
)

const maxDate = new Date().toISOString().split('T')[0]

const onDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const date = target.value
  if (!date) {
    router.push('/')
    return
  }
  const [year, month, day] = date.split('-')
  const currentMkt = route.query.mkt || 'zh-CN'
  router.push(`/${year}/${month}/${day}?mkt=${currentMkt}`)
}
</script>

<style scoped>
.date-picker {
  display: inline-flex;
  align-items: center;
  margin: 0 8px;
}
.date-input {
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: transparent;
  font-size: 14px;
  color: inherit;
  cursor: pointer;
  max-width: 140px;
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
