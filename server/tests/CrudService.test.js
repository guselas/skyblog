class CrudContext {
    constructor(host, dbName) {
        this.host = host;
        this.dbName = dbName;

        this.mongoose = require('mongoose');

        //Create an auxiliar object services to hold .services, .DTO & .DAO
        let Services = require('../Services/Services');
        let services = new Services();

        //Crud Services
        //DAO constructors
        services.DAO.BadWordDAO = require('../DAO/BadWordDAO');
        services.DAO.BearerDAO = require('../DAO/BearerDAO');
        services.DAO.CommentDAO = require('../DAO/CommentDAO');
        services.DAO.PostDAO = require('../DAO/PostDAO');
        services.DAO.UserDAO = require('../DAO/UserDAO');
        //DTO constructors
        services.DTO.BadWordDTO = require('../DTO/BadWordDTO');
        services.DTO.BearerDTO = require('../DTO/BearerDTO');
        services.DTO.CommentDTO = require('../DTO/CommentDTO');
        services.DTO.PostDTO = require('../DTO/PostDTO');
        services.DTO.UserDTO = require('../DTO/UserDTO');
        //FullDTO constructors
        services.DTO.FullBadWordDTO = require('../DTO/Full/FullBadWordDTO');
        services.DTO.FullBearerDTO = require('../DTO/Full/FullBearerDTO');
        services.DTO.FullCommentDTO = require('../DTO/Full/FullCommentDTO');
        services.DTO.FullPostDTO = require('../DTO/Full/FullPostDTO');
        services.DTO.FullUserDTO = require('../DTO/Full/FullUserDTO');
        //services constructors
        let BadWordsService = require('../Services/BadWordsService');
        let BearersService = require('../Services/BearersService');
        let CommentsService = require('../Services/CommentsService');
        let PostsService = require('../Services/PostsService');
        let UsersService = require('../Services/UsersService');

        //new instances of the services
        services.services.badWordsService = new BadWordsService(services);
        services.services.bearersService = new BearersService(services);
        services.services.commentsService = new CommentsService(services);
        services.services.postsService = new PostsService(services);
        services.services.usersService = new UsersService(services);

        //We catch the properties of variable services & paste in the context directly as properties. 
        this.services = services.services;
        this.DAO = services.DAO;
        this.DTO = services.DTO;

        //Also we have to paste the created service as properties of context
        this.badWordsService = services.services.badWordsService;
        this.bearersService = services.services.bearersService;
        this.commentsService = services.services.commentsService;
        this.postsService = services.services.postsService;
        this.usersService = services.services.usersService;

    }

    async connect(host, dbName) {
        if (!host) {
            host = this.host;
        }
        if (!dbName) {
            dbName = this.dbName;
        }
        this.db = await this.mongoose.connect(`mongodb://${host}/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 4000
        });
        return this.db;
    }

    disconnect() {

    }


    async clearContextData() {
        if (this.db) {
            for (let dao in this.DAO) {
                await this.DAO[dao].deleteMany({});
            }
        }
    }

    async execTest(fnToTest) {
        await this.connect();
        expect(this.db).not.toBe(null);
        if (this.db) {
            try {
                await fnToTest(this);
            } finally {
                //await this.disconnect();
            }
        }
    }
}

async function testCRUDServiceBasic(classDTO, fnFillDummyRecord, crudService, fnCheckRecordFound, createFails) {
    expect.extend({
        toBeTruthyWithMessage(received, errMsg) {
            const result = {
                pass: received,
                message: () => errMsg
            };
            return result;
        }
    });

    let recordDTO = new classDTO();
    fnFillDummyRecord(recordDTO);
    fnCheckRecordFound(recordDTO);
    let errors = [];
    recordDTO = await crudService.createOne(recordDTO, errors);
    if (createFails) {
        expect(recordDTO == null).toBeTruthyWithMessage(errors);
    } else {
        expect(recordDTO != null).toBeTruthyWithMessage(errors);
        if (recordDTO) {
            recordDTO = await crudService.readOne(recordDTO.id, errors);
            expect(recordDTO).not.toBe(null);
            if (recordDTO) {
                fnCheckRecordFound(recordDTO);
                let deleteResult = await crudService.deleteOne(recordDTO.id, errors);
                expect(deleteResult).toBe(true);
            }
        }
    }
}

async function testCRUDServiceUniqueIndexesCreating(classDTO, fnFillDummyRecord, crudService, fnCheckRecordFound) {
    expect.extend({
        toBeTruthyWithMessage(received, errMsg) {
            const result = {
                pass: !!received,
                message: () => errMsg
            };
            return result;
        }
    });

    let recordDTO = new classDTO();
    fnFillDummyRecord(recordDTO);
    fnCheckRecordFound(recordDTO);
    let errors = [];
    recordDTO = await crudService.createOne(recordDTO, errors);
    expect(recordDTO != null).toBeTruthyWithMessage(errors);
    if (recordDTO) {
        recordDTO = await crudService.readOne(recordDTO.id, errors);
        try {
            expect(recordDTO).not.toBe(null);
            if (recordDTO) {
                //we insert twice the record
                errors = [];
                let record2DTO = new classDTO();
                fnFillDummyRecord(record2DTO);
                fnCheckRecordFound(record2DTO);
                record2DTO = await crudService.createOne(record2DTO, errors);
                expect(record2DTO == null).toBeTruthyWithMessage('The service can insert twice the same Unique Index field creating');
            }
        } finally {
            let deleteResult = await crudService.deleteOne(recordDTO.id, errors);
            expect(deleteResult).toBeTruthy();
        }

    }
}

async function testCRUDServiceUniqueIndexesUpdating(classDTO, fnFillDummyRecord1, fnFillDummyRecord2, crudService, fnCheckRecordFound) {
    expect.extend({
        toBeTruthyWithMessage(received, errMsg) {
            const result = {
                pass: !!received,
                message: () => errMsg
            };
            return result;
        }
    });

    let record1DTO = new classDTO();

    fnFillDummyRecord1(record1DTO);
    fnCheckRecordFound(record1DTO);

    let errors = [];
    let deleteResult;
    record1DTO = await crudService.createOne(record1DTO, errors);
    expect(record1DTO != null).toBeTruthyWithMessage(errors);
    if (record1DTO) {
        record1DTO = await crudService.readOne(record1DTO.id, errors);
        expect(record1DTO).not.toBe(null);
        if (record1DTO) {
            let record2DTO = new classDTO();
            fnFillDummyRecord2(record2DTO);
            record2DTO = await crudService.createOne(record2DTO, errors);
            expect(record2DTO != null).toBeTruthyWithMessage(errors);
            if (record2DTO) {
                record2DTO = await crudService.readOne(record2DTO.id, errors);
                expect(record2DTO).not.toBe(null);
                //we fill the record2DTO with the values of record1DTO
                fnFillDummyRecord1(record2DTO);
                fnCheckRecordFound(record2DTO);

                errors = [];

                let updatedRecord2DTO = await crudService.updateOne(record2DTO, record2DTO.id, errors);
                expect(updatedRecord2DTO == null).toBeTruthyWithMessage("The service doesn't verify the Unique Index fields updating");


                deleteResult = await crudService.deleteOne(record2DTO.id, errors);
                expect(deleteResult).toBeTruthy();
            }
        }
        deleteResult = await crudService.deleteOne(record1DTO.id, errors);
        expect(deleteResult).toBeTruthy();
    }
}


beforeAll(async () => {
    let context = new CrudContext("localhost", "skyBlogTest");
    await context.connect();
    await context.clearContextData();
    await context.usersService.seed();
});


test('After inserting one record Bad Word we should found it', async () => {
    let context = new CrudContext("localhost", "skyBlogTest");
    try {
        await context.execTest(async (context) => {
            //----------------------------------
            //code to test
            //----------------------------------
            await testCRUDServiceBasic(
                context.DTO.BadWordDTO,
                (recordDTO) => {
                    recordDTO.word = "*asshole";
                    recordDTO.level = 3;
                },
                context.badWordsService,
                (recordDTO) => {
                    expect(recordDTO.word).toBe("*asshole");
                    expect(recordDTO.level).toBe(3);
                }, false);
            //----------------------------------
            //end code to test
            //----------------------------------
        });
    } finally {

    }
    context.disconnect();
}, 30000);

test('Inserting twice the same bad word it fails', async () => {
    let context = new CrudContext("localhost", "skyBlogTest");
    try {
        await context.execTest(async (context) => {
            //----------------------------------
            //code to test
            //----------------------------------
            await testCRUDServiceUniqueIndexesCreating(
                context.DTO.BadWordDTO,
                (recordDTO) => {
                    recordDTO.word = "*asshole";
                    recordDTO.level = 3;
                },
                context.badWordsService,
                (recordDTO) => {
                    expect(recordDTO.word).toBe("*asshole");
                    expect(recordDTO.level).toBe(3);
                });

            //----------------------------------
            //end code to test
            //----------------------------------
        });
    } finally {

    }
    context.disconnect();
}, 30000);

test('Updating twice the same bad word it fails', async () => {
    let context = new CrudContext("localhost", "skyBlogTest");
    try {
        await context.execTest(async (context) => {
            //----------------------------------
            //code to test
            //----------------------------------
            await testCRUDServiceUniqueIndexesUpdating(
                context.DTO.BadWordDTO,
                (recordDTO) => {
                    recordDTO.word = "*asshole";
                    recordDTO.level = 3;
                },
                (recordDTO) => {
                    recordDTO.word = "*ass3hole";
                    recordDTO.level = 3;
                },
                context.badWordsService,
                (recordDTO) => {
                    expect(recordDTO.word).toBe("*asshole");
                    expect(recordDTO.level).toBe(3);
                });

            //----------------------------------
            //end code to test
            //----------------------------------
        });
    } finally {

    }
    context.disconnect();
}, 30000);

test('Inserting a Bearer Token with userId dummy it fails, with new Id it fails, and with the first UserId it runs', async () => {
    let context = new CrudContext("localhost", "skyBlogTest");
    try {
        let idValues = [{
                id: 27,
                createFails: true
            },
            {
                id: new context.mongoose.Types.ObjectId(),
                createFails: true
            }
        ];
        //await context.usersService.seed();
        let errors = [];
        let usersDTO = await context.usersService.readAll({}, null, 1, 0, errors);
        if (usersDTO) {
            if (usersDTO.length > 0) {
                idValues.push({
                    id: usersDTO[0].id,
                    createFails: false
                });
            }
        }
        for (let idValue of idValues) {
            await context.execTest(async (context) => {
                //----------------------------------
                //code to test
                //---------------------------------
                let date = new Date();
                await testCRUDServiceBasic(
                    context.DTO.BearerDTO,
                    (recordDTO) => {
                        recordDTO.userId = idValue.id;
                        recordDTO.description = "pepe";
                        recordDTO.validUntil = date;
                        recordDTO.lastAccess = date;

                    },
                    context.bearersService,
                    (recordDTO) => {
                        expect(recordDTO).not.toBe(null);
                        if (recordDTO) {
                            expect(recordDTO.userId.toString()).toBe(idValue.id.toString());
                            expect(recordDTO.description).toBe("pepe");
                            expect(recordDTO.validUntil.getTime()).toBe(date.getTime());
                            expect(recordDTO.lastAccess.getTime()).toBe(date.getTime());
                        }
                    }, idValue.createFails);
                //----------------------------------
                //end code to test
                //----------------------------------
            });
        }
    } finally {

    }
    context.disconnect();
}, 30000);

test('Inserting twice the same user it fails', async () => {
    let context = new CrudContext("localhost", "skyBlogTest");
    try {
        await context.execTest(async (context) => {
            //----------------------------------
            //code to test
            //----------------------------------
            await testCRUDServiceUniqueIndexesCreating(
                context.DTO.UserDTO,
                (recordDTO) => {
                    recordDTO.email = "tronkytron@gmail.com";
                    recordDTO.nickName = "tronkytron";
                    recordDTO.password = "123";
                },
                context.usersService,
                (recordDTO) => {
                    expect(recordDTO.email).toBe("tronkytron@gmail.com");
                    expect(recordDTO.nickName).toBe("tronkytron");
                    expect(recordDTO.password).toBe("123");
                });

            //----------------------------------
            //end code to test
            //----------------------------------
        });
    } finally {

    }
    context.disconnect();
}, 30000);