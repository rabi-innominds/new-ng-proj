import { Component, OnDestroy, OnInit } from "@angular/core";
import { PokemonService } from "../pokemon.service";
import { Pokemon } from "../pokemon";
import { Meta, Title } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-pokemon-list",
  templateUrl: "./pokemon-list.component.html",
  styleUrls: ["./pokemon-list.component.css"]
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemonList: Pokemon[];
  private destroy$: Subject<null> = new Subject();

  constructor(
    private pokemonService: PokemonService,
  ) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.pokemonService.listPokemons().pipe(takeUntil(this.destroy$)).subscribe(pokemons => {
      this.pokemonList = pokemons;
    });
  }
}
