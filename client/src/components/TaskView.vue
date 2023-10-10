<template>
    <CurrentTaskComponent></CurrentTaskComponent>

    <div class="taskDiv">
        <v-row>
            <v-col cols="12">
                <h1 class="Task-header">Tasks</h1>
                <v-divider class="custom-divider"></v-divider>
            </v-col>
        </v-row>

        <v-row v-for="(task, index) in tasks" :key="index"
            :class="{ 'active': this.$store.getters.currentTask?.id === task.id, 'completed': task.completedSessions == task.sessions }" class="taskRow">
            <v-col cols="12" @click="selectTask(task)" class="task">
                <v-card>
                    <v-card-text>
                        <v-row align="center" class="pa-0">
                            <v-col :cols="11">{{ task.description }} - {{ task.completedSessions }}/{{ task.sessions }} Work
                                Sessions</v-col>
                            <v-col :cols="1" class="pa-0">
                                <v-icon @click.stop="openEditForm(task, index)">mdi-dots-vertical</v-icon>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>


        <v-row>
            <v-col cols="12">
                <v-btn @click="openAddForm">
                    <v-icon left>mdi-plus</v-icon>
                    Add Task
                </v-btn>
            </v-col>
        </v-row>

        <v-dialog v-model="showAddForm" max-width="500px">
            <v-card>
                <v-card-title>Add Task</v-card-title>
                <v-card-text>
                    <v-text-field v-model="formTask.description" label="Task Description" outlined></v-text-field>
                    <v-text-field v-model="formTask.sessions" label="Work Session Count" type="number"
                        outlined></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="cancel">Cancel</v-btn>
                    <v-btn @click="saveTask" color="primary">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="showEditForm" max-width="500px">
            <v-card>
                <v-card-title>Edit Task</v-card-title>
                <v-card-text>
                    <v-text-field v-model="formTask.description" label="Task Description" outlined></v-text-field>
                    <v-text-field v-model="formTask.sessions" label="Sessions count" type="number" outlined></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="deleteTask" color="error">Delete</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="cancel">Cancel</v-btn>
                    <v-btn @click="saveTask" color="primary">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import taskService from "@/services/TasksService";
import CurrentTaskComponent from "./CurrentTaskComponent.vue";
import TimerStateService from "@/services/TimerStateService";


