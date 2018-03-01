import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { registerProvider, updateProvider, setActiveProvider } from 'integrations/store/actions'
import { ProviderRecord } from 'integrations/store/models'

export default handleActions(
  {
    [setActiveProvider]: (state, { payload }) => state.set('activeProvider', payload),
    [registerProvider]: (state, { payload: { provider: name, priority } }) => {
      const newProvider = { name, priority }
      return state.setIn(['providers', name], new ProviderRecord(newProvider))
    },
    [updateProvider]: (state, { payload }) => {
      const { provider: name, ...provider } = payload
      const updatedProvider = ({ name, loaded: true, ...provider })
      const currentProviderState = state.getIn(['providers', name])
      const newProviderState = currentProviderState.merge(updatedProvider)
      return state.setIn(['providers', name], newProviderState)
    },
  },
  Map({
    providers: Map(),
    activeProvider: undefined,
  }),
)
