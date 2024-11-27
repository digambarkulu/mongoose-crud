const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }, // Token expiration time
});

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
