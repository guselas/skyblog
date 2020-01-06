class ValidatorContext {
    constructor() {
        this.badWords = [{}, {}, {}, {}, {}, {}];
    }

    loadBadWords() {
        let badWords = [{}, {}, {}, {}, {}, {}];
        var data = require('../assets/badWords2.json');
        let counter = 0;
        for (let item of data) {
            switch (item.level) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    console.log(item);
                    //TODO: arreglar la recuperacionde los bad words para poder ponerlos como bad words.
                    badWords[item.level][item.word] = true;
                    if(counter++ > 10){
                        return badWords;
                    }
                    break;
            }
        }
        return badWords;
    }


}

function validateText(badWords, value, level) {
    if (level > 5) {
        level = 5;
    }
    if (level < 0) {
        level = 0;
    }
    value = value.toLowerCase();
    let words = value.split(/[;!:, ]/).filter(Boolean);
    console.log(words);
    for (let word of words) {
        for (let n = 0; n <= level; n++) {
            if (word in badWords[n]) {
                words.push(word);
                console.log(word);
                break;
            }
        }
    }
    return {
        ok: words.length == 0,
        words: words
    };
}

// beforeAll(() => {
    
// });

test('ValidateText checks if the word is offensive', () => {
    let validatorContext = new ValidatorContext();
    validatorContext.badWords = validatorContext.loadBadWords();
    let badWord = "";
    //we grant that for each level of the offensive words we get at least one offensive word
    for (let level in validatorContext.badWords) {
        for (let word in validatorContext.badWords[level]) {
            badWord = word;
            break;
        }
        if (badWord) {
            break;
        }
    }
    expect(badWord).not.toBe("");
    let result = validateText(validatorContext.badWords, `this text contains ${badWord} as offensive word`, 5);
    expect(result.ok).not.toBe(true);
    expect(result.words).toBe([badWord]);
    
});