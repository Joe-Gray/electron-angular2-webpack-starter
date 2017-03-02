import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../shared/services/account.service';
import { MarketService } from '../shared/services/market.service';
import { DialogComponent } from '../shared/components/dialog.component';

@Component({
  selector: 'me-manage-market',
  templateUrl: './manage-market.component.html',
  styleUrls: ['./manage-market.component.scss']
})
export class ManageMarketComponent implements OnInit {

  public hasAddMarketClaim = false;
  public hasDeleteMarketClaim = false;
  public hasEditMarketClaim = false;
  public hasViewMarketClaim = false;

  constructor(
    private marketService: MarketService,
    private accountService: AccountService,
    private modalService: NgbModal) {}

  ngOnInit() {
    let accessPayload = this.accountService.accessTokenPayload;
    this.hasAddMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('AddMarket');
    this.hasDeleteMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('DeleteMarket');
    this.hasEditMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('EditMarket');
    this.hasViewMarketClaim = this.accountService.accessTokenPayload.userSecurityClaims.includes('ViewMarket');
  }

  public addMarket(): void {
    this.marketService.add('')
      .then(response => {
        this.showDialog(response.json().message);
      })
      .catch(this.handleError);
  }

  public editMarket(): void {
    this.marketService.edit('')
      .then(response => {
        this.showDialog(response.json().message);
      })
      .catch(this.handleError);
  }

  public deleteMarket(): void {
    this.marketService.delete('')
      .then(response => {
        this.showDialog(response.json().message);
      })
      .catch(this.handleError);
  }

  public viewMarket(): void {
    this.marketService.get()
      .then(response => {
        this.showDialog(response.json().message);
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  private handleError(error: any): void {
    console.log(error.message || error);
  }

  private showDialog(message: string) {
    const modalRef = this.modalService.open(DialogComponent);
    modalRef.componentInstance.title = 'Manage Market';
    modalRef.componentInstance.message = message;
  }
}
