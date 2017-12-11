import axios from 'axios'

export const getAddressHistory = (address, token = 'ELTCOIN') => {
  return axios.get(`https://api.ethplorer.io/getAddressHistory/${address}?apiKey=freekey`).then((response) => {
      console.log(response)
      return response.data.operations      
  })
}
