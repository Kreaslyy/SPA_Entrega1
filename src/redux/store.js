import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { getUserIdFromCookie } from '../Router';

const initialState = {
  user: {},
  listings: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_LISTING':
      return {
        ...state,
        listings: [...state.listings, action.payload],
      };
    case 'SET_LISTINGS':
      return {
        ...state,
        listings: action.payload,
      };
    default:
      return state;
  }
};

const store = createStore(reducer, initialState, applyMiddleware(thunk));

const fetchListingsFromFirebase = async (dispatch, userId) => {
  const db = firebase.firestore();
  const followingsSnapshot = await db.collection('followings').doc(userId).collection('userFollowings').get();
  const followingsData = followingsSnapshot.docs.map((doc) => doc.id);

  const querySnapshot = await db.collection('productos').get();
  const listings = querySnapshot.docs.map((doc) => doc.data());

  const followedListings = listings.filter((listing) => followingsData.includes(listing.userId));
  const otherListings = listings.filter((listing) => !followingsData.includes(listing.userId));
  const prioritizedListings = [...followedListings, ...otherListings];

  dispatch({ type: 'SET_LISTINGS', payload: prioritizedListings });
};

fetchListingsFromFirebase(store.dispatch, getUserIdFromCookie());

export default store;