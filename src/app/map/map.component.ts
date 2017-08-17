import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapService } from '../services/map.service';
import { ISite } from '../shared/site.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
	
	site: any;
	siteName: string;
	siteType: string;
	siteComments: string;
	location: any;
	  
	constructor(private _mapService: MapService, private _route: ActivatedRoute) {

	}

	ngOnInit() {
		this.site = this._mapService.getSite(
		+this._route.snapshot.params['id'])
	}
	
	ngAfterViewInit() {
		this._mapService.plotSite(+this._route.snapshot.params['id']);
		this.siteName = this.site.name;
		this.siteType = this.site.type;
		this.siteComments = this.site.comments;
	}
}
