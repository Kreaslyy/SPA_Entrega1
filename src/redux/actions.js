
export const addListing = (listing) => {
  return {
    type: "ADD_LISTING",
    value: listing
    // the type and value keys are mandatory. value is also called payload in some repos
  }
}

export const removeListing = (index) => {
  return {
    type: "REMOVE_LISTING",
    value: index
  }
}

export const logoutUser = (user) => {
  return {
    type: "LOGOUT_USER",
    value: user
  }
}

export const loginUser = (user) => {
  return {
    type: 'LOGIN_USER',
    payload: user
  }
}