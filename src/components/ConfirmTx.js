import React from 'react'
import { Page, Modal, Button } from 'react-onsenui'
import Spinner from 'react-spinkit'
import { Balance, CenteredCol } from './Balance'
import { AccountInfo } from './AccountInfo'

export default class ConfirmTx extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  componentDidMount () {
    this.setState({
      isOpen: this.props.isOpen
    })
  }

  componentWillReceiveProps (nextProps) {
      if(nextProps.isOpen){

      }
    this.setState({
      isOpen: nextProps.isOpen
    })

  }

  render () {
    console.log(this.props);
    const {isOpen} = this.state
    return (
      <div>
        { isOpen
        ? <Page>
            <AccountInfo
                label='Destination address:'
                publicKey={this.props.to}
                showIcon={false}
            />
            <div style={{backgroundColor: '#F0ECEB', paddingTop: '10px', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
                <Balance 
                    NEO_PRICE={this.props.tokenValue}
                    ELTCOIN={this.props.amount}/>

                <CenteredCol>
                    <Button modifier='large' onClick={() => this.props.onConfirmation()}>CONFIRM</Button>    
                    <h4>or</h4>
                    <Button modifier='large' onClick={() => this.setState({isOpen: false})}>CANCEL</Button>    
                </CenteredCol>

            </div>
        </Page>
        : '' }
      </div>
    )
  }
}
