const auth = function (req, res, next) {
    const BASE_URL = '/api/v1/';

    if (req.session.islogin) {
        next()
    }

    let pos = req.url.indexOf(BASE_URL);
    if (pos == -1) {
        next();
    }

    let url = req.url.substring(pos + BASE_URL.length);
    console.log(url);

    if (url === "/") {
        next()
    } else if (url.indexOf('/makers') ||
        url.indexOf('/cars') ||
        url.indexOf('/roles')) {
        next();
    } else if (url.indexOf('/posts') && req.method === 'GET') {
        next();
    } else if (url.indexOf("/users") && req.method === 'POST') {
        next();
    }

    //res.sendStatus(401);
    res.redirect('/api/v1/error');

    //return res.status(401).send('You are not authorized to view this page');
}

module.exports = auth;
