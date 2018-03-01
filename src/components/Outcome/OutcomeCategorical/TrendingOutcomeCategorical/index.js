import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import OutcomeColorBox from 'components/OutcomeColorBox'
import style from '../outcomeCategorical.scss'

const cx = cn.bind(style)

const TrendingOutcomeCategorical = ({
  entryStyle, outcome, percentage, resolutionDate,
}) => (
  <div className={cx('trendingOutcomeCategoricalContainer')}>
    <div className={cx('outcomeWrapper')}>
      <OutcomeColorBox style={entryStyle} />
      <div className={cx('outcome')}>{outcome}</div>
    </div>
    <div>{percentage}%</div>
    <div className={cx('date')}>{resolutionDate}</div>
  </div>
)

TrendingOutcomeCategorical.propTypes = {
  entryStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
  outcome: PropTypes.string,
  percentage: PropTypes.string,
  resolutionDate: PropTypes.string,
}

TrendingOutcomeCategorical.defaultProps = {
  entryStyle: {},
  outcome: '',
  percentage: '',
  resolutionDate: '',
}

export default TrendingOutcomeCategorical
