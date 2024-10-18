export const useCurrency = (amount) => {
    const currency  = computed ( () => {
        console.log('amount', amount , isRef(amount), amount.value)
      return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR'
      }).format(isRef(amount) ? amount.value : amount)
    } )

    return {
        currency
    }
}