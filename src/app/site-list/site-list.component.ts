import { Component, OnInit } from '@angular/core';
import { ISite } from '../shared/site.model';
import { SiteService } from '../services/site.service';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements OnInit {

	sites: ISite[];
	totalSites: number
	
	constructor(private _siteService: SiteService) { }

	ngOnInit() {
		this.sites = this._siteService.getSites();
		this.totalSites = this._siteService.getTotalSites(this.sites);
	}
}
