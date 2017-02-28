import { Component, OnInit } from '@angular/core';
import { AccountService } from '../shared/account.service';

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

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    let accessPayload = this.accountService.accessTokenPayload;
    this.hasAddMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('AddMarket');
    this.hasDeleteMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('DeleteMarket');
    this.hasEditMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('EditMarket');
    this.hasViewMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('ViewMarket');
  }
}
