const mongoose = require('mongoose');
//Defines Schema as a shortcut – Instead of using mongoose.Schema
const Schema = mongoose.Schema; 

// Create profile schema obj
const ProfileSchema = new Schema({
    user: {
        // Stores a MongoDB ObjectId that references a document in the users collection.
        type: Schema.Types.ObjectId, 
        // The ref: 'users' establishes a relationship (foreign key) between Profile and users.
        //This allows population (.populate()) to fetch user details when querying a profile. 
        ref: 'users' 
    },
    handle:{
        type: String,
        required: true,         // required
        max: 40
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true          // required
    },
    skills: {           
        type: [String],
        required: true          // required
    },
    bio:{
        type: String
    },
    githubusername: {
        type: String
    },

    experience: [
        {
        title: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        location: {
            type: String
        },
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        }
        }
    ],

    education: [
        {
        school: {
            type: String,
            required: true
        },
        degree: {
            type: String,
            required: true
        },
        fieldofstudy: {
            type: String,
            required: true
        },
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String
        },
        }
    ],

    social: { 
        // all the socila media plateforms are just fields
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);