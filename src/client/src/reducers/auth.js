import Utils from '../helpers/utils';
// ------------------------------------
// Constants
// ------------------------------------
const AUTHENTICATION = 'AUTHENTICATION';

// ------------------------------------
// Actions
// ------------------------------------
const updateResult = (result) => {
  return {
    type: AUTHENTICATION,
    result
  }
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export const authenticate = (nextAction = () => { }) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, 0.3 * 1000);
  }).then((result) => {
    dispatch(updateResult({ isAuthenticated: true }));
    nextAction();  // call next action (if any)
  }).catch(() => {
    dispatch(updateResult({ isAuthenticated: false }));
    nextAction();  // call next action (if any)
  })
}

export const signout = (nextAction = () => { }) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve();
    }, 0.3 * 1000);
  }).then(() => {
    dispatch(updateResult({ isAuthenticated: false }));
    nextAction();  // call next action (if any)
  }).catch(() => {
    dispatch(updateResult({ isAuthenticated: false }));
    nextAction();  // call next action (if any)
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isAuthenticated: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATION:
      return Utils.merge(state, action.result)
      break // eslint-disable-line
    default:
      return state
  }
}
