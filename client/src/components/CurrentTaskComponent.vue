<template>
    <div v-if="currentTask" class="current-task">
        <div class="task-number"># Current Task</div>
        <div class="task-description">{{ currentTask.description }}</div>
    </div>
</template>
  
<script>
export default {
    computed: {
        currentTask() {
            return this.$store.getters.currentTask;
        }
    },
    watch: {
        currentTask() {
            return this.$store.getters.currentTask;
        }
    }
}
</script>
  
<style scoped>
.current-task {
    text-align: center;
    font-size: 12px;
    color: white;
}

.task-number {
    font-weight: bold;
    margin-bottom: 5px;
}

.task-description {
    font-size: 24px;
}
</style>
  