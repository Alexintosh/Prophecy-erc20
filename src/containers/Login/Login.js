import React from 'react'
import { connect } from 'react-redux'
import { Page, Button, Input, Row, AlertDialog } from 'react-onsenui'
import Toolbar from '../../components/Toolbar'
import Loading from '../../components/Loading'
import { CenteredCol } from '../../components/Balance'
import TabContainer from '../Wallet/TabsContainer'
import {login, hideError, publicLogin, getCachedPKeys} from './actions'
import PublicKeyList from '../../components/PublicKeyList'
import {
  disableClaim,
  fetchTransaction,
  fetchBalance,
  fetchClaimAmount,
  fetchMarketPrice
} from '../Wallet/actions.js'

class LoginPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      wif: '',
      isLoading: false
    }

    this.hideAlertDialog = this.hideAlertDialog.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(getCachedPKeys())
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.account.account) {
      const net = this.props.net
      const pkey = nextProps.account.account.address
      this.props.dispatch(fetchMarketPrice())
      // this.props.dispatch(fetchTransaction(pkey, net))
      this.props.dispatch(fetchBalance(pkey, net))
      // this.props.dispatch(fetchClaimAmount(pkey, net))

      setTimeout(() => {
        console.log('timeout')
        this.setState({isLoading: false})
        this.props.navigator.pushPage({
          component: TabContainer,
          props: {
            key: 'walletPage'
          }
        })
      }, 2000)
    }
  }

  wifChanged (e) {
    this.setState({ wif: e.target.value })
  }

  signin () {
    this.setState({isLoading: true})
    this.props.dispatch(login(this.state.wif))
  }

  publicSignin (pkey) {
    this.setState({isLoading: true})
    this.props.dispatch(publicLogin(pkey))
    this.props.dispatch(disableClaim(true))
  }

  hideAlertDialog () {
    this.props.dispatch(hideError())
  }

  render () {
    const { wif } = this.state
    const {alertDialogShown} = this.props.account
    console.log('this.state.isLoading', this.state.isLoading)

    return (
      <Page renderToolbar={() => <Toolbar title='ELTCOIN' />}>
        <Row style={{ background: 'black'}}>
          <CenteredCol>  
            <img width="200" src="data:image/png;base64,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" />
          </CenteredCol>  
        </Row>
        <Row>
          <CenteredCol style={{ margin: '20px' }}>  
            <Input
              value={wif}
              onChange={e => this.wifChanged(e)}
              placeholder='Private Key'
              style={{ width: '100%', margin: '20px 0', background: 'black' }}
              type='text'
              modifier='material'
              float
            />
            <Button id='signin' onClick={e => this.signin(e)} modifier='large'>
              Login
            </Button>
            <Button id='forgot_btn' modifier='quiet'>
              CREATE WALLET
            </Button>
          </CenteredCol>
        </Row>

        { /*<PublicKeyList keys={this.props.cached_public_keys} onSelect={(pkey) => this.publicSignin(pkey)} /> */}

        <AlertDialog
          isOpen={alertDialogShown}
          isCancelable={false}>
          <div className='alert-dialog-title'>Warning!</div>
          <div className='alert-dialog-content'>
            Cannot load the wallet, check you private key.
          </div>
          <div className='alert-dialog-footer'>
            <button onClick={this.hideAlertDialog} className='alert-dialog-button'>
              Ok
            </button>
          </div>
        </AlertDialog>
        <Loading isOpen={this.state.isLoading} />
      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  public_key: state.account.account.address,
  cached_public_keys: state.account.cached_public_keys
})

export default connect(mapStateToProps)(LoginPage)
