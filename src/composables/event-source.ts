import ReconnectingEventSource from "reconnecting-eventsource"
import { onUnmounted, ref } from "vue"

export function useEventSource(url: string) {
  const status = ref<"CONNECTING" | "OPEN" | "CLOSED">("CONNECTING")
  const data = ref("")

  const es = new ReconnectingEventSource(url)

  es.onopen = () => {
    status.value = "OPEN"
  }

  es.onerror = () => {
    status.value = "CLOSED"
  }

  es.onmessage = (e: MessageEvent) => {
    data.value = e.data || ""
  }

  onUnmounted(() => {
    es.close()
  })

  return { status, data }
}
