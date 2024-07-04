import { ApolloServer } from "@apollo/server";
import fetch from "node-fetch";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./Types.js";

// Resolvers define how to fetch the data for your schema
/* const resolvers = {
  Query: {
    person: async (_, { id }) => {
      try {
        const response = await fetch(`https://swapi.info/api/people/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log("From the line 16, results is ---> : ", result);
        return {
          name: result.name,
          birthYear: result.birthYear,
          planet: result.planet,
          films: result.films,
          vehicles: result.vehicles,
          starships: result.starships,
        };
      } catch (error) {
        console.error("Error fetching people:", error);
        throw error; // Ensure errors are propagated correctly
      }
    },
  },
}; */

const resolvers = {
  Query: {
    person: async (_, { id }) => {
      try {
        const response = await fetch(`https://swapi.info/api/people/${id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        // Fetch homeworld details separately
        const homeworldResponse = await fetch(result.homeworld);
        const homeworld = await homeworldResponse.json();

        // Fetch films details separately
        const films = await Promise.all(
          result.films.map(async (filmUrl) => {
            const filmResponse = await fetch(filmUrl);
            return filmResponse.json();
          })
        );

        // Fetch vehicles details separately
        const vehicles = await Promise.all(
          result.vehicles.map(async (vehicleUrl) => {
            const vehicleResponse = await fetch(vehicleUrl);
            return vehicleResponse.json();
          })
        );

        // Fetch starships details separately
        const starships = await Promise.all(
          result.starships.map(async (starshipUrl) => {
            const starshipResponse = await fetch(starshipUrl);
            return starshipResponse.json();
          })
        );

        return {
          name: result.name,
          birthYear: result.birth_year,
          planet: {
            name: homeworld.name,
            climate: homeworld.climate,
            terrain: homeworld.terrain,
          },
          films: films.map((film) => ({
            title: film.title,
            episode: film.episode_id,
          })),
          vehicles: vehicles.map((vehicle) => ({
            name: vehicle.name,
            model: vehicle.model,
            class: vehicle.vehicle_class,
            cost: vehicle.cost_in_credits,
          })),
          starships: starships.map((starship) => ({
            name: starship.name,
            model: starship.model,
            class: starship.starship_class,
            cost: starship.cost_in_credits,
          })),
        };
      } catch (error) {
        console.error("Error fetching person:", error);
        throw error; // Ensure errors are propagated correctly
      }
    },
  },
};

// Create an ApolloServer instance with your schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
