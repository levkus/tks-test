import { MAKE_NEW_CHART } from './actions'

const INITIAL_STATE = {
  data: null
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case MAKE_NEW_CHART:
      return { ...state, data: action.payload }

    default:
      return state
  }
}
