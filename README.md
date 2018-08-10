
# Real-Time Audience Polling app

The real time polling app allows users/participants to answer the questions asked in a live presentation. The web application is based on a public/private key to allow a seamless connection between the presentation administrator and the audience. The app stores all the user responses in a db and provides services to get the dump of all the responses. 

## Getting Started

To run the application in your shadow, clone the git repository and get all the node modules installed in your local. 

### Prerequisites

To start the server, you will need the following:

- A mongo host either local/remote. 
- A redis host to manage the socket communication.

Set the details for the above hosts in the config.js as follows:
```
module.exports = {
    mongoConnectionConfig : {
      "mongo": {
        "hostString": "<mongo-host-string>",
        "user": "<user-name>",
        "db": "<db-name>",
        "password" : "<your-password>"
      }
    },
    redis : {
      host: '<redis-hostname>',
      port: <redis-port> ,
      password: "<redis-password>"
    }
}
```

## Running

```
node server2.js
```

PS: Sorry for the bad filenames.

## About the web app

(http://localhost:8080/) --> This is where your audience will connect. On opening the page, audience will have to enter the public key.
(http://localhost:8080/admin) --> This will be used by the administrator of the presentation to control what questions to publish to the participants.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

**Sunny Shah** 

## Technologies 

* Node JS
* SocketIO
* Redis Store using socket.io-redis module
* ExpressJS
* Twitter-Bootstrap 
* mongoose
* mongoose-cachebox


## License

Feel free to modify/contribute to this repo.
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
