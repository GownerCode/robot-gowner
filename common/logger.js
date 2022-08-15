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
        this.timestamp = new Date().getTime();
        this.ERROR = 'ERROR';
        this.OK = 'OK';
    }

    logActivity(interaction) {
        let optionstext = '';
        if (interaction.isChatInputCommand()) {

            if (interaction.options.data.length > 0) {
                optionstext = ' { '
                for (let option in interaction.options.data) {
                    optionstext += `${interaction.options.data[option].name}: ${interaction.options.data[option].value} `
                }
                optionstext += '}'
            }
            this.logtext = `[ COMMAND ][${this.timestamp}][*status*] ${interaction.commandName}${optionstext} \| ${interaction.user.id} \| ${interaction.guild.id} \| ${interaction.channel.id}\n`
        }
        else if (interaction.isSelectMenu()) {
            this.logtext = `[ SELECT  ][${this.timestamp}][*status*] ${interaction.customId} SELECTED: ${interaction.values[0]} \| ${interaction.user.id} \| ${interaction.guild.id} \| ${interaction.channel.id}\n`
        }
    }

    updateStatus(status, error) {
        if (status == this.ERROR) {
            let max = 99999;
            let min = 10000;
            let errorID = Math.floor(Math.random() * (max - min) + min);
            fs.appendFileSync(errorlogpath, `[${errorID}]: ${error.message}\n`);
            this.logtext = this.logtext.replace(/\*status\*/, `${this.ERROR}: ${errorID}`);
        } else if (status == this.OK) {
            console.log('HERE NOW')
            this.logtext = this.logtext.replace(/\*status\*/, `${this.OK}`);
        }
        fs.appendFileSync(activitylogpath, this.logtext);
        console.log(this.logtext);
    }
}

module.exports = { Logger };