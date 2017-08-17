import { Injectable } from '@angular/core';
import { ISite } from '../shared/site.model';
import { SAVED_SITES } from '../shared/sites';

@Injectable()
export class SiteService {

  constructor() { }

  getSites(): ISite[] {
	  return SAVED_SITES.slice(0);
  }
  
  getTotalSites(allSites: ISite[]) {
	  return allSites.length;
  }
}
