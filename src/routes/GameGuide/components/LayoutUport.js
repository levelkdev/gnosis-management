import Block from 'components/layout/Block'
import PageFrame from 'components/layout/PageFrame'
import Title from 'components/layout/Title'
import * as React from 'react'
import Youtube from 'react-youtube'
import SignUp from './uPortComponents/SignUp'
import LogIn from './uPortComponents/LogIn'
import MarketOverview from './uPortComponents/MarketOverview'
import DashboardOverview from './uPortComponents/DashboardOverview'
import MakePrediction from './uPortComponents/MakePrediction'
import Profits from './uPortComponents/Profits'

const videoOpts = {
  height: '260',
  width: '520',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
  },
}

const GameGuide = () => (
  <PageFrame width="750px">
    <Block margin="md">
      <Title>GAME GUIDE</Title>
      <Youtube videoId="36GgFg9CgG8" opts={videoOpts} />
    </Block>
    <SignUp />
    <LogIn />
    <MarketOverview />
    <DashboardOverview />
    <MakePrediction />
    <Profits />
  </PageFrame>
)

export default GameGuide
