import api from "src/apis/api";

//LIKES


const fetchCommentArray = async (parentState, comments, setComments) => {

  try {

    let id = String(parentState.id)

    let response = await api.get(`/comments/${parentState.type}/${id}`);

    //Check if response is an array
    if (Array.isArray(response.data.data.comments) && response.data.data.comments.length > 0) {
      setComments(response.data.data.comments.reverse());
    }
    return;

  } catch(err) {
  }

};

module.exports = { fetchCommentArray };
