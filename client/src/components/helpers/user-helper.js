import api from "src/apis/api";


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
  }

  const userSetter = async (state, setState, cookies) => {

    try {

      await fetchUser(cookies)
      .then(data => {
        data.avatar_url ? setState({...state, profileSrc: data.avatar_url}) : console.log("no profile pic")
      })

    } catch(err) {
      console.log(err)
    }

  }

module.exports = { userSetter};
