let express = require('express');
const { authenticateToken } = require('../middleware/authenticateToken');
let app = express.Router();

//Default route is /api/likes

module.exports = (db) => {



  //Toggle Like - (Checks to see if you've liked already. 
  // If not, Creates a like. If you have, deletes said like)
app.post('/:old_article_id', authenticateToken, async (req, res) => {
  const oldArticleId = req.params.old_article_id;
  console.log('ARRIVAL likes route old article id', oldArticleId)
  console.log('ARRIVAL likes route old article id', req.body)
  
  const user_id = req.body.user.id;
  console.log(user_id)

  try {

    //Exist check
    const exist = await db.query(
      `
      SELECT *
      FROM likes
      WHERE original_article_id = $1
        AND liker_id = $2;
      `, [oldArticleId, user_id]
    );

    console.log('EXISTS FROM LIKES.JS BACKEND', exist.rows)

    let like;

    //If like already exists...
    if (exist.rows.length > 0) {

      like = await db.query(
        `
        DELETE FROM likes 
        WHERE liker_id = $1 
          AND original_article_id = $2
          RETURNING *;
        `, [user_id, oldArticleId])
        console.log('DELETED LIKE RESULT FROM BACKEND: ', like.rows)

        //If like doesn't exist...
    } else {

      like = await db.query(
        `
        INSERT INTO likes (original_article_id, liker_id) 
        VALUES ($1, $2) 
        RETURNING *;
      `, [oldArticleId, user_id]);
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
app.get('/:old_article_id', authenticateToken, async (req, res) => {
  const oldArticleId = req.params.old_article_id;
  console.log('ARRIVAL likes route old article id', oldArticleId)
  console.log('ARRIVAL likes route old article id', req.body)
  
  const user_id = req.body.user.id;
  console.log(user_id)

  try {

    const exist = await db.query(
      `
      SELECT *
      FROM likes
      WHERE original_article_id = $1
        AND liker_id = $2;
      `, [oldArticleId, user_id]
    );

    console.log('YOU LIKED THIS ALREADY FROM LIKES.JS BACKEND', exist.rows)
    console.log('YOU LIKED THIS ALREADY FROM LIKES.JS BACKEND', exist.rows.length > 0)


    res.status(200).json({
      status: "LIKE TOGGLED",
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
})

//Returns total likes for an article
app.get('/count/:old_article_id', async (req, res) => {

  const oldArticleId = req.params.old_article_id;
  console.log('ARRIVAL for count likes route old article id', oldArticleId)
  console.log('ARRIVAL for count likes route old article id', req.body)

  try {

    const count = await db.query(
      `
      SELECT count(*)
      FROM likes
      WHERE original_article_id = $1;
      `, [oldArticleId]
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

