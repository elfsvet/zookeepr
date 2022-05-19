const fs = require('fs');

const { filterByQuery, findById, createNewZookeeper, validateZookeeper } = require("../lib/zookeepers");
const { zookeepers } = require('../data/zookeepers.json');
jest.mock('fs');

test('creates an zookeeper object', () => {
    const zookeeper = createNewZookeeper(
        { name: 'Alex', age: 15, favoriteAnimal: 'gorilla' },
        zookeepers
    );

    expect(zookeeper.name).toBe('Alex');
    expect(zookeeper.age).toBe(15);
    expect(zookeeper.favoriteAnimal).toBe('gorilla');
});

test('filters by query', () => {
    const startingZookeepers = [
        {
            id: "3",
            name: "Erica",
            age: 23,
            favoriteAnimal: 'cat'
        },
        {
            id: "4",
            name: "Noel",
            age: 20,
            favoriteAnimal: 'gorilla'
        },
    ];
    const updatedAnimals = filterByQuery({ favoriteAnimal: 'gorilla' }, startingZookeepers);
    expect(updatedAnimals.length).toEqual(1);
});

test('finds by id', () => {
    const startingZookeepers = [
        {
            id: "3",
            name: "Erica",
            age: 23,
            favoriteAnimal: 'cat'
        },
        {
            id: "4",
            name: "Noel",
            age: 20,
            favoriteAnimal: 'gorilla'
        },
    ];

    const result = findById("3", startingZookeepers);
    expect(result.name).toBe("Erica");
});

test('validates a zookeeper', () => {
    const zookeeper =
    {
        id: "3",
        name: "Erica",
        age: 23,
        favoriteAnimal: 'cat'
    };

    const invalidZookeeper =
    {
        id: "4",
        age: 20,
        favoriteAnimal: 'gorilla'
    };

    const result = validateZookeeper(zookeeper);
    const result2 = validateZookeeper(invalidZookeeper);

    expect(result).toBe(true);
    expect(result2).toBe(false);

})