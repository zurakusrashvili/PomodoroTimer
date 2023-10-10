<template>
    <v-dialog v-model="showSettingsDialog" max-width="500px">
        <v-card>
            <v-toolbar color="white" dark>
                <v-toolbar-title>Timer Settings</v-toolbar-title>
                <v-btn icon @click="showSettingsDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text>
                <v-row>
                    <v-col cols="4">
                        <v-text-field class="sessionLabels" v-model.number="workSessionTimeInMinutes" label="Work Session"
                            min="0" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field class="sessionLabels" v-model.number="shortBreakDurationInMinutes"
                            label="Short Break " min="0" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field class="sessionLabels" v-model.number="longBreakDurationInMinutes" label="Long Break "
                            min="0" type="number"></v-text-field>
                    </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-row>
                    <v-col cols="6" class="checkBx">
                        <v-row align="center">
                            <v-col cols="8"><span>Auto Start Break?</span></v-col>
                            <v-col cols="4"><v-switch v-model="localTimerSettings.autoStartBreak"></v-switch></v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="6" class="checkBx">
                        <v-row align="center">
                            <v-col cols="8"><span>Auto Start Work Session?</span></v-col>
                            <v-col cols="4"><v-switch v-model="localTimerSettings.autoStartWorkSession"></v-switch></v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-row>
                    <v-col cols="6" class="checkBx">
                        <v-row align="center">
                            <v-col cols="8"><span>Ticking Sound</span></v-col>
                            <v-col cols="4"><v-switch v-model="localTimerSettings.tickingSoundOn"></v-switch></v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="6" class="checkBx">
                        <v-row align="center">
                            <v-col cols="8"><span>Alarm sound</span></v-col>
                            <v-col cols="4"><v-switch v-model="localTimerSettings.alarmSoundOn"></v-switch></v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-text-field v-model.number="localTimerSettings.sessionsBeforeLongBreak" label="Sessions before long break"
                    min="1"></v-text-field>
                <v-divider></v-divider>

            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="saveSettings">Save</v-btn>
                <v-btn text @click="showSettingsDialog = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import TimerStateService from "@/services/TimerStateService";
import SettingsService from "../services/SettingsService";


export default {
    data() {
        return {
            showSettingsDialog: false,
            localTimerSettings: { ...this.$store.getters.timerSettings }
        };
    },
    watch: {
        showSettingsDialog(newVal) {
            if (newVal) {
                this.localTimerSettings = { ...this.$store.getters.timerSettings };
            }
        }
    },
    computed: {
        workSessionTimeInMinutes: {
            get() {
                return this.localTimerSettings.workSessionDuration / 60;
            },
            set(value) {
                this.localTimerSettings.workSessionDuration = value * 60;
            }
        },
        shortBreakDurationInMinutes: {
            get() {
                return this.localTimerSettings.shortBreakDuration / 60;
            },
            set(value) {
                this.localTimerSettings.shortBreakDuration = value * 60;
            }
        },
        longBreakDurationInMinutes: {
            get() {
                return this.localTimerSettings.longBreakDuration / 60;
            },
            set(value) {
                this.localTimerSettings.longBreakDuration = value * 60;
            }
        }
    },

    methods: {
        openDialog() {
            this.localTimerSettings = { ...this.$store.getters.timerSettings };
            this.showSettingsDialog = true;
        },
        closeDialog() {
            this.showSettingsDialog = false;
        },
        async saveSettings() {
            this.$store.commit('updateTimerSettings', this.localTimerSettings);
            try {
                if (this.$store.getters.loggedIn) {
                    await SettingsService.updateUserSettings(this.localTimerSettings);
                } else {
                    localStorage.setItem('timerSettings', JSON.stringify(this.localTimerSettings))
                }
                const timerData = {
                    timerType: this.$store.getters.currentTimer,
                    taskId: this.$store.getters.currentTask?.id,
                    secondsRemaining: this.$store.getters.currentTimer == 0 ? this.localTimerSettings.workSessionDuration : this.$store.getters.currentTimer == 1 ? this.localTimerSettings.shortBreakDuration : this.localTimerSettings.longBreakDuration
                }
                await this.saveTimerState(timerData);
            } catch (error) {
                console.error("Failed to update settings:", error);
            }

            this.closeDialog();
        },
        async saveTimerState(timerData) {
            if (this.$store.getters.loggedIn) {
                await TimerStateService.saveOrUpdateTimerState(timerData);
                this.$store.commit('setTimerState', timerData)
            } else {
                localStorage.setItem("timerState", JSON.stringify(timerData))
            }
        },
    }
};
</script>


<style>
@media only screen and (max-width: 390px) {
    .v-dialog>.v-overlay__content {
        max-height: calc(100% - 48px);
        width: calc(100% - 5px);
        max-width: calc(100% - 48px);
        margin: 24px 0px;
        display: flex;
        flex-direction: column;

        .checkBx {
            font-size: 14px;

            .v-selection-control__input {
                width: 20px;
                height: 20px;
            }
        }

        .v-card {
            .v-card-text {
                padding: 0px 10px;
            }
        }

    }
}
</style>