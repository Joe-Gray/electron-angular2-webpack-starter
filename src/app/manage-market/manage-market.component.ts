import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { AccountService } from '../shared/services/account.service';
import { MarketService } from '../shared/services/market.service';

@Component({
  selector: 'me-manage-market',
  templateUrl: './manage-market.component.html',
  styleUrls: ['./manage-market.component.css']
})
export class ManageMarketComponent implements OnInit {

  hasAddMarketClaim = false;
  hasDeleteMarketClaim = false;
  hasEditMarketClaim = false;
  hasViewMarketClaim = false;

  constructor(private marketService: MarketService,
    private accountService: AccountService) {}

  addMarket(): void {
    this.marketService.add('')
      .then(response => {
        alert(response.json().message);
      })
      .catch(this.handleError);
  }

  editMarket(): void {
    this.marketService.edit('')
      .then(response => {
        alert(response.json().message);
      })
      .catch(this.handleError);
  }

  deleteMarket(): void {
    this.marketService.delete('')
      .then(response => {
        alert(response.json().message);
      })
      .catch(this.handleError);
  }

  viewMarket(): void {
    this.marketService.get()
      .then(response => {
        alert(response.json().message);
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  private handleError(error: any): void {
    console.log(error.message || error);
  }

  ngOnInit() {
    let accessPayload = this.accountService.accessTokenPayload;
    this.hasAddMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('AddMarket');
    this.hasDeleteMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('DeleteMarket');
    this.hasEditMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('EditMarket');
    this.hasViewMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('ViewMarket');
  }
}
