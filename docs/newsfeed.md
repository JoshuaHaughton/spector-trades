# Comments
* News article comments
  * axios calls populates newsfeed with articles and posts for the day
    * when a user comments on an article (clicks post on comment)
      * create article under articles with:
        * article URL 
        * DATE
        * User_id
      * create comment with:
        * user_id
        * body
        * article_id
        * post_id null
    * when user clicks view comments 
      * axios to /comments/article
        * if article URL exists in articles table
          * get all comments
        * Otherwise
          * returns non
