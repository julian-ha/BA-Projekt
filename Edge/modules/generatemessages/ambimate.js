const i2c = require('i2c-bus');

class ambimate {

    constructor(adress, busNumber) {
        this.adress = adress;
        this.data = new ArrayBuffer(16);
        this.i2cl = i2c.openSync(busNumber);  
        this.opt_sensors = this.i2cl.readByteSync(this.adress, 0x82);
        this.reading = {};
    }
    
    async readAll() {
            if (this.opt_sensors & 0x01) {
                this.i2cl.writeByteSync(this.adress, 0xC0, 0x7F);
            } else {
                this.i2cl.writeByteSync(this.adress, 0xC0, 0x3F);
            }

            setTimeout(() => {
                for (var i = 0; i <= 15; i++) {
                    this.data[i] = this.i2cl.readByteSync(this.adress, i);
                }
                    
                this.reading = {
                    temperature: (256 * this.data[1] + this.data[2]) / 10.0,
                    humidity: (256 * this.data[3] + this.data[4]) / 10.0,
                    light: (256 * (this.data[5] & 0x7F) + this.data[6]),
                    audio: (256 * (this.data[7] & 0x7F) + (this.data[8] & 0x7F)),
                    co2: (256 * this.data[11] + this.data[12]),
                    voc: (256 * this.data[13] + this.data[14]),
                    bat_volts: ((256 * (this.data[9] & 0x7F) + this.data[10]) / 1024.0) * (3.3 / 0.330),
                    status: this.data[0]
                }
                return(this.reading);
            }, 200)


    }

}

module.exports = ambimate