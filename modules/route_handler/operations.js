exports.test = function (link) {

	var data = JSON.parse(link.data);

	link.res.setHeader('Access-Control-Allow-Origin', link.headers.origin);
	link.res.writeHead(200, {'Content-Type': 'text/plain'});
	link.res.end("Hello! " + JSONStringify(data));
};