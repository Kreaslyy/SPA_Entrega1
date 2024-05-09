import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

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

// Función para obtener los productos de Firebase
const fetchListingsFromFirebase = async (dispatch) => {
  const db = firebase.firestore();
  const querySnapshot = await db.collection('productos').get();
  const listings = querySnapshot.docs.map((doc) => doc.data());
  dispatch({ type: 'SET_LISTINGS', payload: listings });
};

// Obtener los productos de Firebase al iniciar la aplicación
fetchListingsFromFirebase(store.dispatch);

export default store;