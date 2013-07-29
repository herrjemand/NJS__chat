// A Simple nod.js chat server using telent from O'reilly's node up and running
/*var ascii = 
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
"\n|---------------------------------------------------------------|\n \n" */
var ascii = "\u001b[2J\u001b[0;0H"+
"                          Shallom!\n"+
"                            ____           \n"+
"                           /    \134          \n"+
"                      ____/      \134____     \n"+    
"                     /    \134      /    \134    \n"+      
"                    /      \134____/      \134   \n"+      
"                    \134      /    \134      /   \n"+      
"                     \134____/      \134____/    \n"+      
"                     /    \134      /    \134    \n"+   
"                    /      \134____/      \134   \n"+    
"                    \134      /    \134      /   \n"+   
"                     \134____/      \134____/    \n"+ 
"                          \134      /         \n"+  
"                           \134____/          \n"+
"\n                  To exit type 'endpoint'.\n"
/* Clients Start */

var port = process.env.PORT || 9999;
var net = require('net');
var joinrnd = "joinrnd" + Math.round(Math.random()*10000);
//var crp = require('crypto')
	clientList = [];

net.createServer().on('connection', function(client) {
	client.name = /*client.remoteAddress + ':' + */client.remotePort;
	client.write(ascii);
	clientList.push(client)
	broadcast(joinrnd, client)

	client.on('data', function(data) {	

		broadcast(data, client)

	})
  	client.on('error', function(err){

        console.log(err);

    });

	client.on('end', function() { 

		broadcast("endpoint", client)

  	})
 
}).listen(port);
 
function broadcast(message, client) {
		var c = {};
		switch (message.toString().toLowerCase().replace(/[^a-zA-Z0-9]+/g, ""))
		{
			case "endpoint":
				client.destroy();
				clientList.splice(clientList.indexOf(client), 1);
				c.msg = client.name +  " Left chat";
				c.nm = "SYSTEM";
			break;

			case joinrnd:
				c.msg = client.name +  " Join chat";
				c.nm = "SYSTEM";
			break;
			
			case "listt":
				c.msg = list();
				console.log(list() + "TESTT")
				c.nm = "SYSTEM";
			break;

			default:
				c.msg = message;
				c.nm = client.name;
			break;
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
 
/*Clients END*/
function list(){
		if (clientList.length == 0) return "There is no one currently online";
    	  else{
    	  	var listt = "There is " + clientList.length + " clients online:\n";
  
      			for(var i=0;i<clientList.length;i+=1) {
      				listt += i + " :> " + clientList[i].remoteAddress + ":" + clientList[i].remotePort + "\n ";
      			}
      		return listt;
      		delete listt;
      	 }
}


/*Console Starts*/
console.log("\n"+ascii);
console.log('\n                   Listening port ' + port + "...\n");
console.log('|---------------------------------------------------------------|\n \n');
//console.log(crp.createHash('sha512').update(new Buffer("74657374696e67", "hex")).digest('hex'))

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('SYSTEM> ');
rl.prompt();

rl.on('line', function(line) {
  
  switch(line.trim().toString().toLowerCase().replace(/[^a-zA-Z]+/g, "")) {
    case 'list':
    	console.log(list());
      break;

     case 'kick':
     		var id = parseInt(line.replace(/[^0-9]+/g, ""));
     		if (!isNaN(id)){
	     		if(typeof clientList[id] !== 'undefined'){
	     			broadcast("endpoint", clientList[id]);
	     		}else console.log("User with that id does not exist. \nTry `list` to find users id.");
	     	}else console.log("Usage: kick <id>");
      break;
 	case "clear":
		console.log("\n"+ascii);
		console.log('\n                   Listening port ' + port + "...\n");
		console.log('|---------------------------------------------------------------|\n \n'); 		
 	  break;   
    default:
      console.log(line.trim() + ": command not found");
      break;
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});
/* Console Ends */
