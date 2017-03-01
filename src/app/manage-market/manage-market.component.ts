import { Component, OnInit } from '@angular/core';
import { AccountService } from '../shared/account.service';
import { MarketService } from '../shared/market.service';

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
    this.marketService.add('');
  }

  editMarket(): void {
    this.marketService.edit('');
  }

  deleteMarket(): void {
    this.marketService.delete('');
  }

  viewMarket(): void {
    this.marketService.get()
      .then(response => {
        alert(response.message);
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  ngOnInit() {
    let accessPayload = this.accountService.accessTokenPayload;
    this.hasAddMarketClaim = true; // this.accountService.accessTokenPayload.userSecurityClaims.includes('AddMarket');
    this.hasDeleteMarketClaim = true; // this.accountService.accessTokenPayload.userSecurityClaims.includes('DeleteMarket');
    this.hasEditMarketClaim = true; // this.accountService.accessTokenPayload.userSecurityClaims.includes('EditMarket');
    this.hasViewMarketClaim = true; // this.accountService.accessTokenPayload.userSecurityClaims.includes('ViewMarket');
  }
}
