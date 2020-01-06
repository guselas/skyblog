const CrudService = require('./CrudService');
const BadWordDAO = require('../DAO/BadWordDAO');
const BadWordDTO = require('../DTO/BadWordDTO');
const FullBadWordDTO = require('../DTO/Full/FullBadWordDTO');

class BadWordsService extends CrudService {
    constructor(services) {
        super("BadWordService", BadWordDAO, BadWordDTO, FullBadWordDTO, services);
    }

    async canCreateOne(badWordDTO, errors) {
        badWordDTO.normalizeWord();
        var badWordsByWord = await this.findBadWordsByWord(badWordDTO.word, errors);
        if (badWordsByWord) {
            if (badWordsByWord.length == 0) {
                return true;
            }
            errors.push(`${this.nameService}.canCreateOne(): Word "${badWordDTO.word}" duplicated`);
        }
        return false;
    }

    async canUpdateOne(badWordDTO, errors) {
        badWordDTO.normalizeWord();
        var badWordDAO = await this.DAO.BadWordDAO.findById(badWordDTO.id);
        if (badWordDAO) {
            if (await this.verifyUpdatedBadWord(badWordDTO, badWordDAO)) {
                return true;
            }
            errors.push(`${this.nameService}.canUpdateOne(): word ${badWordDTO.word} already exists`)
        }
        return false;
    }


    //#region Aux Functions
    async findBadWordsByWord(word, errors) {
        word = word.toLowerCase().trim();
        let badWordsDTO = [];
        let badWordsDAO = await this.DAO.BadWordDAO.find({
            word: word
        });
        if (badWordsDAO) {
            for (let badWordDAO of badWordsDAO) {
                let badWordDTO = new this.DTO.BadWordDTO();
                badWordsDTO.push(badWordDTO.fromDAO(badWordDAO));
            }
        }
        return badWordsDTO;
    }

    async verifyUpdatedBadWord(badWordDTO, badWordDAO) {
        if (badWordDTO.word != badWordDAO.word) {
            let words = await this.DAO.BadWordDAO.find({
                word: badWordDTO.word
            }, {
                word: 1,
                _id: 1
            });
            if (words) {
                for (let word in words) {
                    if (word._id != badWordDAO._id) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    //#endregion
}

module.exports = BadWordsService;
