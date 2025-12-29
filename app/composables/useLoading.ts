export const useInitialLoading = () => {
  const isInitialLoading = useState('initialLoading', () => true)

  const setLoading = (value: boolean) => {
    isInitialLoading.value = value
  }

  return {
    isInitialLoading: readonly(isInitialLoading),
    setLoading
  }
}


