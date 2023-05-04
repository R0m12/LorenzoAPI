// (Étape 1) Import de express
var express = require('express');

// (Étape 1) Définition du router
var router = express.Router();

// Import du Contrôleur album
var album_controller = require("../controllers/album");

// (Étape 2) Ajout de la route qui permet d'ajouter un album
router.post("/", album_controller.create);

// (Étape 2) Ajout de la route qui permet d'afficher tous les albums
router.get("/", album_controller.getAll);

// (Étape 2) Ajout de la route qui permet d'afficher un seul album grâce à son identifant
router.get("/:id", album_controller.getById);

// (Étape 2) Ajout de la route qui permet de modifier un seul album grâce à son identifant
router.put("/:id", album_controller.update);

// (Étape 2) Ajout de la route qui permet de supprimer un seul album grâce à son identifant
router.delete("/:id", album_controller.delete);

// (Étape 1) Export du router
module.exports = router;