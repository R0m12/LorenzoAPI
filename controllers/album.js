// Import du modèle album
var Album = require("../models/album");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const albumValidationRules = () => {
    return [   
        body("name")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Name must be specified.")
            .isAlphanumeric()
            .withMessage("Name has non-alphanumeric characters."),

        body("dateOfRelease", "Invalid date of release")
            .optional({ checkFalsy: true })
            .isISO8601()
            .toDate()
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
exports.create = [bodyIdValidationRule(), albumValidationRules(), checkValidity, (req, res, next) => {
    
    // Création de la nouvelle instance de album à ajouter 
    var album = new Album({
        _id: req.body.id,
        name: req.body.name,
        dateOfRelease: req.body.dateOfRelease,
      });

    // Ajout de album dans la bdd 
    album.save()
      .then(() => res.status(201).json("Album created successfully !"))
      .catch((err) => res.status(500).json(err));
}];

// Read
exports.getAll = (req, res, next) => {
    Album.find()
        .exec()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
};

exports.getById = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Album.findById(req.params.id)
    .exec()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err))
}];

// Update
exports.update = [paramIdValidationRule(), albumValidationRules(), checkValidity, (req, res, next) => {
    Album.findById(req.params.id)
        .then((album) => {
            if (!album) {
            return res.status(404).json("Album with id " + req.params.id + " is not found !");
            }
    
            album.name = req.body.name;
            album.dateOfRelease = req.body.dateOfRelease;
    
            return album.save();
        })
        .then(() => {
            return res.status(201).json("Album updated successfully !");
        })
        .catch((err) => {
            return res.status(500).json(err);
    });
}];

// Delete
exports.delete = [paramIdValidationRule(), checkValidity,(req, res, next) => {
    Album.findByIdAndRemove(req.params.id)
        .then((result) => {
            if (!result) {
              res.status(404).json("Album with id " + req.params.id + " is not found !");
            } else {
              res.status(200).json("Album deleted successfully !");
            }
        })
        .catch((err) => {
            res.status(500).json(err);
        });
}];