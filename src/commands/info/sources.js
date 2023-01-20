const AvonCommand = require("../../structures/avonCommand");

class Sources extends AvonCommand{
    get name(){
        return 'sources'
    }
    get aliases(){
        return ['source']
    }
    async run(client,message,args,prefix){

    }
}
module.exports = Sources;