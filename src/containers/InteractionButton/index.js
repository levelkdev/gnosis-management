import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cn from 'classnames'
import { upperFirst } from 'lodash'

import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'
import LoadingIndicator from 'components/LoadingIndicator'
import { isGnosisInitialized } from 'selectors/blockchain'
import {
  isConnectedToCorrectNetwork,
  isOnWhitelist,
  checkWalletConnection,
  getTargetNetworkId,
} from 'integrations/store/selectors'
import { ETHEREUM_NETWORK_IDS } from 'integrations/constants'
import style from './interactionButton.scss'

const cx = cn.bind(style)

class InteractionButton extends Component {
  constructor() {
    super()

    this.state = { loading: false }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {
      className,
      onClick,
      hasWallet,
      correctNetwork,
      gnosisInitialized,
      whitelistRequired,
      whitelisted,
      children,
      type,
      disabled,
      targetNetworkId,
      loading,
    } = this.props

    if (whitelistRequired && !whitelisted) {
      return null
    }

    // "you need a wallet"
    const walletError = !hasWallet || !gnosisInitialized

    // "you are on the wrong chain"
    const networkError = !correctNetwork

    // loading from props or uninitialized gnosisjs
    const isLoading = loading || !gnosisInitialized || this.state.loading

    // disabled from props or wallet error or network error
    const isDisabled = disabled || walletError || networkError

    const classNames = cx('interactionButton', className, { disabled: isDisabled }, { loading: isLoading })

    const onClickHandler = (e) => {
      if (isDisabled) {
        e.preventDefault()
        return
      }

      if (typeof onClick === 'function') {
        const ret = onClick()

        if (typeof ret === 'object' && ret.constructor.name === 'Promise') {
          this.setState({ loading: true })
          ret
            .then(() => {
              if (this.mounted) this.setState({ loading: false })
            })
            .catch(() => {
              if (this.mounted) this.setState({ loading: false })
            })
        }
      }
    }

    const btn = (
      <button className={classNames} type={type || 'button'} onClick={onClickHandler} disabled={isDisabled}>
        <div className="interactionButton__inner">{children}</div>
      </button>
    )

    if (isLoading) {
      return (
        <button className={classNames} type="button" disabled>
          <div className="interactionButton__inner">{children}</div>
          <LoadingIndicator width={28} height={28} className={cx('interactionButtonLoading')} />
        </button>
      )
    }

    if (walletError) {
      return <Tooltip overlay="You need a wallet connected in order to create a market">{btn}</Tooltip>
    }

    if (networkError) {
      const wrongNetworkText = `You are connected to the wrong chain. You can only interact using ${upperFirst(ETHEREUM_NETWORK_IDS[targetNetworkId].toLowerCase())} network.`
      return <Tooltip overlay={wrongNetworkText}>{btn}</Tooltip>
    }

    return btn
  }
}

InteractionButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  hasWallet: PropTypes.bool,
  correctNetwork: PropTypes.bool,
  gnosisInitialized: PropTypes.bool,
  whitelisted: PropTypes.bool,
  whitelistRequired: PropTypes.bool,
  children: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  targetNetworkId: PropTypes.string,
}

InteractionButton.defaultProps = {
  className: '',
  onClick: () => {},
  hasWallet: false,
  correctNetwork: false,
  gnosisInitialized: false,
  whitelisted: false,
  whitelistRequired: false,
  children: <div />,
  type: 'button',
  disabled: true,
  loading: true,
  targetNetworkId: 0,
}

export default connect(state => ({
  hasWallet: checkWalletConnection(state),
  gnosisInitialized: isGnosisInitialized(state),
  correctNetwork: isConnectedToCorrectNetwork(state),
  targetNetworkId: getTargetNetworkId(state),
  whitelisted: isOnWhitelist(state),
}))(InteractionButton)
