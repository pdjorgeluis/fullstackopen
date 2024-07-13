const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':{
      const changedState = {...state, good: state.good + 1}
      return changedState
    }
    case 'OK':{
      const changedState = {...state, ok: state.ok + 1}
      return changedState
    }
    case 'BAD':{
      const changedState = {...state, bad: state.bad + 1}
      return changedState
    }
    case 'ZERO':
      return initialState
    default: return state
  }
  
}

export default counterReducer
