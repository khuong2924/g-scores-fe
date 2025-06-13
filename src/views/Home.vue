<template>
  <div class="home">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Tra cứu điểm thi THPT 2024</h1>
      <div class="mb-8">
        <FileUpload @data-processed="onImportResult" />
      </div>
      <div class="space-y-8">
        <SearchForm @search-result="handleSearchResult" />
        <ScoreCard v-if="searchResult" :student="searchResult" />
        <StatisticsChart />
        <TopStudents />
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
import FileUpload from '@/components/FileUpload.vue'

export default {
  name: 'HomeView',
  components: {
    SearchForm,
    ScoreCard,
    StatisticsChart,
    TopStudents,
    FileUpload
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