import { selector } from "recoil";
import { userState } from "./atoms";
export const usernameSelector = selector({
    key: 'usernameSelector',
    get: ({ get }) => {
      const user = get(userState);
      return user.Username;
    },
  });
  export const userIdSelector = selector({
    key: 'userIdSelector',
    get: ({ get }) => {
      const user = get(userState);
      return user._id;
    },
  });

export const defaultUserStateSelector = selector({
  key: 'defaultUserState',
  get: () => ({
    _id: '',
    Name: '',
    Username: '',
    Email: '',
    Followers: [],
    Following: [],
    Tweets: [],
    createdAt: '',
    updatedAt: '',
    __v: 0,
  }),
});






