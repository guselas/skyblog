class Validator {
    constructor() {
        this.badWords = [{}, {}, {}, {}, {}, {}];
    }

    loadBadWords() {
        this.badWords = [{}, {}, {}, {}, {}, {}];
        var data = require('./badWords.json');
        for (let item of data) {
            switch (item.level) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    this.badWords[item.level][item.word] = true;
                    break;
            }
        }
        return this.badWords;
    }

    async loadBadWordsFromDB(BadWordDAO) {
        let ok = false;
        this.badWords = [{}, {}, {}, {}, {}, {}];
        let badWordsDAO = await BadWordDAO.find({});
        if (badWordsDAO) {
            for (let badWordDAO of badWordsDAO) {
                switch (badWordDAO.level) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        this.badWords[badWordDAO.level][badWordDAO.word] = true;
                        ok = true;
                        break;
                }
            }
        }
        if (!ok) {
            this.loadBadWords();
        }
        return this.badWords;
    }

    validate(level, value) {
        level = !level ? 5 : Number(level);
        if (level > 5) {
            level = 5;
        }
        if (level < 0) {
            level = 0;
        }
        value = value.toLowerCase();
        let badWordsInTense = [];
        let wordsInTense = value.split(/[;!:, ]/).filter(Boolean);
        for (let word of wordsInTense) {
            for (let n = 0; n <= level; n++) {
                //is word included in the diccionary for each level?
                if (word in this.badWords[n]) {
                    badWordsInTense.push(`word: ${word}(level ${n})`);
                    break;
                }
            }
        }
        return {
            ok: badWordsInTense.length == 0,
            words: badWordsInTense
        };
    }
}

module.exports = Validator;