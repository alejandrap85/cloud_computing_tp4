// TP4
const functions = require('firebase-functions'); /*OK*/

// Import Adminn SDK
const admin = require('firebase-admin'); /*OK*/
admin.initializeApp();

const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use(express.json());



// Obtengo una instancia de la BD
var db = admin.database();
var ref = db.ref("envios");



// Rutas para la aplicación de Envios 
// Métodos Get's



//1.- retorna un listado de envíos pendientes devuelve mapa
app.get('/pendientes', (req, res) =>{
	// Me dirijo a la referencia del envìo
	ref.orderByChild("pendiente").startAt(1).once("value", (snapshot)=>{
		return res.send(snapshot.val());
	});
});

//2.- retorna un envio por id  
app.get('/:idEnvio', (req, res) =>{
	// Me dirijo a la referencia del envìo
	ref.child(req.params.idEnvio).once("value", (snapshot)=>{
		return res.send(snapshot.val());
	});
});

//Métodos Post's
//3.- crea un nuevo envio sin movimientos
/* 	Agrega a una lista de datos en la base de datos. Cada vez que envías un nodo nuevo 
a una lista, tu base de datos genera una clave única, como por ejemplo, 
messages/users/<unique-user-id>/<username>*/
//app.post('envios', (req, res) => res.send(Widgets.create()));

app.post('/', (req, res) =>{

	var envio = req.body;
	console.log("body", envio);

	var miDestino = envio.destino;
	console.log("miDestino",miDestino);

	var miEmail = envio.email;
	console.log("miEmail",miEmail);

	envio.fechaAlta = new Date().toISOString();
	envio.pendiente = new Date().toISOString();

	ref.push(envio).then(
		(snapshot)=>{
			console.log("snapshot -->",snapshot);
			return res.redirect(303, snapshot.ref.toString());

		}).catch(err => res.json(err));
	/*ref.push(envio) 
	.then(res.json(envio))
            .catch(err => res.json(err))*/
});


//https://openwebinars.net/blog/construir-api-con-firebase-cloud-functions/





//4.- agrega un movimiento a un envío
//app.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));

app.put('/:idEnvio/movimiento', (req, res) =>{

	var envio = req.body;
	console.log("body", envio);

	var arbol = req.params.idEnvio;
	console.log("arbol",arbol);

	var movRef = db.ref("envios/" + arbol);
	console.log("movRef",movRef);

	var miDescripcion = envio.descripcion;
	console.log("miDescripcion",miDescripcion);

	envio.fecha = new Date().toISOString(); //ver

	movRef.update(envio).then(
		(snapshott)=>{
			console.log("snapshott -->",snapshott);
			return res.redirect(303, snapshott.ref.toString());

		}).catch(err => res.json(err));
});

//5.- marca un envío como entregado quitando el atributo pendiente
//app.post('/:idenvio/entregado', (req, res) => res.send(Widgets.create()));

app.delete('/:idEnvio/pendiente', (req, res) =>{

	var arbol = req.params.idEnvio;
	console.log("arbol",arbol);

	var deletePend = db.ref("envios/" + arbol + "/pendiente");
	console.log("deletePend",deletePend);

	var borrar = null;

	deletePend.set(borrar).then(
		(snapshott)=>{
			console.log("snapshott -->",snapshott);
			return res.redirect(303, snapshott.ref.toString());

		}).catch(err => res.json(err));
});

/*app.delete('/:idEnvio/pendiente', (req, res) =>{

	var blanquear;

	var envio = req.body;
	console.log("body", envio);

	var arbol = req.params.idEnvio;
	console.log("arbol",arbol);

	var movRef = db.ref("envios/" + arbol);
	console.log("movRef",movRef);

	var miDescripcion = envio.descripcion;
	console.log("miDescripcion",miDescripcion);

	envio.fecha = new Date().toISOString(); //ver

	movRef.update('pendiente', blanquear).then(
		(snapshott)=>{
			console.log("snapshott -->",snapshott);
			return res.redirect(303, snapshott.ref.toString());

		}).catch(err => res.json(err));
});


/*app.put('/:idEnvio/movimiento', (req, res) =>{

	var envio = req.body;
	console.log("body", envio);

	var arbol = req.params.idEnvio;
	console.log("arbol",arbol);

	var movRef = db.ref("envios/" + arbol);
	console.log("movRef",movRef);

	var miDescripcion = envio.descripcion;
	console.log("miDescripcion",miDescripcion);

	envio.fecha = new Date().toISOString(); //ver

	movRef.update(envio).then(
		(snapshott)=>{
			console.log("snapshott -->",snapshott);
			return res.redirect(303, snapshott.ref.toString());

		}).catch(err => res.json(err));
});*/


// Expose Express API as a single Cloud Function:
exports.envios = functions.https.onRequest(app);



