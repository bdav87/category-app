const bcDev = require('../../lib/bc_dev');
const bcAuth = require('../../lib/bc_auth');

const bcAPI = async (hash) => {
    if (process.env.DEVELOPMENT) {
        const bc = await bcDev();
        return bc;
    } else {
        const bc = await bcAuth(hash);
        return bc;
    }
}

module.exports = bcAPI;