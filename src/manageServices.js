var config = require('../config/config.json');
var removeRoute = require('express-remove-route');



function createGET(app, db, project, service){
    var serviceClosure=function (req, res) {
        const actualService=db.get("projects").find({id:project.id}).get("services").find({id:service.id}).value();
        if(actualService.respError){
            res.status(actualService.errorCode).send(actualService.errorBody);
        }else{
            res.send(service.successBody);
        }
    };
    app.get(config.baseEndpoint+ "/" + project.baseEndpoint+ "/"+ service.endpoint, serviceClosure);
}

function createPOST(app, db, project, service){
    var serviceClosure=function (req, res) {
        const actualService=db.get("projects").find({id:project.id}).get("services").find({id:service.id}).value();
        if(actualService.respError){
            res.status(actualService.errorCode).send(actualService.errorBody);
        }else{
            res.send(service.successBody);
        }
    };
    app.post(config.baseEndpoint+ "/" + project.baseEndpoint+ "/"+ service.endpoint, serviceClosure);
}

function createPUT(app, db, project, service){
    var serviceClosure=function (req, res) {
        const actualService=db.get("projects").find({id:project.id}).get("services").find({id:service.id}).value();
        if(actualService.respError){
            res.status(actualService.errorCode).send(actualService.errorBody);
        }else{
            res.send(service.successBody);
        }
    };
    app.put(config.baseEndpoint+ "/" + project.baseEndpoint+ "/"+ service.endpoint, serviceClosure);
}

function createDELETE(app, db, project, service){
    var serviceClosure=function (req, res) {
        const actualService=db.get("projects").find({id:project.id}).get("services").find({id:service.id}).value();
        if(actualService.respError){
            res.status(actualService.errorCode).send(actualService.errorBody);
        }else{
            res.send(service.successBody);
        }
    };
    app.delete(config.baseEndpoint+ "/" + project.baseEndpoint+ "/"+ service.endpoint, serviceClosure);
}

function createService(app, db, project, service){
    if(project && service){
        console.log("Creo servizio progetto", project.id, "servizio", service.id);
        switch(service.method){
            case "GET":
                createGET(app, db, project, service);
                break;
            case "POST":
                createPOST(app, db, project, service);
                break;
            case "DELETE":
                createDELETE(app, db, project, service);
                break;
            case "PUT":
                createPUT(app, db, project, service);
                break;
            default:
                return false;
        }
        return true;
    }
}

module.exports = function(app, db) {
    return {
        getProjects:function(req, res) {
            res.send(db.get("projects").map(function(project){
                return {
                id: project.id,
                name: project.name,
                baseEndpoint: project.baseEndpoint
                }
            }));
        },
        addProject:function(req, res) {
            if(db.get("projects").find({ baseEndpoint: req.body.baseEndpoint }).value()){
                res.status(401).send({
                    message: "Endpoint "+req.body.baseEndpoint+" already exists"
                });
                return;
            }
            if(!req.body.baseEndpoint || req.body.baseEndpoint==="" || !req.body.name || req.body.baseEndpoint===""){
                res.status(400).send({
                    message: "You need to specify name and baseEndpoint fields"
                });
                return;
            }
            const toAdd = (({ name, baseEndpoint }) => ({ name, baseEndpoint: baseEndpoint.trimChar('/'), id:Math.abs(baseEndpoint.hashCode()).toString(), services:[] }))(req.body);
            db.get("projects").push(toAdd).write();
            res.send(toAdd);
        },
        deleteProject:function(req, res) {
            if(db.get("projects").find({ id: req.params.id }).value()){
                const servicesEndpoint=config.baseEndpoint + "/"+db.get("projects").find({ id: req.params.id }).value().baseEndpoint;
                removeRoute(app, servicesEndpoint);
                res.send(db.get('projects').remove({ id: req.params.id }).write()); 
            }else{
                res.status(401).send({
                message: "The project does not exists"
                }); 
            }
        },
        getServices:function(req, res) {
            res.send(db.get("projects").find({ id: req.params.id }).get("services").map(function(service){
                return {
                id: service.id,
                description: service.description,
                endpoint: service.endpoint,
                method: service.method,
                successBody: service.successBody, //TODO pensare in caso a qualcosa di piu sofisticato che crea dei crud automatici
                respError: service.respError,
                errorBody: service.errorBody,
                errorCode: service.errorCode
                }
            }));
        },
        addService:function(req, res) {
            var project = db.get("projects").find({ id: req.params.id });
            if(!project.value()){
                res.status(401).send({
                    message: "The project does not exists"
                });
                return;
            }
            if(!req.body.endpoint || req.body.endpoint==="" || !req.body.method || ["GET", "POST", "DELETE", "PUT"].indexOf(req.body.method)===-1){
                res.status(400).send({
                    message: "You need to specify an endpoint and method must be one of this: GET, POST, DELETE, PUT"
                });
                return;
            }
            const toAdd = (({ description,endpoint,method,respError,errorBody,successBody, errorCode }) => ({ 
                id:Math.abs((endpoint.trimChar('/') + method).hashCode()).toString(), 
                description: description || "", 
                endpoint: endpoint.trimChar('/'),
                method,
                errorCode: errorCode || 500,
                successBody: successBody || {},
                respError: (respError!==null && respError!==undefined) ?respError : false,
                errorBody: errorBody || { message: "Something went wrong"}
            }))(req.body);
            if(project.get("services").find({id:toAdd.id}).value()){
                res.status(400).send({
                    message: "Seems that this service is already existing"
                });
                return;
            }
            project.get("services").push(toAdd).write();
            createService(app, db, project.value(), toAdd);
            res.send(toAdd);
        },
        deleteService:function(req, res) {
            var project = db.get("projects").find({ id: req.params.id });
            if(project.value()){
                var service = project.get("services").find({ id: req.params.serviceId });
                if(service.value()){
                    const servicesEndpoint= config.baseEndpoint + "/" + project.value().baseEndpoint + "/"+ service.value().endpoint;
                    removeRoute(app, servicesEndpoint);
                    res.send(project.get("services").remove({ id: req.params.serviceId }).write()); 
                }else{
                    res.status(401).send({
                        message: "The service does not exists"
                    });
                }
            }else{
                res.status(401).send({
                    message: "The project does not exists"
                });
            }
        },
        createService:function(project, service){
            return createService(app, db, project, service);
        }
    };
};