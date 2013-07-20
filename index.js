// A Simple nod.js chat server using telent from O'reilly's node up and running
var ascii = 
"\u001b[2J\u001b[0;0H"+
"                         Shallom !\n"+
"\n"+
"                            /\134           \n"+
"                           /  \134          \n"+
"                          /    \134         \n"+
"                         /      \134        \n"+
"                        /        \134       \n"+
"                       /__________\134      \n"+
"                                         \n"+
"                       ============	     \n"+
"                                         \n"+
"                           x  x          \n"+
"                        x        x       \n"+
"                       x          x      \n"+
"                       x          x      \n"+
"                        x        x       \n"+
"                           x  x          \n"+
"\n                   To exit type 'endpoint'."+
"\n|---------------------------------------------------------------|\n \n"

var port = 9999;
var net = require('net')
//var crp = require('crypto')
var chatServer = net.createServer()
	clientList = []
chatServer.on('connection', function(client) {
	client.name = /*client.remoteAddress + ':' + */client.remotePort
	client.write(ascii)

	//client.write("\u001b[mMe>" );

	
	clientList.push(client)
 
	client.on('data', function(data) {	
		broadcast(data, client)
	})
 
	client.on('end', function() { 
		broadcast("endpoint", client)
  })
 
})
 
function broadcast(message, client) {
		var c = {};
		if ("endpoint" == message.toString().toLowerCase().replace(/[^a-zA-Z]+/g, "")){
				client.destroy();
				clientList.splice(clientList.indexOf(client), 1);
				c.msg = client.name +  " Left chat";
				c.nm = "SYSTEM";
		}else{
			c.msg = message;
			c.nm = client.name;
		}
		console.log(c.nm + ":> " + c.msg)
		for(var i=0;i<clientList.length;i+=1) {
			if(client !== clientList[i]) {
				clientList[i].write(c.nm + ":> " + c.msg);
			}
			// Echo the >> character so client sending knows he sent it
			//else client.write("\r\033[K" + message);
		}
}
 
chatServer.listen(9999)
//console.log('\u001b[2J\u001b[0;0H')
console.log("\n"+ascii);
console.log('\n                   Listening port ' + port + "...\n");
console.log('|---------------------------------------------------------------|\n \n');
//console.log(crp.createHash('sha512').update(new Buffer("74657374696e67", "hex")).digest('hex'))

	