import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import thunk from 'redux-thunk';
import storage from '../utils/storage';

let composes = [
  applyMiddleware(thunk),
  storage()
];
if (process.env.DEVTOOLS_EXT && window.devToolsExtension) {
  composes.push(window.devToolsExtension());
} else if (process.env.DEVTOOLS) {
  composes = [
    ...composes,
    DevTools.instrument(),
    persistState(
      window.location.href.match(
        /[?&]debug_session=([^&]+)\b/
      )
    )
  ];
}
const enhancer = compose(...composes);

export default function(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
