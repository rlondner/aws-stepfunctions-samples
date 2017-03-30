exports.handler = (event, context, callback) => {
    console.log(event.length)
    callback(null, event.length);
};