import api from "src/apis/api";

//LIKES

const setBackendLike = async (state, cookies) => {

  try {
    await api({
      method: "post",
      url: `/likes/${state.id}`,
      data: state.media,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.spector_jwt}`,
      },
    });
  } catch (err) {
    console.log(err);
    console.log("setting backend like failed");
  }
};

const checkIfLiked = async (state, cookies, setLiked) => {
  try {
    await api({
      method: "put",
      url: `/likes/${state.id}`,
      data: state,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.spector_jwt}`,
      },
    }).then((resp) => {
      setLiked(resp.data.data.exists);
    });

    return response;
  } catch (err) {}
};

const fetchTotalLikes = async (state, cookies, setTotalLikes) => {
  try {
    await api({
      method: "get",
      url: `/likes/count/${state.type}/${state.id}`,
      data: state.media,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.spector_jwt}`,
      },
    }).then((resp) => {
      setTotalLikes(Number(resp.data.data.count));
    });
  } catch (err) {}
};

const pressLike = (liked, setLiked, totalLikes, setBackendLike, setTotalLikes, state, cookies) => {
  if (liked) {
    setLiked(false);
    setBackendLike(state, cookies);
    setTotalLikes(Number(totalLikes) - 1);
  } else {
    setLiked(true);
    setBackendLike(state, cookies);
    setTotalLikes(Number(totalLikes) + 1);
  }
};

// OTHER HELPERS

const fetchUser = async (cookies) => {
  const userReturned = await api({
    method: "get",
    url: "/users/id/me",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.spector_jwt}`,
    },
  });

  return userReturned.data.data.user;
};


  const createArticle = async (state, cookies) => {

    try {

      //Retrieve article
      let media = await api({
        method: "get",
        url: `/media/${state.type}/${state.id}`,
        data: state,
        headers: {
          "Content-Type": "application/json",
          Authorization: cookies.spector_jwt,
        },
      })

      //If it exists
      if (Object.keys(media.data.data).length > 0) {

        //save retrieved article
        const savedArticle = media.data.data.article;

      } else {

        //create article
        await api({
          method: "post",
          url: "/articles",
          data: media,
          headers: {
            "Content-Type": "application/json",
            Authorization: cookies.spector_jwt,
          },
        })
      }

    } catch (err) {
      console.log(err)
    }

  };

  const fetchUser = async (cookies) => {

    const userReturned = await api({
      method: "get",
      url: "/users/id/me",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.spector_jwt}`
      }
    })

    return userReturned.data.data.user;
const userSetter = async (state, setState, cookies) => {
  try {
    await fetchUser(cookies).then((data) => {
      data.avatar_url
        ? setState({ ...state, profileSrc: data.avatar_url })
        : console.log("no profile pic");
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  fetchTotalLikes,
  pressLike,
  setBackendLike,
  checkIfLiked,
  fetchUser,
  userSetter,
};
