import LocalStorage from '../../utils/LocalStorage'
import uniq from 'lodash/uniq'
const Wallet = window.ethers.Wallet;
const utils = window.ethers.utils;

import {
  LOGIN_REQ,
  LOGIN_HIDE_ERROR,
  LOGIN_PUBLIC,
  STORAGE_PUBLIC_KEYS,
  FETCH_STORAGE_PUBLIC_KEYS,
  LOGGED_OUT
} from './constants'

const initialState = {
  isLogged: false,
  account: false,
  isLoading: false,
  alertDialogShown: false,
  wif: false,
  cached_public_keys: []
}

export default function account (state = initialState, action) {
  switch (action.type) {
    case LOGIN_PUBLIC:
      return {
        ...state,
        isLogged: false,
        account: {
          ...state.account,
          address: action.pkey
        }
      }
    case LOGIN_REQ:
      const account = doLogin(action.wif)
      cachePkey(account)

      return {
        ...state,
        account: account,
        isLogged: account,
        alertDialogShown: !account,
        wif: account ? action.wif : false,
        isLoading: true
      }

    case FETCH_STORAGE_PUBLIC_KEYS:
      return {
        ...state,
        cached_public_keys: LocalStorage.getObject(STORAGE_PUBLIC_KEYS, [])
      }

    case LOGIN_HIDE_ERROR:
      return {
        ...state,
        alertDialogShown: false
      }

    case LOGGED_OUT:
      return {
        ...initialState,
        cached_public_keys: LocalStorage.getObject(STORAGE_PUBLIC_KEYS, [])
      }

    default:
      return state
  }
}

function cachePkey (account) {
  if (account) {
    const pkeys = LocalStorage.getObject(STORAGE_PUBLIC_KEYS, [])
    pkeys.push(account.address)
    LocalStorage.setObject(STORAGE_PUBLIC_KEYS, uniq(pkeys))
  }
}

function doLogin (wif) {
  return new Wallet('0x'+wif)
}
