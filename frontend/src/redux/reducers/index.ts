import { combineReducers } from 'redux';
import userReducer from './userReducer';
// import other reducers here as needed

const rootReducer = combineReducers({
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
