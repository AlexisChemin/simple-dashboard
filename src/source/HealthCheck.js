import request from "superagent-bluebird-promise";
import Source from "./Source";
import Logger from "../util/Logger";


var log = new Logger(__filename);


export default class HealthCheck extends Source {
    constructor(data) {
        super(data);
        this.url = data.url;
        this.link = data.link || data.url;
    }

    fetchData() {
        return request.get(this.url)
            .withCredentials()
            .promise()
            .catch(e => e); // The healthcheck returns an error status code if anything is unhealthy.
    }

    getStatus() {
        return this.fetchData()
            .catch(e => {
            return {
                    title: this.title,
                    link: this.link,
                    status: "danger",
                    messages: [{
                        message: "Error :  " + e
                    }]
                };
            })
            .then(response => {


                var status = "success";
                var messages = [{
                        message: "Response status code : " + response.status
                    }];

                if (response.status != 200) {
                    status = "danger";
                    messages.push({
                        message: "Bad response from healthcheck"
                    });
                }

                return {
                    title: this.title,
                    link: this.link,
                    status: status,
                    messages: messages
                };;
            });
    }
}

HealthCheck.type = "health-check";