<template>
  <div class="home">
    <div class="dashboard-container">
      <h1 class="dashboard-title">Tra cứu điểm thi THPT 2024</h1>
      <div class="dashboard-stack">
        
        <div class="card">
          <div class="card-title">Tra cứu điểm theo SBD</div>
          <SearchForm @search-result="handleSearchResult" />
        </div>
        <ScoreCard v-if="searchResult" :student="searchResult" />
        <div class="card">
          <div class="card-title">Thống kê điểm</div>
          <StatisticsChart />
        </div>
        <div class="card">
          <div class="card-title">Top 10 học sinh khối A</div>
          <TopStudents />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import SearchForm from '@/components/SearchForm.vue'
import ScoreCard from '@/components/ScoreCard.vue'
import StatisticsChart from '@/components/StatisticsChart.vue'
import TopStudents from '@/components/TopStudents.vue'


export default {
  name: 'HomeView',
  components: {
    SearchForm,
    ScoreCard,
    StatisticsChart,
    TopStudents,

  },
  setup() {
    const searchResult = ref(null)
    const importResult = ref(null)

    const handleSearchResult = (result) => {
      searchResult.value = result
    }
    const onImportResult = (result) => {
      importResult.value = result
    }

    return {
      searchResult,
      handleSearchResult,
      onImportResult,
      importResult
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 8px 48px 8px;
}
.dashboard-title {
  font-size: 2.3rem;
  font-weight: 800;
  color: #173ea5;
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 1px;
}
.dashboard-stack {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
@media (min-width: 900px) {
  .dashboard-title {
    font-size: 2.8rem;
  }
}
</style> 