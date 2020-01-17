const Validator = require('../Validator/Validator');
let validator = new Validator();

beforeAll(()=>{
    validator.loadBadWords();
})

test('Validate checks if the word is offensive', () => {
    let badWord = "";
    //we grant that for each level of the offensive words we get at least one offensive word
    for (let level in validator.badWords) {
        for (let word in validator.badWords[level]) {
            badWord = word;
            break;
        }
        if (badWord) {
            break;
        }
    }
    expect(badWord).not.toBe("");
    let result = validator.validate(5, `this text contains ${badWord} as offensive word`);
    expect(result.ok).not.toBe(true);
    expect(result.words.join()).toBe("word: "+[badWord.word]+"(level"+[badWord.level]+")");

});

test('Validate checks if the word is NOT offensive', () => {
    let result = validator.validate(5, `this text has NO offensive word`);
    expect(result.ok).toBe(true);
    expect(result.words.join()).toBe([].join());
});