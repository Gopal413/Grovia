const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyDescription: {
      type: String,
      required: true,
    },

    companyImage: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    socialMedia: {
      instagram: String,
      facebook: String,
      linkedin: String,
      twitter: String,
      youtube: String,
    },

    certification: [String],

    licence: {
      type: String,
      default: "",
    },

    founder: {
      type: String,
      required: true,
    },
  customDetails: [
    {
      key: String,
      value: String,
    }
  ],

    customFields: {
      type:Object,
      default: {},
    },

   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);