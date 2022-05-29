import { onUnmounted, ref } from "vue"

type EventSourceStatus = "CONNECTING" | "OPEN" | "CLOSED"

export function useEventSource(url: string) {
  const status = ref<EventSourceStatus>("CONNECTING")
  const data = ref("")

  const createEventSource = () => {
    const es = new EventSource(url)

    es.onopen = () => {
      status.value = "OPEN"
    }

    es.onerror = () => {
      status.value = "CLOSED"
      if (es.readyState === EventSource.CLOSED) {
        es.close()
        setTimeout(createEventSource, 1000)
      }
    }

    es.onmessage = (e) => {
      data.value = e.data || ""
    }

    onUnmounted(() => {
      es.close()
    })
  }

  createEventSource()

  return { status, data }
}
