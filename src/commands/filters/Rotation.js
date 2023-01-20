const AvonCommand = require("../../structures/avonCommand");

class Rotation extends AvonCommand{
    get name(){
        return 'rotation'
    }
    get aliases(){
        return null;
    }
    get inVoice(){
        return true;
    }
    get sameVoice(){
        return true;
    }
    get player(){
        return true;
    }
    async run(client,message,args,prefix,player){
        player
    }
}
module.exports = Rotation;