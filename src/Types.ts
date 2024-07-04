export const typeDefs = `
type Planet {
  name: String
  climate: String
  terrain: String
}  
type Film {
    title: String
    episode: Int
  }
type Vehicle {
  name: String
  model: String
  class: String
  cost: String
}
type Starship {
  name: String
  model: String
  class: String
  cost: String
}
  type Person {
    name: String
    birthYear: String
    planet: Planet
    films: [Film]
    vehicles: [Vehicle]
    starships: [Starship]
  }
  type Query {
    person(id: Int!): Person
  }
`;