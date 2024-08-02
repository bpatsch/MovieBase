import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImbdService } from '../services/imdb.api.service';
import { ImbdMovie } from '../models/ImbdMovie';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss']
})
export class MoviePageComponent implements OnInit {

  private movieId: string
  private movie: ImbdMovie
  private rate: number
  private rated: string

  constructor(private route: ActivatedRoute, private imbdService: ImbdService, private api: ApiService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.movieId = params['id'].substring(2);
      this.imbdService.getMovie(this.movieId).subscribe( res => {
        this.movie = Object.assign(new ImbdMovie(), res);
      })
      const token = localStorage.getItem("token");
      if(token) {
        this.api.getRate(token, this.movieId).subscribe( res => {
          if(!Object.keys(res).length) {
            this.rated = "There was an error retrieving your rating."
          } else if(res["rate"] !== 0) {
            this.rate = res["rate"];
            (<HTMLInputElement>document.getElementById("star-"+this.rate)).checked = true;
            this.rated = "Your rating: " + this.rate +"/5"
          } else {
            this.rated = "You haven't rated this movie yet."
          }
        })
      }
    });
  }

  selectRate(rate) {
    const token = localStorage.getItem("token");
    //spam prevention
    if (this.rate == rate)
      return;
    let prev_rate = this.rate;
    this.rate = rate;
    if(token) {
      const data = {
        imdbId: this.movieId,
        rate: rate
      }
      this.api.sendRate(token, data).subscribe( res => {
        if(res["rated"]) {
          this.rated = "Thank you for your rating.";
        } else if (res["secs"]) {
          this.rate = prev_rate;
          (<HTMLInputElement>document.getElementById("star-"+this.rate)).checked = true;
          this.rated = "Too fast! Please wait ";
          if (res["secs"] === 0)
            this.rated += "one moment."
          else if (res["secs"] === 1)
            this.rated += "a second.";
          else if (res["secs"] === 5)
            this.rated += "5 seconds.";
          else
            this.rated += res["secs"] + " seconds.";
        } else {
          this.rated = "An error occured while sending the rating.";
        }
      });
    }
  }
}
