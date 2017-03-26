import NTask from "../ntask.js";
import Template from "../templates/signup.js";

class Signup extends NTask {
    constructor (body) {
        super();
        this.body = body;        
    }

    render() {
        this.body.innerHTML = Template.render();
        this.body.querySelector("[data-name]").focus();
        this.addEventListener();
    }

    addEventListener() {
        this.formSubmit();       
    }

    formSubmit() {
        const form = this.body.querySelector("form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = e.target.querySelector("[data-name]");
            const email = e.target.querySelector("[data-email]");
            const password = e.target.querySelector("[data-password]");

            const opts = {
                method: "POST",
                url: `${this.URL}/users`,
                json : true,
                body: {
                    name: name.value,
                    email: email.value,
                    password: password.value
                }                                
            };

            this.request(opts, (error, resp, data) => {
                if(error || resp.status == 401) {
                    this.emit("error", error)
                } else {
                    this.emit("signup", data)
                }
            });
        });
    }    
}

module.exports = Signup;