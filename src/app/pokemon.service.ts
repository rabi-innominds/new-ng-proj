import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {map} from "rxjs/operators";

import { Pokemon } from "./pokemon";


@Injectable({
  providedIn: "root"
})
export class PokemonService {
  private baseUrl: string = "https://pokeapi.co/api/v2";

  constructor(private http: HttpClient
    ) {}

  listPokemons() {
    // Otherwise make the API call
    return this.http
      .get(`${this.baseUrl}/pokedex/1/`)
      .pipe(map((res: any) => {
        let pokemons: Pokemon[] = [];
        let reducedPokemonEntries = res.pokemon_entries.splice(0, 50);

        reducedPokemonEntries.forEach(entry => {
          let pokemon = new Pokemon();
          pokemon.name = entry.pokemon_species.name;
          pokemon.id = entry.entry_number;
          pokemon.imageurl = `https://rawgit.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

          pokemons.push(pokemon);
        });
        // Set value to state
        return pokemons;
      }));
  }

  getDetails(id: number) {
    return this.http
      .get(`${this.baseUrl}/pokemon/${id}/`)
      .pipe(map((res: any) => {
        let response = res;
        let pokemon = new Pokemon();
        pokemon.name = response.name;
        pokemon.id = response.id;
        pokemon.imageurl = `https://rawgit.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

        response.types.forEach(type => {
          pokemon.types.push(type.type.name);
        });

        response.stats.forEach(stat => {
          pokemon.stats.push({
            name: stat.stat.name,
            value: stat.base_stat
          });
        });

        for (let sprite in response.sprites) {
          if (response.sprites[sprite]) {
            pokemon.sprites.push({
              name: sprite,
              imagePath: response.sprites[sprite]
            });
          }
        }

        return pokemon;
      }));
  }
}
