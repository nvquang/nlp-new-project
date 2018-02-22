import { ASPECT_BASED } from './PostActions';

// Initial State
const initialState = { data: [] };

const PostReducer = (state = initialState, action) => {
  switch (action.type) {
    case ASPECT_BASED :
      console.log("Action: ", action)
      return {
        data: [action.aspectBased],
      };

    default:
      return state;
  }
};


// Export Reducer
export default PostReducer;
