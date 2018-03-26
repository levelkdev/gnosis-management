import React from 'react'
import cn from 'classnames/bind'
import { Field, reduxForm, propTypes } from 'redux-form'
import PropTypes from 'prop-types'
import Checkbox from 'components/Form/Checkbox'
import style from './AcceptTOS.mod.scss'

const cx = cn.bind(style)

const AcceptTOS = ({
  closeModal, tosAgreed, ppAgreed, initProviders,
}) => {
  const disabled = !ppAgreed || !tosAgreed
  const login = () => {
    initProviders()
    closeModal()
  }
  return (
    <div className={cx('acceptTOS')}>
      <button className={cx('closeButton')} onClick={() => closeModal()} />
      <div className={cx('tosContainer')}>
        <h4 className={cx('acceptHeading')}>Terms of service and privacy policy</h4>
        <p className={cx('annotation')}>
          For using Gnosis Management Interface you have to agree with our terms of service and privacy policy
        </p>
        <Field name="agreedWithTOS" component={Checkbox} className={cx('checkBox')}>
          I agree with terms of service
        </Field>
        <Field name="agreedWithPP" component={Checkbox} className={cx('checkBox')}>
          I agree with privacy policy
        </Field>
        <button className={cx('loginButton', { disabled })} disabled={disabled} onClick={login}>
          LOGIN
        </button>
      </div>
    </div>
  )
}

AcceptTOS.propTypes = {
  ...propTypes,
  closeModal: PropTypes.func.isRequired,
  tosAgreed: PropTypes.bool,
  ppAgreed: PropTypes.bool,
}

const form = {
  form: 'tosAgreement',
  tosAgreed: false,
  ppAgreed: false,
}

export default reduxForm(form)(AcceptTOS)
