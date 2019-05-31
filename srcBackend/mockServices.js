const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const manageServicesWrapper = require("./manageServices");

db.defaults({ 
  projects: []
}).write()

module.exports = function(app) {
  const manageServices = manageServicesWrapper(app, db);

  app.get("/login", function (req, res) {
    res.send({
      success:true
    });
  });


  //get projects
  app.get("/export", function(req, res){
    res.send(db.value());
  });

  //get projects
  app.get("/projects", manageServices.getProjects);

  //add project
  app.post("/projects", manageServices.addProject);

  //delete project
  app.delete("/projects/:id", manageServices.deleteProject);

  //get services of a project
  app.get("/projects/:id/services", manageServices.getServices);

  //add service of a project
  app.post("/projects/:id/services", manageServices.addService);

  //delete service of a project
  app.delete("/projects/:id/services/:serviceId", manageServices.deleteService);

  //edit service of a project
  app.post("/projects/:id/services/:serviceId", manageServices.editService);

  //restore
  const dbSituation = db.value();
  if(dbSituation && dbSituation.projects){
    dbSituation.projects.forEach(project => {
      if(project.services){
        project.services.forEach(service => {
          manageServices.createService(project, service);
        });
      }
    });
  }

  //TODO servizio import

};