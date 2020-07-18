class Dog {
    attack_ability = true
    attack_behavior = 'bited'
    attack_value = 20
    constructor(name) {
        this.name = name
    }
}

class Person {
    healthValue = 100
    constructor(name) {
        this.name = name
    }
    show_hp() {
        console.log(this.name, "'s healthValue = ", this.healthValue)
    }
    hurt(someAttacker) {
        this.show_hp()
        if (someAttacker.attack_ability) {
            console.log(someAttacker.name, someAttacker.attack_behavior, this.name)
            this.healthValue -= someAttacker.attack_value
            this.show_hp()
        } else {
            console.log(someAttacker.name, ' can not hurt ', this.name)
        }
    }
}

const dog = new Dog('Tom')
const person = new Person('John')

person.hurt(dog)
