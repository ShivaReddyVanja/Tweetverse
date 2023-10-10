import {atom} from "recoil";

    export const userState = atom({
      key: 'userState',
      default: {
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
      },
    });


export const tweetState = atom({
    key:'tweetState',
    default:[],
})
export const userLogStatus = atom({
  key:"userLogStatus",
  default:'',
})

