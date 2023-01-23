const EventEmitter = require('events');

class AvonClientEvent extends  EventEmitter {
    constructor(client) {
        super();
        this.client = client;
        if (this.constructor === AvonClientEvent) throw new TypeError('Ja na lode');
        if (this.name === undefined) throw new TypeError('naam toh dede bsdk event ko');
        if (this.run === undefined) throw new TypeError('run bhi krna hai bhai event ko run function kr');
        this.on('error', (error) => client.logger.error(error));
    }

    run(...args) {
        this.run(...args)
            .catch(error => this.emit('error', error));
    }
}
module.exports = AvonClientEvent;