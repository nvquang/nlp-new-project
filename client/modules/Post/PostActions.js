import callApi from '../../util/apiCaller';

// Export Constants
export const ASPECT_BASED = 'ASPECT_BASED';


// Export Actions
export function addAspectBased(aspectBased) {
  console.log("Aspect base: ", aspectBased)
  return {
    type: ASPECT_BASED,
    aspectBased,
  };
}

export function addAspectBasedRequest(query) {
  return (dispatch) => {
    return callApi('aspectsBased', 'post', {
      query: {
        text: query.text,
        domain: query.domain,
      },
    }).then(res => dispatch(addAspectBased(res.aspectBased)));
  };
}
