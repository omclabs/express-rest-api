if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` }); // eslint-disable-line global-require
} else {
  require('dotenv/config'); // eslint-disable-line global-require
}
