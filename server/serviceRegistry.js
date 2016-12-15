class ServiceRegistry{
    constructor(){
        this._services = {};
        this._timeout = 60 * 2;

        setInterval(()=>{this._cleanup();}, 1000 * this._timeout);
    }

    add(intent, ip, port){
        const key = intent;
        this._services[key] = {};
        this._services[key].timestamp = Math.floor(new Date() / 1000);
        this._services[key].ip = ip;
        this._services[key].port = port;
        console.log(`Added service: ${intent} at ${ip}:${port}`);
    }

    remove(intent){
        const key = intent;
        if(this._services[key]){
            if(delete this._services[key]){
                console.log(`Removed service: ${intent}`);
            }
        }
    }

    get(intent){
        return this._services[intent];
    }

    _cleanup(){
        const now = Math.floor(new Date() / 1000);
        let keys = [];
        for(let key in this._services){
            if(this._services[key].timestamp + this._timeout < now){
                keys.push(key);
            }
        }
        for(let i in keys){
            this.remove(keys[i]);
        }
    }
}

module.exports = ServiceRegistry;