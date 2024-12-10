const express=require ('express');
const mongoose =require ('mongoose') ;
const bodyParser = require('body-parser');
const http = require ('http');
const socketIo = require ('socket.io');


const app = express () ;    
app.use(express.json()); // middleware pour parser le corps JSON  


const productRoutes = require('./routes/product'); // Importation des routes pour gérer les livres`
const {Product} = require ('./models/Product');   // Importation du modèle `Product`.

 
const server = http.createServer(app);     // Serveur HTTP utilisant Express.
const io = socketIo (server);             // Ajout de fonctionnalités temps réel via Socket.io.


// Connexion à MongoDB  
mongoose.connect('mongodb://localhost:27017/productDB')
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
console.error('Connection error' , err);
});


//Middleware pour analyser les requêtes
app.use(bodyParser.json());

//les routes pour les produits
app.use('/products' , productRoutes);


//configuration Twig
 app.set('view engine', 'twig');
 app.set ('views', './views');


//Gestion des connexions WebSocket
 io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('getAvailableProducts', async () => {
      try {
        const availableProductsCount = await Product.countDocuments({ available: true });
        socket.emit('availableProductCount', availableProductsCount);
      } catch (error) {
        console.error('Error fetching available products count', error);
      }
    });
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  
  //Route pour la page d'accueil
  app.get('/', (req, res) => {
    res.render('index');
  });
  
  //Lancement du serveur
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