export default {
    components: {
        CurrentTaskComponent
    },
    computed: {
        currentTask() {
            return this.$store.getters.currentTask;
        }
    },
    data() {
        return {
            showAddForm: false,
            showEditForm: false,
            selectedTask: null,
            formTask: {
                description: "",
                sessions: 1,
                completedSessions: 0
            },
            tasks: this.$store.getters.tasks,
            editingTaskIndex: null
        };
    },
    methods: {



        selectTask(task) {
            this.$store.commit('setCurrentTask', task);
        },
        async handleUserSet(loggedIn) {
            try {
                if (loggedIn) {
                    const tasks = await taskService.getUserTasks();
                    const timerState = await TimerStateService.getTimerStateByUser();

                    if (tasks && tasks.length > 0) {
                        this.$store.commit('setTasks', tasks);
                        console.log(this.$store.getters.tasks)
                        this.tasks = tasks;
                        if (timerState) {
                            this.$store.commit('setCurrentTask', this.tasks.find(t => t.id == timerState.taskId));
                            this.$store.commit('setTimerState', timerState)
                        }
                    }
                }
                else {
                    let localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
                    let timerState = JSON.parse(localStorage.getItem('timerState') || 'null');
                    this.$store.commit('setTasks', localTasks);
                    this.tasks = localTasks;
                    if (timerState) {
                        this.$store.commit('setCurrentTask', this.tasks.find(t => t.id == timerState.taskId));
                    }
                }
            }
            catch (error) {
                console.error("Error fetching tasks:", error);
            }
        },
        async openAddForm() {
            this.showAddForm = true;
        },
        openEditForm(task, index) {
            this.formTask = { ...task };
            console.log(this.formTask.sessions);
            this.editingTaskIndex = index;
            console.log(this.editingTaskIndex, this.$store.getters.tasks[this.editingTaskIndex]);
            this.showEditForm = true;
        },
        async deleteTask() {
            try {
                if (this.$store.getters.loggedIn) {
                    await taskService.deleteTask(this.$store.getters.tasks[this.editingTaskIndex].id);
                    const tasks = await taskService.getUserTasks();
                    this.$store.commit('setTasks', tasks);
                    this.tasks = tasks;
                }
                else {
                    let localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
                    localTasks.splice(this.editingTaskIndex, 1);
                    this.tasks = [...localTasks];
                    localStorage.setItem('localTasks', JSON.stringify(localTasks));
                    this.$store.commit('setTasks', localTasks);
                }
            }
            catch (error) {
                console.error("Error deleting task:", error);
            }
            finally {
                this.cancel();
            }
        },
        async saveTask() {
            try {
                if (this.$store.getters.loggedIn) {
                    if (this.editingTaskIndex !== null) {
                        await taskService.updateTask(this.$store.getters.tasks[this.editingTaskIndex].id, {
                            description: this.formTask.description,
                            sessions: this.formTask.sessions,
                            completedSessions: this.formTask.completedSessions
                        });
                    }
                    else {
                        await taskService.addTask({
                            description: this.formTask.description,
                            sessions: this.formTask.sessions,
                            completedSessions: this.formTask.completedSessions
                        });
                    }
                    const tasks = await taskService.getUserTasks();
                    this.$store.commit('setTasks', tasks);
                    this.tasks = tasks;
                }
                else {
                    let localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
                    if (this.editingTaskIndex !== null) {
                        localTasks[this.editingTaskIndex] = this.formTask;
                    }
                    else {
                        localTasks.push(this.formTask);
                    }
                    localStorage.setItem('localTasks', JSON.stringify(localTasks));
                    this.$store.commit('setTasks', localTasks);
                    this.tasks = [...localTasks];
                }
            }
            catch (error) {
                console.error("Error saving task:", error);
            }
            finally {
                this.cancel();
            }
        },
        cancel() {
            this.showAddForm = false;
            this.showEditForm = false;
            this.formTask = {
                description: "",
                sessions: 1,
                completedSessions: 0
            };
            this.editingTaskIndex = null;
        }
    },

    async mounted() {
        try {
            if (this.$store.getters.loggedIn) {
                const timerState = await TimerStateService.getTimerStateByUser();
                const tasks = await taskService.getUserTasks();
                if (tasks && tasks.length > 0) {
                    this.$store.commit('setTasks', tasks);
                    this.tasks = tasks;
                    if (timerState.taskId) {
                        this.$store.commit('setCurrentTask', tasks.find(t => t.id == timerState.taskId));
                    }
                }
            }
            else {
                let localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
                this.$store.commit('setTasks', localTasks);
                this.tasks = localTasks;
            }
        }
        catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }
};
</script>

<style lang="scss">
.taskDiv {
    width: 550px;
    max-width: 100%;
    height: 350px;
    margin: 0 auto;
    margin-top: 20px;
    overflow-y: scroll;
    position: relative;

    &::-webkit-scrollbar {
        display: none;
    }

    .custom-divider {
        background-color: white;
        height: 3px;
    }


    .Task-header {
        font-size: 25px;
        color: white;
        font-weight: bold;
    }

    .taskRow {
        position: relative;

        .task {
            cursor: pointer;
        }

        &.active::before {
            content: "";
            position: absolute;
            height: 74%;
            width: 5px;
            background: black;
            left: 12px;
            top: 10px;
            z-index: 99;
            border-radius: 8px;
        }

        &.completed::before{
            background: rgb(23, 200, 23);
        }
    }
}
</style>