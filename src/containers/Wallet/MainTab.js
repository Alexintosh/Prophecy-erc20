import React from 'react'
import { Page } from 'react-onsenui'
import QRCode from 'qrcode-react'
import TransactionList from '../../components/TransactionList'

import { Balance, CenteredCol } from '../../components/Balance'
// import BalanceChart from '../../components/BalanceChart'
// import { Separator } from '../../components/Separator'
import { AccountInfo } from '../../components/AccountInfo'
import {
  showToast
} from '../App/actions.js'

import {
  fetchTransaction,
  fetchBalance,
  fetchMarketPrice
} from './actions'
import { connect } from 'react-redux'

class MainTab extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      state: 'initial'
    }

    this.refresh = this.refresh.bind(this)
    this.copyAddress = this.copyAddress.bind(this)
  }

  componentDidMount () {
    // this.refresh()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.net !== this.props.net) {
      this.refresh(nextProps.net)
    }
  }

  componentDidUpdate () {
  }

  copyAddress () {
    try {
      window.cordova.plugins.clipboard.copy(this.props.public_key, () => {
        this.props.dispatch(showToast('Public Key Copied!'))
      }, () => {
        this.props.dispatch(showToast('Error while copying'))
      })
    } catch (e) {
      throw new Error(e)
    }
  }

  refresh (net = this.props.net) {
    this.props.dispatch(fetchMarketPrice())
    this.props.dispatch(fetchTransaction(this.props.public_key, net))
    this.props.dispatch(fetchBalance(this.props.public_key, net))
  }

  render () {
    const transactions = [] // this.props.wallet.transactions.slice(0, 5)

    return (
      <Page key='MainTab'>
        <AccountInfo
          publicKey={this.props.public_key}
          onClick={this.copyAddress}
           />

        <div style={{backgroundColor: '#F0ECEB', paddingTop: '10px', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
          
          <CenteredCol>
            <QRCode className='qrcode' value={this.props.public_key}
              size={100}
              fgColor='black'
              logo='https://files.coinmarketcap.com/static/img/coins/32x32/eltcoin.png'
              bgColor='#F0ECEB' />
          </CenteredCol>
          <Balance
            public_key={this.props.public_key}
            ELTCOIN={this.props.balance.ELTCOIN}
            NEO_PRICE={this.props.marketPrice.neo}
            GAS_PRICE={this.props.marketPrice.gas}
            onRefresh={this.refresh} />

        </div>

        { /* <BalanceChart data={data} /> */ }

        <TransactionList history={transactions} />

      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  wallet: state.wallet,
  public_key: state.account.account.address,
  claim: state.wallet.claimMetadata,
  marketPrice: state.wallet.price,
  net: state.app.net,
  balance: {
    ELTCOIN: state.wallet.ELTCOIN
  }
})

export default connect(mapStateToProps)(MainTab)
