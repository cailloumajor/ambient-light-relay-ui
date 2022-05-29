<template>
  <div font-sans h-full flex text-center select-none>
    <div ma>
      <div v-if="!isHttp">
        <p>You are visiting this site via https protocol.</p>
        <p>It can not work due to mixed active content.</p>
        <p>Use <a :href="httpLink()">this link</a> to use http protocol</p>
      </div>
      <div v-else-if="eventsourceStatus !== 'OPEN'">
        Waiting for ambient light relay to be connected...
      </div>
      <div v-else>
        <div mb-4>
          Measured illuminance: <span font-bold>{{ measured }}</span> lux
        </div>
        <div mb-4>
          <label for="threshold" mr-2>Threshold</label>
          <input
            v-model="settings.threshold"
            :class="[$style.numberInput, thresholdValid ? '' : 'bg-red']"
            id="threshold"
            type="number"
            appearance-none
          />
        </div>
        <div mb-4>
          <label for="hysteresis" mr-2>Upper hysteresis</label>
          <input
            v-model="settings.hysteresis"
            :class="[$style.numberInput, hysteresisValid ? '' : 'bg-red']"
            id="hysteresis"
            type="number"
            appearance-none
          />
        </div>
        <div mb-4>
          <button @click="postSettings" :disabled="!changeEnabled" pa-2>
            CHANGE
          </button>
          <span inline-block ml-2 w-8>{{ postStatus }}</span>
        </div>
        <div v-if="postError" text-red>{{ postError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventSource } from "@vueuse/core"
import { $fetch } from "ohmyfetch"
import { joinURL } from "ufo"
import { computed, reactive, ref, watch } from "vue"

const baseURL = "http://192.168.4.1"

const isHttp = window.location.protocol === "http:"
const httpLink = () => {
  const url = new URL(window.location.href)
  url.protocol = "http:"
  return url.href
}

const { status: eventsourceStatus, data: measured } = useEventSource(
  joinURL(baseURL, "/events")
)

const changeEnabled = ref(true)
const postStatus = ref("")
const postError = ref("")

const settings = reactive({
  threshold: 0,
  hysteresis: 0,
})

const isValid = (n: number) => isFinite(parseInt(n.toString())) && n >= 0

const thresholdValid = computed(() => isValid(settings.threshold))
const hysteresisValid = computed(() => isValid(settings.hysteresis))

const getSettings = async () => {
  const fetchedSettings = await $fetch("/settings", { baseURL })
  Object.assign(settings, fetchedSettings)
}

const postSettings = async () => {
  postStatus.value = ""
  postError.value = ""
  changeEnabled.value = false
  try {
    await $fetch("/settings", { baseURL, method: "PUT", body: settings })
    postStatus.value = "✔️"
    postError.value = ""
  } catch (err) {
    postStatus.value = "❌"
    postError.value = (err as Error).message
  } finally {
    await getSettings()
    changeEnabled.value = true
  }
}

watch(eventsourceStatus, async (newStatus) => {
  if (newStatus !== "OPEN") return
  postStatus.value = ""
  postError.value = ""
  await getSettings()
})
</script>

<style module>
.numberInput {
  width: 5ch;
}
</style>

<style scoped>
input,
button,
button + span {
  font-size: x-large;
}
</style>

<style>
html,
body,
#app {
  height: 100%;
}
</style>
