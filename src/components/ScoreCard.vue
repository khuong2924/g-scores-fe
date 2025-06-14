<template>
  <div v-if="student" class="card score-card">
    <div class="card-title">Kết quả điểm thi</div>
    <div class="mb-4">
      <span style="color:#888;">Số báo danh:</span> <span style="font-weight:600;">{{ student.registration_number }}</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="score in student.scores" :key="score.id" class="score-item">
        <div class="score-block">
          <h3 class="score-subject">{{ score.subject.name }}</h3>
          <p class="score-value" :class="getScoreClass(score.score)">
            {{ score.score.toFixed(2) }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="groupAScore" class="score-groupA">
      <h3>Điểm khối A</h3>
      <p>{{ groupAScore.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ScoreCard',
  props: {
    student: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const groupAScore = computed(() => {
      if (!props.student) return null
      const math = props.student.scores.find(s => s.subject.code === 'TOAN')?.score
      const physics = props.student.scores.find(s => s.subject.code === 'VAT_LI')?.score
      const chemistry = props.student.scores.find(s => s.subject.code === 'HOA_HOC')?.score
      if (!math || !physics || !chemistry) return null
      return (math + physics + chemistry) / 3
    })
    const getScoreClass = (score) => {
      if (score >= 8) return 'score-green'
      if (score >= 6) return 'score-blue'
      if (score >= 4) return 'score-yellow'
      return 'score-red'
    }
    return {
      groupAScore,
      getScoreClass
    }
  }
}
</script>

<style scoped>
.score-card {
  margin-bottom: 32px;
  padding: 32px 24px;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(34, 34, 34, 0.07);
  background: #fff;
  color: #222;
  width: 100%;
  max-width: 100%;
}
.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #173ea5;
  margin-bottom: 18px;
  text-align: left;
}
.score-block {
  background: #f7fafd;
  border-radius: 10px;
  padding: 18px 12px;
  text-align: center;
  box-shadow: 0 2px 8px 0 rgba(23,62,165,0.04);
}
.score-subject {
  font-size: 1.1rem;
  color: #173ea5;
  font-weight: 600;
  margin-bottom: 6px;
}
.score-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}
.score-green { color: #22c55e; }
.score-blue { color: #173ea5; }
.score-yellow { color: #eab308; }
.score-red { color: #ef4444; }
.score-groupA {
  margin-top: 28px;
  background: #eaf6fd;
  border-radius: 10px;
  padding: 16px 0;
  text-align: center;
}
.score-groupA h3 {
  color: #173ea5;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}
.score-groupA p {
  color: #173ea5;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
}
</style> 