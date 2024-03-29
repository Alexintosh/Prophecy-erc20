import React from 'react'
import {notification} from 'onsenui'
import { Page, Col, Row, Icon, Button, Carousel, CarouselItem, Input } from 'react-onsenui'
import styled from 'styled-components'
import { connect } from 'react-redux'
import startsWith from 'lodash/startsWith'
import IF from '../../components/If'
import ConfirmTx from '../../components/ConfirmTx'
import { CenteredCol } from '../../components/Balance'
import Spinner from 'react-spinkit'
import {
  showToast,
  hideToast
} from '../App/actions.js'

import {
  sendTransaction
} from './actions.js'

export const Num = styled(Col)`
  font-size:2em;
  padding:20px 20px;
  text-align: center;  
`

export const ScreenWrapper = styled(CarouselItem)`
  background-color: #ccc
`

export const Placeholder = styled.span`
  color: rgba(255,255,255,0.5);
`

export const AssetsCaroseul = styled(Carousel)`
  margin-bottom: 100px;
  text-align: 'center';
  height: 250px;
  position: 'relative';
  padding: '20px 0';
  color: #fff;
`

export const Screen = styled(Col)`
  font-size:2.5em;
  padding:20px 0px;
  text-align: center;
`

const initialState = {
  step: 0,
  confirmScreenShown: false,
  transaction: {
    started: false,
    pending: false,
    asset: 'NEO',
    to: '',
    amount: 0
  },
  assets: [
    {
      label: 'ELTCOIN',
      fractionable: true,
      bg: '#F1948A'
    },
    {
      label: 'ETH',
      fractionable: true,
      bg: '#FFBACC'
    }
  ],
  index: 0,
  amount: false
}

class SendTab extends React.Component {
  constructor (props) {
    super(props)

    this.state = initialState
    this.changeAsset = this.changeAsset.bind(this)
    this.addressChanged = this.addressChanged.bind(this)
    this.numberPressed = this.numberPressed.bind(this)
    this.sendAsset = this.sendAsset.bind(this)
  }

  componentDidMount () {

  }

  addressChanged (e) {
    this.setState({
      ...this.state,
      transaction: {
        ...this.state.transaction,
        to: e.target.value
      }
    })
  }

  changeAsset (e) {
    if (e.activeIndex === 0 && this.state.amount) {
      const amount = parseInt(this.state.amount)
      if (amount <= 0) {
        this.setState({
          index: e.activeIndex
        })
        return false
      }
    }

    this.setState({index: e.activeIndex})
  }

  componentWillReceiveProps (nextProps) {
  }

  sendAsset (amout) {
    const selected = this.state.assets[this.state.index].label
    this.props.dispatch(sendTransaction(this.state.transaction.to, amout, selected))
    this.setState({
      step: 1,
      confirmScreenShown: false
    })

    setTimeout(() => {
      this.setState({
        step: 2,
        confirmScreenShown: false
      })
      setTimeout(() => {
        this.setState(initialState)
      }, 2500)
    }, 10000) 
  }

  numberPressed (num) {
    const prev = this.state.amount
    const isFractionable = this.state.assets[this.state.index].fractionable

    if (num === '.' && !isFractionable) {
      return false
    } else if (num === '.' && isFractionable && !prev) {
      num = '0.'
    } else if (num === '.' && isFractionable && prev && this.state.amount.includes('.')) {
      return false
    }

    if (num === 'DEL') {
      if (!prev) {
        return false
      }
      let deleted = `${prev}`.slice(0, -1)

      if (deleted.length === 0) {
        deleted = false
      }
      this.setState({amount: deleted})
      return false
    }

    if (num === 0 && !isFractionable && !prev) {
      return false
    }

    if (num === 0 && isFractionable && !prev) {
      num = '0.'
    } else {
      if (startsWith(`${prev}${num}`, '0.000')) {
        this.props.dispatch(showToast('Amount too low'))
        setTimeout(() => {
          this.props.dispatch(hideToast())
        }, 2000)
        return false
      }
    }

    let newSum
    if (!prev) {
      newSum = `${num}`
    } else {
      newSum = `${prev}${num}`
    }

    this.setState({
      amount: newSum
    })
  }

  getContent () {
  }

  addressOnChange () {

  }

