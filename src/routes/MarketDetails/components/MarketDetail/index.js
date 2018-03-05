import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'moment-duration-format'
import autobind from 'autobind-decorator'
import cn from 'classnames'
import Decimal from 'decimal.js'
import { GAS_COST } from 'utils/constants'
import { marketShape, marketShareShape, marketTradeShape, gasCostsShape, ReactRouterMatchShape } from 'utils/shapes'
import { weiToEth, isMarketResolved } from 'utils/helpers'
import { collateralTokenToText } from 'components/CurrencyName'
import { decimalToText } from 'components/DecimalValue'
import MarketGraph from 'routes/MarketDetails/components/MarketGraph'
import expandableViews, { EXPAND_MY_SHARES } from 'routes/MarketDetails/components/ExpandableViews'
import Controls from './Controls'
import Details from './Details'

import config from 'config.json'

import './marketDetail.scss'

class MarketDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      marketFetchError: undefined,
    }
  }

  componentDidMount() {
    this.fetchEssentialData(!this.props.match.params.view)
    this.fetchDataTimer = setInterval(this.fetchEssentialData, config.fetchMarketTimeInterval)
    this.scrollToSharesDiv()
  }

  componentWillUnmount() {
    clearInterval(this.fetchDataTimer)
  }

  @autobind
  getAvailableView() {
    return Object.keys(expandableViews).find(view => expandableViews[view].showCondition(this.props))
  }

  scrollToSharesDiv = () => {
    const { pathname } = this.props.location
    const isMySharesView = pathname.indexOf(EXPAND_MY_SHARES) !== -1
    const shouldScroll = this.divSharesNode && isMySharesView
    if (shouldScroll) {
      const y = this.divSharesNode.offsetTop
      window.scrollTo(0, y)
    } else {
      window.scrollTo(0, 0)
    }
  }

  // Check available views on first fetch
  @autobind
  fetchEssentialData(firstFetch = false) {
    this.props
      .fetchMarket()
      .then(() => {
        this.props.fetchMarketTrades(this.props.market)

        if (isMarketResolved(this.props.market)) {
          this.props.requestGasCost(GAS_COST.REDEEM_WINNINGS, { eventAddress: this.props.market.event.address })
        }

        if (firstFetch) {
          const availableView = this.getAvailableView()
          if (availableView) {
            this.props.changeUrl(`/markets/${this.props.match.params.id}/${availableView}`)
          }
        }
      })
      .catch((err) => {
        this.setState({
          marketFetchError: err,
        })
      })

    if (this.props.hasWallet) {
      this.props.requestGasCost(GAS_COST.BUY_SHARES)
      this.props.requestGasCost(GAS_COST.SELL_SHARES)
    }

    if (this.props.defaultAccount && this.props.match.params.id !== undefined) {
      this.props.fetchMarketTradesForAccount(this.props.defaultAccount)
      this.props.fetchMarketShares(this.props.defaultAccount)
    }

    this.props.requestGasPrice()
  }

  @autobind
  handleExpand(view) {
    if (this.props.match.params.view !== view) {
      this.props.changeUrl(`/markets/${this.props.match.params.id}/${view}`)
    } else {
      this.props.changeUrl(`/markets/${this.props.match.params.id}/`)
    }
  }

  @autobind
  handleRedeemWinnings() {
    return this.props.redeemWinnings(this.props.market)
  }

  renderLoading() {
    return (
      <div className="marketDetailPage">
        <div className="container">Loading...</div>
      </div>
    )
  }

  renderExpandableContent() {
    const currentView = this.props.match.params.view || false
    if (currentView && expandableViews[currentView] && expandableViews[currentView].component) {
      const view = expandableViews[currentView]

      if (typeof view.showCondition !== 'function' || view.showCondition(this.props)) {
        const ViewComponent = view.component
        return (
          <div className="expandable__inner">
            <div className="container">
              <ViewComponent {...this.props} />
            </div>
          </div>
        )
      }
    }

    return <div />
  }

  renderInfos(market) {
    const infos = {
      Token: collateralTokenToText(market.event.collateralToken),
      Fee: `${decimalToText(market.fee, 2) / 10000} %`,
      Funding: `${decimalToText(Decimal(market.funding).div(1e18))} ${collateralTokenToText(market.event.collateralToken)}`,
      'Trading Volume': `${decimalToText(Decimal(market.tradingVolume).div(1e18))} ${collateralTokenToText(market.event.collateralToken)}`,
    }
    const showWithdrawFees =
      this.props.defaultAccount &&
      market.oracle.owner === this.props.defaultAccount &&
      new Decimal(market.collectedFees).gt(0)

    if (this.props.isModerator) {
      // Show creator String
      infos.creator = this.props.moderators[market.creator] || market.creator
    }

    if (showWithdrawFees) {
      infos['Earnings through market fees'] = `${decimalToText(weiToEth(market.collectedFees))} ${collateralTokenToText(market.event.collateralToken)}`
    }

    return (
      <div className="marketInfos col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-0">
        {Object.keys(infos).map(label => (
          <div className="marketInfo" key={label}>
            <p className="marketInfo__info marketInfo__info--value">{infos[label]}</p>
            <p className="marketInfo__info marketInfo__info--label">{label}</p>
          </div>
        ))}
      </div>
    )
  }

  render() {
    const {
      market, marketGraph, marketShares, gasCosts, gasPrice,
    } = this.props

    const { marketFetchError } = this.state
    if (marketFetchError) {
      return (
        <div className="marketDetailPage">
          <div className="container">This market could not be found.</div>
        </div>
      )
    }

    if (!market.address) {
      return this.renderLoading()
    }

    return (
      <div className="marketDetailPage">
        <div className="container">
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-sm-7 col-sm-offset-0">
              <h1 className="marketTitle__heading">{market.eventDescription.title}</h1>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <Details
              market={market}
              marketShares={marketShares}
              gasCosts={gasCosts}
              gasPrice={gasPrice}
              handleRedeemWinnings={this.handleRedeemWinnings}
            />
            {this.renderInfos(market)}
          </div>
        </div>
        <Controls handleExpand={this.handleExpand} {...this.props} />
        <div
          ref={(div) => {
            this.divSharesNode = div
          }}
          className="expandable"
        >
          {this.renderExpandableContent()}
        </div>
        <MarketGraph data={marketGraph} market={market} />
      </div>
    )
  }
}

MarketDetail.propTypes = {
  hasWallet: PropTypes.bool,
  params: PropTypes.shape({
    id: PropTypes.string,
    view: PropTypes.string,
  }),
  requestGasPrice: PropTypes.func,
  marketShares: PropTypes.objectOf(marketShareShape),
  marketTrades: PropTypes.arrayOf(marketTradeShape),
  marketGraph: PropTypes.arrayOf(PropTypes.object),
  defaultAccount: PropTypes.string,
  market: marketShape,
  changeUrl: PropTypes.func,
  fetchMarket: PropTypes.func,
  fetchMarketShares: PropTypes.func,
  fetchMarketTrades: PropTypes.func,
  fetchMarketTradesForAccount: PropTypes.func,
  redeemWinnings: PropTypes.func,
  requestGasCost: PropTypes.func,
  isModerator: PropTypes.bool,
  moderators: PropTypes.shape({
    address: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  gasCosts: gasCostsShape,
  gasPrice: PropTypes.instanceOf(Decimal),
  match: ReactRouterMatchShape,
}

export default MarketDetail
