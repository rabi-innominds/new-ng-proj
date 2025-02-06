import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { PokemonService } from "../pokemon.service";
import { Pokemon } from "../pokemon";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-pokemon-details",
    templateUrl: "./pokemon-details.component.html",
    styleUrls: ["./pokemon-details.component.css"],
    standalone: false
})
export class PokemonDetailsComponent implements OnInit, OnDestroy {
  id: number;
  pokemon: Pokemon;
  destroy$ = new Subject<null>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
  ) {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.id = parseInt(params.get("id"));
      this.pokemonService.getDetails(this.id).pipe(takeUntil(this.destroy$)).subscribe(details => {
        this.pokemon = details;
        this.pokemon.sprites = this.pokemon.sprites.filter(sprite => typeof (sprite.imagePath) === 'string');
      });
    });
  }

  getImage(sprite: any) {
    return typeof (sprite.imagePath) === 'string' ? sprite.imagePath : sprite.imagePath.dream_world.font_default;
  }
}
