export function signup(formState) {
  return (dispatch) => {
    dispatch({type: 'LOADING_SIGN_UP'})
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      accepts: 'application/json',
      body: JSON.stringify(formState)
    })
    .then(response => response.json())
    .then(user => {
      dispatch({
        type: 'SIGN_UP',
        payload: user
      })
    })
    .catch(err => {
      dispatch({
        type: 'ERROR',
        error: err
      })
    })
  }
}
