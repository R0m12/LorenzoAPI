// Import du modèle album
var Chanson = require("../models/chanson");
var Album = require("../models/album");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const chansonValidationRules = () => {
    return [   
        body("name")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Name must be specified.")
            .isAlphanumeric()
            .withMessage("Name has non-alphanumeric characters."),

        body("album_id", "Invalid album id")
            .notEmpty()
            .withMessage("Album id must be specified.")
            .isNumeric()
            .withMessage("Album id must be a number.")
    ]
}

const paramIdValidationRule = () => {
    return [
        param("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

const bodyIdValidationRule = () => {
    return [
        body("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

// Méthode de vérification de la conformité de la requête  
const checkValidity = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(400).json({
        errors: extractedErrors,
    })
}

// Create
exports.create = [bodyIdValidationRule(), chansonValidationRules(), checkValidity, async (req, res, next) => {
    
    try {
        // Vérification de l'existence de l'album
        const album = await Album.findById(req.body.album_id);
        if (!album) {
            return res.status(404).json("Album not found.");
        }

        // Création de la nouvelle instance de chanson à ajouter
        const chanson = new Chanson({
            _id: req.body.id,
            name: req.body.name,
            featuring: req.body.featuring,
            album_id: new ObjectId(req.body.album_id),
        });

        // Ajout de chanson dans la bdd 
        const newChanson = await chanson.save()

        // Renvoyer la nouvelle chanson avec tous ses champs
        res.status(201).json("Chanson created successfully !");
    } catch (err) {
        res.status(500).json(err.message);
    }
}];


// Read
exports.getAll = (req, res, next) => {
    Chanson.find()
        .exec()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
};

exports.getById = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Chanson.findById(req.params.id)
    .exec()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err))
}];

// Update
exports.update = [paramIdValidationRule(), chansonValidationRules(), checkValidity, (req, res, next) => {
    Chanson.findById(req.params.id)
        .then((chanson) => {
            if (!chanson) {
            return res.status(404).json("Chanson with id " + req.params.id + " is not found !");
            }
    
            chanson.name = req.body.name;
            chanson.featuring = req.body.featuring;
    
            return chanson.save();
        })
        .then(() => {
            return res.status(201).json("Chanson updated successfully !");
        })
        .catch((err) => {
            return res.status(500).json(err);
    });
}];

// Delete
exports.delete = [paramIdValidationRule(), checkValidity,(req, res, next) => {
    Chanson.findByIdAndRemove(req.params.id)
        .then((result) => {
            if (!result) {
              res.status(404).json("Chanson with id " + req.params.id + " is not found !");
            } else {
              res.status(200).json("Chanson deleted successfully !");
            }
        })
        .catch((err) => {
            res.status(500).json(err);
        });
}];