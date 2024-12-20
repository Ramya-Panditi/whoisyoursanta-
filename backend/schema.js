const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    roomcode: { type: String, required: true },
    group: {
        type: [
            {
                name: { type: String, required: true },
                email: { type: String, required: true }
            }
        ],
        required: true
    },
    draws: {
        type: Map,
        of: String, 
        default: {} 
    },
    undrawn: {
        type: [String], 
        default: [] 
    }
}, { collection: "secretsantadb" });

module.exports = mongoose.model("room", schema);
