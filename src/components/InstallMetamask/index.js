import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import OlympiaIcon from './metamask.svg'
import './InstallMetamask.less'

const cx = cn

const logoStyle = {
  width: 100,
  height: 100,
}

const InstallMetamask = ({ closeModal }) => (
  <div className="installMetamask">
    <button className="closeButton" onClick={() => closeModal()} />
    <img src={OlympiaIcon} alt="logo" style={logoStyle} />
    <h3 className="installText">Install MetaMask</h3>
    <p className="downloadText">
      Metamask is not currently installed or detected.{' '}
      <a className="downloadLink" href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
        Please download and install MetaMask
      </a>{' '}
      to start using Olympia.
    </p>
  </div>
)

InstallMetamask.propTypes = {
  closeModal: PropTypes.func.isRequired,
}

export default InstallMetamask