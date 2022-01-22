let express = require('express');
const { authenticateToken } = require('../middleware/authenticateToken');
let app = express.Router();

//Default route is /api/likes

module.exports = (db) => {



  //Toggle Like - (Checks to see if you've liked already. 
  // If not, Creates a like. If you have, deletes said like)
app.post('/:media_id', authenticateToken, async (req, res) => {

  const mediaId = req.params.media_id;

  let idType;

  if (req.body._id) {
    idType = `original_article_id`
  } else if (req.body.id){
    idType = `post_id`
  }

  console.log('ARRIVAL likes route old article id', mediaId)
  console.log('ARRIVAL likes route old article id', req.body)
  console.log('ARRIVAL likes route old article id', idType)
  
  const user_id = req.body.user.id;
  console.log(user_id)

  try {

    //Exist check
    const exist = await db.query(
      `
      SELECT *
      FROM likes
      WHERE ${idType} = $1
        AND liker_id = $2;
      `, [mediaId, user_id]
    );

    console.log('EXISTS FROM LIKES.JS BACKEND', exist.rows)

    let like;

    //If like already exists...
    if (exist.rows.length > 0) {

      like = await db.query(
        `
        DELETE FROM likes 
        WHERE liker_id = $1 
          AND ${idType} = $2
          RETURNING *;
        `, [user_id, mediaId])
        console.log('DELETED LIKE RESULT FROM BACKEND: ', like.rows)

        //If like doesn't exist...
    } else {

      like = await db.query(
        `
        INSERT INTO likes (${idType}, liker_id) 
        VALUES ($1, $2) 
        RETURNING *;
      `, [mediaId, user_id]);
      console.log('CREATED LIKE RESULT FROM BACKEND: ', like.rows)
    }

    //return response
    res.status(200).json({
      status: "LIKE TOGGLED",
      data: {
        like: like.rows
      }
    })

    console.log(like.rows);

  } catch(err) {

    res.status(500).send;
    console.log('like backend failed')
    console.log(err)
  }
})

//Checks if you've liked a specific post (When you refresh it will automatically appear)
app.put('/:media_id', authenticateToken, async (req, res) => {

    const mediaId = req.params.media_id;
    console.log("LIKES ERROE", req.body)

    let idType
    console.log('LIKE ALREADY!!!!!!!!!!', )

  if (req.body._id) {
    idType = `original_article_id`
  } else if (req.body.id){
    idType = `post_id`
  }

    console.log('ARRIVAL likes route old article id', mediaId)
    console.log('ID TYPE OFFFFFF', idType)
    // console.log('ARRIVAL likes route old article id', req.body)
    
    const user_id = req.body.user.id;
    console.log(user_id)
  
    try {
  
      const exist = await db.query(
        `
        SELECT *
        FROM likes
        WHERE ${idType} = $1
          AND liker_id = $2;
        `, [mediaId, user_id]
      );
  
      console.log('YOU LIKED THIS ALREADY FROM LIKES.JS BACKEND', exist.rows)
      console.log('YOU LIKED THIS ALREADY FROM LIKES.JS BACKEND', exist.rows.length > 0)
  
  
      res.status(200).json({
        status: "PAST LIKE CHECKED",
        data: {
          exists: exist.rows.length > 0
        }
      })
  
      console.log(exist.rows);
  
    } catch(err) {
  
      res.status(500).send;
      console.log('like backend failed')
      console.log(err)
    }


    // const postId = req.body.article.id;
    // console.log('ARRIVAL likes route old article id', postId)
    // console.log('ARRIVAL likes route old article id', req.body)
    
    // const user_id = req.body.user.id;
    // console.log(user_id)
  
    // try {
  
    //   const exist = await db.query(
    //     `
    //     SELECT *
    //     FROM likes
    //     WHERE post_id = $1
    //       AND liker_id = $2;
    //     `, [postId, user_id]
    //   );
  
    //   console.log('YOU LIKED THIS (POST!!!!!) ALREADY FROM LIKES.JS BACKEND', exist.rows)
    //   console.log('YOU LIKED THIS (POST!!!!!) ALREADY FROM LIKES.JS BACKEND', exist.rows.length > 0)
  
  
    //   res.status(200).json({
    //     status: "LIKE TOGGLED",
    //     data: {
    //       exists: exist.rows.length > 0
    //     }
    //   })
  
    //   console.log(exist.rows);
  
    // } catch(err) {
  
    //   res.status(500).send;
    //   console.log('like backend failed')
    //   console.log(err)
    // }

})

//Returns total likes for an article
app.get('/count/:type/:media_id', async (req, res) => {

  const mediaId = req.params.media_id;
  const idType = req.params.type;

  // console.log('count body', req.body)

  // let idType;

  // if (req.body._id) {
  //   idType = `original_article_id`
  // } else if (req.body.id){
  //   idType = `post_id`
  // }
  console.log('ARRIVAL for count likes route old article id', mediaId)
  console.log('ARRIVAL for count likes route old article id', req.body)
  console.log('ARRIVAL for count likes route old article id', idType)

  try {

    const count = await db.query(
      `
      SELECT count(*)
      FROM likes
      WHERE ${idType} = $1;
      `, [mediaId]
    );

    console.log('LIKE COUNT FROM LIKES.JS BACKEND', count.rows[0].count)

    res.status(200).json({
      status: "count returned",
      data: {
        count: count.rows[0].count
      }
    })

    console.log(count.rows[0].count);

  } catch(err) {

    res.status(500).send;
    console.log('count backend failed')
    console.log(err)
  }
})

return app;

}

