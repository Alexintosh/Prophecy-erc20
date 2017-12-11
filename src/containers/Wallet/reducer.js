import {
  SET_TRANSACTION_HISTORY,
  SET_BALANCE,
  SET_MARKET_PRICE
} from './constants'

const initialState = {
  ELTCOIN: 0,
  transactions: [],
  price: {
    ELTCOIN: 0,
    ETH: 0
  }
}

export default function wallet (state = initialState, action) {
  switch (action.type) {
    case SET_TRANSACTION_HISTORY:
      return {
        ...state,
        transactions: action.transactions
      }

    case SET_BALANCE:
      return {
        ...state,
        ELTCOIN: action.ELTCOIN
      }

    case SET_MARKET_PRICE:
      return {
        ...state,
        price: {
          neo: action.neo,
          gas: action.gas
        }
      }

    default:
      return state
  }
}
