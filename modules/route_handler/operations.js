exports.test = function (link) {

	console.log(link.data);

	link.res.setHeader('Access-Control-Allow-Origin', link.headers.origin);
	link.res.writeHead(200, {'Content-Type': 'text/plain'});
	link.res.end("Hello! " + link.data.toString());
};