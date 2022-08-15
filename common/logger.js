const fs = require('fs');

const activitylogpath = 'logs/activity.log';
const errorlogpath = 'logs/error.log';
const logsdir = 'logs'


if (!fs.existsSync(logsdir)) {
    fs.mkdirSync(logsdir)
}
if (!fs.existsSync(activitylogpath)) {
    fs.writeFileSync(activitylogpath, '');
}
if (!fs.existsSync(errorlogpath)) {
    fs.writeFileSync(errorlogpath, '');
}

class Logger {
    constructor() {
        this.timestamp = new Date().toISOString();
        this.ERROR = 'ERROR';
        this.OK = 'OK';
    }

    logActivity(interaction) {
        let optionstext = '';
        if (interaction.isChatInputCommand()) {

            if (interaction.options.data.length > 0) {
                optionstext = ' { '
                for (let option in interaction.options.data) {
                    let val = interaction.options.data[option].value
                    let opname = interaction.options.data[option].name
                    if (opname === 'birthday') {
                        val = '##-##-####';
                    }
                    optionstext += `${opname}: ${val}, `
                }
                optionstext += '}'
            }
            this.logtext = `[ COMMAND ][${this.timestamp}][*status*] /${interaction.commandName}${optionstext} \| ${interaction.user.tag} \| ${interaction.guild.name} \| ${interaction.channel.name}\n`
        }
        else if (interaction.isSelectMenu()) {
            this.logtext = `[ SELECT  ][${this.timestamp}][*status*] ${interaction.customId} SELECTED: ${interaction.values[0]} \| ${interaction.user.tag} \| ${interaction.guild.name} \| #${interaction.channel.name}\n`
        }
    }

    updateStatus(status, error) {
        if (status == this.ERROR) {
            let max = 99999;
            let min = 10000;
            let errorID = Math.floor(Math.random() * (max - min) + min);
            fs.appendFileSync(errorlogpath, `[${errorID}]: ${error.message} \| ${error.stack}\n`);
            this.logtext = this.logtext.replace(/\*status\*/, `${this.ERROR}: ${errorID}`);
        } else if (status == this.OK) {
            this.logtext = this.logtext.replace(/\*status\*/, `${this.OK}`);
        }
        fs.appendFileSync(activitylogpath, this.logtext);
        console.log(this.logtext.slice(0, -1));
    }
}

module.exports = { Logger };