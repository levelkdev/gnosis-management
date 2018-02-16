import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { List } from 'immutable'
import { processMarketResponse } from '../actions/fetchMarkets'
import marketReducer, { REDUCER_ID } from './market'
import { oneMarketData, twoMarketData, realData, MarketFactory } from './market.builder'

describe('Market List Actions', () => {
  let store
  beforeEach(() => {
    const reducers = combineReducers({
      [REDUCER_ID]: marketReducer,
    })
    const middlewares = [
      thunk,
    ]
    const enhancers = [
      applyMiddleware(...middlewares),
    ]
    store = createStore(reducers, compose(...enhancers))
  })


  it('should return empty Immutable list when no markets are available', () => {
    // GIVEN
    const emptyResponse = { }

    // WHEN
    processMarketResponse(store.dispatch, emptyResponse)

    // THEN
    const emptyList = List([])
    const marketListState = store.getState().marketList
    expect(marketListState).toEqual(emptyList)
  })

  it('store list of markets when API GET succeded', () => {
    // GIVEN
    const threeMarketsResponse = realData

    // WHEN
    processMarketResponse(store.dispatch, threeMarketsResponse)

    // THEN
    const firstMarketRecord = store.getState().marketList.get(0)
    const secondMarketRecord = store.getState().marketList.get(1)
    const thirdMarketRecord = store.getState().marketList.get(2)

    expect(firstMarketRecord).toEqual(MarketFactory.aKittiesMarket)
    expect(secondMarketRecord).toEqual(MarketFactory.aEthereumMarket)
    expect(thirdMarketRecord).toEqual(MarketFactory.aGasPriceMarket)
  })

  it('replaces markets in store when fetch data', () => {
    // GIVEN
    const kittiesResponse = oneMarketData
    processMarketResponse(store.dispatch, kittiesResponse)

    // WHEN
    const etherAndGasMarketsResponse = twoMarketData
    processMarketResponse(store.dispatch, etherAndGasMarketsResponse)

    // THEN
    const firstMarketRecord = store.getState().marketList.get(0)
    const secondMarketRecord = store.getState().marketList.get(1)

    expect(store.getState().marketList.size).toEqual(2)
    expect(firstMarketRecord).toEqual(MarketFactory.aEthereumMarket)
    expect(secondMarketRecord).toEqual(MarketFactory.aGasPriceMarket)
  })
})
