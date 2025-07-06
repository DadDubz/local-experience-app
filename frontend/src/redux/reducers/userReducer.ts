import { AnyAction } from 'redux';

interface UserState {
  isPremium: boolean;
}

const initialState: UserState = {
  isPremium: false,
};

const userReducer = (state = initialState, action: AnyAction): UserState => {
  switch (action.type) {
    case 'UPGRADE_TO_PREMIUM':
      return {
        ...state,
        isPremium: true,
      };
    default:
      return state;
  }
};

export default userReducer;
