const AvonClientEvents = require(`../../structures/Eventhandler`);

class AvonInteractions extends AvonClientEvents{
    get name(){
        return 'interactionCreate';
    }
    async run(interaction){
        if(interaction.isSelectMenu())
        {

        }
        if(interaction.isButton())
        {
            
        }
    }
}
module.exports = AvonInteractions;