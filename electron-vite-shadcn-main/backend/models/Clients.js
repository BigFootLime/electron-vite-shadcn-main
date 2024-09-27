const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Client = sequelize.define(
  "Client",
  {
    client_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adresse_ligne_1: {
      type: DataTypes.STRING,
    },
    adresse_ligne_2: {
      type: DataTypes.STRING,
    },
    adresse_ligne_3: {
      type: DataTypes.STRING,
    },
    adresse_ligne_4: {
      type: DataTypes.STRING,
    },
    siret: {
      type: DataTypes.STRING,
    },
    localite: {
      type: DataTypes.STRING,
    },
    code_postal: {
      type: DataTypes.STRING,
    },
    pays: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    telephone: {
      type: DataTypes.STRING,
    },
    telecopie: {
      type: DataTypes.STRING,
    },
    compte_tiers: {
      type: DataTypes.STRING,
    },
    reglement: {
      type: DataTypes.STRING,
    },
    groupe_financier: {
      type: DataTypes.STRING,
    },
    rue: {
      type: DataTypes.STRING,
    },
    ville: {
      type: DataTypes.STRING,
    },
    contact_principal: {
      type: DataTypes.STRING,
    },
    type_client: {
      type: DataTypes.STRING,
    },
    secteur_activite: {
      type: DataTypes.STRING,
    },
    date_creation: {
      type: DataTypes.DATE,
    },
    statut: {
      type: DataTypes.STRING,
    },
    numero_client: {
      type: DataTypes.STRING,
    },
    condition_de_paiement: {
      type: DataTypes.TEXT,
    },
    type_remise: {
      type: DataTypes.STRING,
    },
    remise: {
      type: DataTypes.DECIMAL(5, 2),
    },
    solde_compte: {
      type: DataTypes.DECIMAL(10, 2),
    },
    date_dernier_achat: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Client",
    timestamps: false,
  }
);

module.exports = Client;
