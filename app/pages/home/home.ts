import {Component} from "@angular/core";
import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {DetailsPage} from '../details/details';
import {GitHubService} from '../../services/github';
import {Geolocation, BarcodeScanner} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [GitHubService]
})

export class HomePage {
  public username;
  public foundRepos;
  public barcode;
  public barcodeFormat;
  public lat;
  public alt;
  public count = 0;

  static get parameters() {
        return [[GitHubService], [Platform], [NavController]];
    }

  constructor(private github: GitHubService,
    private nav: NavController,
    private platform : Platform) {

      this.github = github;
      this.platform = platform;
      this.nav = nav;

      let watch = Geolocation.watchPosition();
      watch.subscribe((data) => {
        this.lat =  data.coords.latitude;
        this.alt = data.coords.longitude;
        this.count++;
      })
  }


  getRepos() {
    this.github.getRepos(this.username).subscribe(
      data => {
        this.foundRepos = data.json();
      },
      err => console.error(err),
      () => console.log('getRepos completed')
    );
  }

  goToDetails(repo) {
    this.nav.push(DetailsPage, { repo: repo });
  }

  scan() {
        console.log("Entrou aqui");

        BarcodeScanner.scan().then ((result) => {
            if (!result.cancelled)
            {
              console.log(result);
              this.barcode = result.text;
              this.barcodeFormat = result.format;
//              const barcodeData = new BarcodeData(result.text, result.format);
//              this.scanDetails(barcodeData)
            }}).catch((err) => {
              alert(err);
            })
/*
            Geolocation.getCurrentPosition().then((resp) => {
                console.log(resp.coords);
                this.lat =  resp.coords.latitude;
                this.alt = resp.coords.longitude;
            })
*/
    }

    scanDetails(details) {
     // this.nav.push(ScanPage, {details: details});
    }


}

export class BarcodeData {
  constructor(
    public text: String,
    public format: String
  ) {}
}
