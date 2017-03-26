import NTask from "../ntask.js";
import Template from "../templates/tasks.js";

class Tasks extends NTask {
    constructor (body) {
        super();
        this.body = body;
    }

    render() {
        this.renderTaskList();        
    }

    renderTaskList() {
        const opts = {
            method: "GET",
            url: `${this.URL}/tasks`,   
            json: true,         
            headers: {
                authorization: localStorage.getItem("token")
            }
        };

        this.request(opts, (error, resp, tasks) => {
            if(error) {
                this.emit("error", error);
            } else {
                this.body.innerHTML = Template.render(tasks);
                this.addEventListener();
            }
        });
    }

    addEventListener() {
        this.taskDoneCheckbox();
        this.taskRemoveClick();
    }

    taskDoneCheckbox() {
        const dones = this.body.querySelectorAll("[data-done]");
        for(let i = 0; i < dones.length; i++) {
            dones[i].addEventListener("click", (e) => {
                e.preventDefault();
                const id = e.target.getAttribute("data-task-id");
                const done = e.target.getAttribute("data-task-done");
                const opts = {
                    method: "PUT",
                    url: `${this.URL}/tasks/${id}`,                                     
                    headers: {
                        "authorization": localStorage.getItem("token"),
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({done: !done})
                };
                this.request(opts, (error, resp, data) => {
                    if(error || resp.status === 412) {                        
                        this.emit("update-error", error);
                    } else{
                        this.emit("update");
                    }
                });
            });
        }
    }

    taskRemoveClick() {
        const removes = this.body.querySelectorAll("[data-remove]");
        for(let i = 0, max = removes.length; i < max; i++) {
            removes[i].addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm("Do you really wanna delete this task?")) {
                const id = e.target.getAttribute("data-task-id");
                const opts = {
                        method: "DELETE",
                        url: `${this.URL}/tasks/${id}`,
                        headers: {
                            authorization: localStorage.getItem("token")
                    }
                };
                this.request(opts, (err, resp, data) => {
                        if (err || resp.status === 412) {
                            this.emit("remove-error", err);
                        } else {
                            this.emit("remove");
                        }
                    });
                }
            });
        }
    }
}

module.exports = Tasks;