Per poter loggarsi è necessario chiamare da browser il servizio all'endpoint /wtc-mock/secured/login (o qualsiasi
altro servizio mock ma da browser) ed inserire le credenziali:
    username: wintech
    password: password

tutti i servizi mock si trovano nella route /wtc-mock , quindi se nel file config.json il campo "endpoint" è uguale a
"/project-rest-api/service", il servizio è raggiungibile all'endpoint /mocks/project-rest-api/service

Per creare un servizio mock è necessario:
    1) inserire la configurazione del servizio nel file config.json
    2) riavviare il server
    (a regime basterà fare un commit, jenkins farà tutto da solo)

come inserire la configurazione del servizio mock:
    compilando il file config.json
    {
        "projects":[
            {
                "name":"nome progetto",
                "services":[
                    {
                        "endpoint":"/colmar-rest-api/materials", //endpoint
                        "methodType":"GET", //GET POST PUT DELETE
                        "response": risposta che verrà messa nel body della risposta
                    },
                    ...elenco servizi per quel progetto
                ]
            },
            ... altri progetti e servizi annessi
        ]
    }

    NB: controllare che il config.json sia in un formato JSON valido prima di committare.


Per eseguirlo in locale:
    npm i
    gulp build
    node runner.js [questo esegue il processo come daemon]
	
Per stopparlo, cCon l'assunzione che nessun altro progetto utilizzi 'forever'
	node stopper.js
	