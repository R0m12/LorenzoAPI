// (Étape 1) Import de express
var express = require('express');

// (Étape 1) Définition du router
var router = express.Router();

// Import du Contrôleur chanson
var chanson_controller = require("../controllers/chanson");

// (Étape 2) Ajout de la route qui permet d'ajouter un chanson
router.post("/", chanson_controller.create);

// (Étape 2) Ajout de la route qui permet d'afficher tous les chansons
router.get("/", chanson_controller.getAll);

// (Étape 2) Ajout de la route qui permet d'afficher un seul chanson grâce à son identifant
router.get("/:id", chanson_controller.getById);

// (Étape 2) Ajout de la route qui permet de modifier un seul chanson grâce à son identifant
router.put("/:id", chanson_controller.update);

// (Étape 2) Ajout de la route qui permet de supprimer un seul chanson grâce à son identifant
router.delete("/:id", chanson_controller.delete);

// (Étape 1) Export du router
module.exports = router;