let timer: ReturnType<typeof setTimeout> | null = null

/**
 * @param apiCall method reference which should be performed an API call
 * @param time delay. Default value 500 milliseconds
 * @description This helper only call the API after the user stop typing for an interval greater then the time parameter.
 */
export const debounced = (apiCall: () => void, time = 500) => {
  if (timer !== null) clearTimeout(timer)
  timer = setTimeout(() => apiCall(), time)
}
