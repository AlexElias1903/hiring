import app from './app';

(async () => {
    try {
        app.listen(8080, () => {
            console.log('on: 8080');
        });
    } catch (e) {
        console.log(e);
    }
})();
