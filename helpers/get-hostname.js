module.exports = {
    // source: https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
    getHostName : (url) => {
        let hostname;

        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
    
        // find and remove port number
        hostname = hostname.split(':')[0];
        // find and remove "?"
        hostname = hostname.split('?')[0];
    
        return hostname;
    }
}