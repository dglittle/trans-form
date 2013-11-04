trans-form
==========

UNDER CONSTRUCTION

commands to set it up on heroku:

```
heroku apps:create trans-form

heroku config:set MONGOHQ_URL=the-mongo-url-of-a-mongodb-that-supports-db.eval
heroku config:set SESSION_SECRET=change_me

git push heroku master
```