  render () {
    // TODO animation when price changes, numbers going progressively
    let gasNumber
    let placeholder = <Placeholder>0</Placeholder>
    if (this.state.amount[this.state.amount.length - 1] === '.') {
      gasNumber = this.state.amount
      placeholder = <Placeholder>0</Placeholder>
    } else if (!this.state.amount) {
      gasNumber = <Placeholder>0</Placeholder>
      placeholder = ''
    } else if (this.state.amount === '0') {
      gasNumber = <Placeholder>0</Placeholder>
      placeholder = ''
    } else {
      gasNumber = this.state.amount
    }

    const {step} = this.state
    return (
      <Page>
        <IF what={step === 0}>
          <Carousel onPostChange={this.changeAsset} index={this.state.index} fullscreen swipeable autoScroll overscrollable style={{marginBottom: '10px', textAlign: 'center', height: '200px', position: 'relative', color: '#fff'}}>
            <CarouselItem key={0} style={{ background: '#f29e2e' }}>
              <Row>
                <Screen>
                  {gasNumber || <Placeholder>0</Placeholder>} ELTCOIN
                  </Screen>
              </Row>
              <Row>
                <Screen>
                    $ {this.state.amount ? (this.props.price.neo * parseFloat(this.state.amount)).toFixed(2) : 0}
                </Screen>
              </Row>
            </CarouselItem>
            <CarouselItem key={1} style={{ background: '#2C9FA3' }}>
              <Row>
                <Screen>
                  {gasNumber}{placeholder} ETH
                  </Screen>
              </Row>
              <Row>
                <Screen>
                    $ {this.state.amount ? (this.props.price.gas * parseFloat(this.state.amount)).toFixed(2) : 0}
                </Screen>
              </Row>
            </CarouselItem>
            <div style={{
              textAlign: 'center',
              fontSize: '20px',
              position: 'absolute',
              bottom: '10px',
              left: '0px',
              right: '0px'
            }}>
              {[1, 2].map((item, index) => (
                <span key={index} style={{cursor: 'pointer'}}>
                  {this.state.index === index ? '\u25CF' : '\u25CB'}
                </span>
              ))}
            </div>
          </Carousel>
          <Row>
            <Input
              onChange={(e) => this.addressChanged(e)}
              placeholder='Recipient Address'
              style={{ width: '100%', margin: '20px 0', margin: '20px' }}
              type='text'
              modifier='material'
              float
              />
          </Row>
          <Row>
            <Row>
              <Num onClick={() => this.numberPressed(1)}>1</Num>
              <Num onClick={() => this.numberPressed(2)}>2</Num>
              <Num onClick={() => this.numberPressed(3)}>3</Num>
            </Row>
            <Row>
              <Num onClick={() => this.numberPressed(4)}>4</Num>
              <Num onClick={() => this.numberPressed(5)}>5</Num>
              <Num onClick={() => this.numberPressed(6)}>6</Num>
            </Row>
            <Row>
              <Num onClick={() => this.numberPressed(7)}>7</Num>
              <Num onClick={() => this.numberPressed(8)}>8</Num>
              <Num onClick={() => this.numberPressed(9)}>9</Num>
            </Row>
            <Row>
              <Num onClick={() => this.numberPressed('.')}>.</Num>
              <Num onClick={() => this.numberPressed(0)}>0</Num>
              <Num onClick={() => this.numberPressed('DEL')}><Icon icon='ion-android-arrow-back' size={20} /></Num>
            </Row>
          </Row>
          <Row>
            {/*<Button modifier='large' onClick={() => this.sendAsset(this.state.amount)}>CONTINUE</Button>*/}
            <Button modifier='large' onClick={() => this.setState({confirmScreenShown: true})}>Next</Button>
          </Row>
        </IF>

        <IF what={step === 1} style={{ margin: '20px auto'}}>
          <h4 style={{ padding: '20px', fontSize: '22px'}}>Sending transaction to the Ethereum network...</h4>

          <div style={{ margin: '20px auto', width: '30px', height: '38px' }}>
            <Spinner name='folding-cube' color='black' />
          </div>
        </IF>

        <IF what={step === 2} style={{ margin: '20px auto'}}>
          <CenteredCol>
            <img width="200" src="https://cdn.dribbble.com/users/159981/screenshots/2112264/checkmark.gif"/>
          </CenteredCol>
        </IF>

        <ConfirmTx
          amount={this.state.amount}
          to={this.state.transaction.to}
          tokenValue={this.props.price.gas}
          asset={this.state.assets[this.state.index].label}
          onConfirmation={() => this.sendAsset(this.state.amount)}
          isOpen={this.state.confirmScreenShown} />
      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  wallet: state.wallet,
  price: state.wallet.price,
  public_key: state.account.account.address
  // TODO check state transaction and reset values.
})

export default connect(mapStateToProps)(SendTab)
