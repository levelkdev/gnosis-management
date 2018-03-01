import React from 'react'
import OutcomeCategorical from 'components/Outcome/OutcomeCategorical'
import OutcomeScalar from 'components/Outcome/OutcomeScalar'
import WinningOutcome from 'components/Outcome/WinningOutcome'
import { OUTCOME_TYPES } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import { isMarketResolved } from 'utils/helpers'
import PropTypes from 'prop-types'

const Outcome = ({ market, opts = { showOnlyTrendingOutcome: false } }) => {
  const { event: { type: eventType } } = market
  const showWinningOutcome = isMarketResolved(market)

  let outcomeComponent = eventType === OUTCOME_TYPES.CATEGORICAL ? (
    <OutcomeCategorical market={market} opts={opts} />
  ) : (
    <OutcomeScalar market={market} opts={opts} />
  )

  if (showWinningOutcome) {
    outcomeComponent = <WinningOutcome market={market} />
  }

  return outcomeComponent
}

Outcome.propTypes = {
  market: marketShape,
  opts: PropTypes.shape({
    showOnlyTrendingOutcome: PropTypes.bool,
    showDate: PropTypes.bool,
    dateFormat: PropTypes.string,
  }),
}

export default Outcome
