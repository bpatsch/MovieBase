import {Component, Input, OnInit} from '@angular/core';
import {ImbdService} from "../services/imdb.api.service";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss']
})
export class RatingStarsComponent implements OnInit {
  @Input() rate: number;
  @Input() movieId: string;
  @Input() customStyle: {};

  private rated: string;

  constructor(private imbdService: ImbdService, private api: ApiService) { }

  ngOnInit() {
  }

  selectRate(rate) {
    const token = localStorage.getItem("token");
    //spam prevention
    if (this.rate == rate)
      return;
    let prev_rate = this.rate;
    this.rate = rate;
    console.log("RATE SENT",rate,this.movieId)
    if(token) {
      const data = {
        imdbId: this.movieId.slice(2),
        rate: rate
      }
      this.api.sendRate(token, data).subscribe( res => {
        if(res["rated"]) {
          this.rated = "Thank you for your rating.";
        } else if (res["secs"]) {
          this.rate = prev_rate;
          (<HTMLInputElement>document.getElementById("star-"+this.rate)).checked = true;
          this.rated = "Too fast! Wait ";
          if (res["secs"] === 0)
            this.rated += "a moment."
          else if (res["secs"] === 1)
            this.rated += "a second.";
          else
            this.rated += res["secs"] + " seconds.";
        } else {
          this.rated = "An error occurred while sending your rating.";
        }
      });
    }
  }

}
