class Restaurant {
    _id;
    _name;
    _category;
    _score;
    _serviceType;
    _claimed;

    constructor(name, category) {
        this._name = name;
        this._category = category;
    }

    get id() {
        return this._id;
    }
    
    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get category() {
        return this._category;
    }

    set category(value) {
        this._category = value;
    }

    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
    }

    get serviceType() {
        return this._serviceType;
    }

    set serviceType(value) {
        this._serviceType = value;
    }

    get claimed() {
        return this._claimed;
    }

    set claimed(value) {
        this._claimed = value;
    }
}

try {
    module.exports = Restaurant;
} catch (referenceError) {
    console.log(referenceError.message);
}
