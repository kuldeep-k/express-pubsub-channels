const fs = require('fs');
class Channel {
    constructor() {
        this.channel_file = './channels.json';
    }

    getChannels() {
        return new Promise((resolve) => {
            fs.readFile(this.channel_file, (err, content) => {
                // console.log(content.toString());
                let data = JSON.parse(content.toString());
                resolve(data.data);
            });

        })
    }

    addChannel(channel_name) {
        return new Promise((resolve) => {
            fs.readFile(this.channel_file, (err, content) => {
                content = content.toString();
                let vdata = [];
                let id = 1;

                if(content !== '') {
                    let jcontent = JSON.parse(content);
                    vdata = jcontent.data;
                    id = vdata[vdata.length-1].id+1;
                }

                vdata.push({id: id, name: channel_name});
                let data = {data: vdata};
                fs.writeFile(this.channel_file, JSON.stringify(data), function(err) {
                    resolve(true);
                });
            });
        })
    }

    getChannel(channel_id) {
        return new Promise((resolve) => {
            fs.readFile(this.channel_file, (err, content) => {
                // console.log(content.toString());
                let data = JSON.parse(content.toString());
                let channel_data = data.data.filter((row) => {
                    // console.log('_______')
                    // console.log(row);
                    // console.log(channel_id)
                    if(row.id === channel_id) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if(channel_data[0].name) {
                    resolve(channel_data[0].name);
                } else {
                    resolve('');
                }

            });

        })
    }

}

module.exports = new Channel;
