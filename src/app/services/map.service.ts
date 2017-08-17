import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ISite } from '../shared/site.model';
import { SiteService } from '../services/site.service';
import { SAVED_SITES } from '../shared/sites';

var apiToken = environment.MAPBOX_API_KEY;
declare var omnivore: any;
declare var L: any;

@Injectable()
export class MapService {

	constructor() { }
  
	getSite(id: number) {
		return SAVED_SITES.slice(0).find(run => run.id == id)
	};

	plotSite(id: number) {
		var topoMap = L.esri.basemapLayer("Topographic"),
			usaTopo = L.esri.basemapLayer("USATopo"),
			streetMap = L.esri.basemapLayer("Streets"),
			imageMap = L.esri.basemapLayer("Imagery"),
			grayMap = L.esri.basemapLayer("Gray");
		var baseMaps = {
			"Satelite" : imageMap,
			"Streets": streetMap,
			"Topographic": topoMap,
			"USA Topo" : usaTopo,
			"Gray" : grayMap
		}; 
		var smaUrl = "http://gis.blm.doi.net/arcgis/rest/services/lands/BLM_Natl_SMA_Cached_with_PriUnk/MapServer";
		var smaLayer = L.esri.dynamicMapLayer({
			url : smaUrl,
			opacity : 0.50,
			useCors : false
		}).bindPopup(
			function(err, featureCollection, response){
				var agency = featureCollection.features[0].properties.ADMIN_UNIT_NAME;
				if(agency)
					return console.log(agency);
				//return console.log(featureCollection.features[0]);
		});
		var BLMAdminUrl = "http://gis.blm.doi.net/arcgis/rest/services/admin_boundaries/BLM_Natl_Admin_Units/MapServer";
		var BLMAdminLayer = L.esri.dynamicMapLayer({
			url : BLMAdminUrl,
			opacity : 0.50,
			useCors : false
		}).bindPopup(
			function(err, featureCollection, response){
				var props = featureCollection.features[0].properties;
				if(props)
					return console.log(props);
				//return console.log(featureCollection.features[0]);
		});		
		var overlayMaps = {
			"SMAs" : smaLayer,
			"BLM" : BLMAdminLayer
		};
			
		// pull in the polygon from the record geojson file.
		var fileLocation = SAVED_SITES.slice(0).find(run => run.id == id).location;
//		console.log(fileLocation);
		
		var loc = omnivore.geojson(fileLocation);
//		console.log(loc);

		var geojsonLayer = new L.GeoJSON.AJAX(fileLocation);
//		console.log(geojsonLayer);

		var bounds = geojsonLayer.getBounds();
//		console.log(bounds);
		
		var cent = bounds.getNorthEast();
		console.log(cent);

		// create mymap and default map, zoom, and location.
		var myMap = L.map('map', {
			center : [39.754264, -105.002441],
			zoom : 12,
			layers: [topoMap]
		});
		
		L.control.layers(baseMaps, overlayMaps).addTo(myMap);

		L.easyPrint({
			title: 'My awesome print button',
			position: 'topright',
			elementsToHide: 'p, h2'
		}).addTo(myMap);
		
		//loc.addTo(myMap);
		geojsonLayer.addTo(myMap);
		

		// Below this is the stuff to add the leaflet-draw stuff.
		var editableLayers = new L.FeatureGroup();
		myMap.addLayer(editableLayers);
		var MyCustomMarker = L.Icon.extend({
			options: {
				shadowUrl: null,
				iconAnchor: new L.Point(12, 12),
				iconSize: new L.Point(18, 18),
				iconUrl: '../assets/img/smiley.png'
			}
		});
		var options = {
			position: 'topleft',
			draw: {
				polyline: {
					shapeOptions: {
						color: '#f357a1',
						weight: 2
					}
				},
				polygon: {
					allowIntersection: false, // Restricts shapes to simple polygons 
					drawError: {
						color: '#e1e100', // Color the shape will turn when intersects 
						message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect 
					},
					shapeOptions: {
						color: '#bada55'
					}
				},
				circle: false, // Turns off this drawing tool 
				rectangle: {
					shapeOptions: {
						clickable: false
					}
				},
				marker: {
					icon: new MyCustomMarker()
				}
			},
			edit: {
				featureGroup: editableLayers, //REQUIRED!! 
				remove: false
			}
		};
		var drawControl = new L.Control.Draw(options);
		myMap.addControl(drawControl);
		myMap.on(L.Draw.Event.CREATED, function (e) {
			var type = e.layerType,
				layer = e.layer;
		
			if (type === 'marker') {
				layer.bindPopup('A popup!');
			}
		
			editableLayers.addLayer(layer);
		});
		
		/*
		var myLines = [{
			"type": "LineString",
			"coordinates": [[-105.003439, 39.753977], [-105.001150, 39.755752]]
		}, {
		"type": "LineString",
		"coordinates": [[-105.002607, 39.753283], [-105.000040, 39.751234]]
		}];

		var myStyle = {
			"color": "#ff7800",
			"weight": 5,
			"opacity": 0.65
		};
		
		L.geoJSON(myLines, {
		style: myStyle
		}).addTo(myMap);
		
		var campus = {
			"type": "Feature",
			"properties": {
				"popupContent": "This is the Auraria West Campus",
				"style": {
					weight: 2,
					color: "#999",
					opacity: 1,
					fillColor: "#B0DE5C",
					fillOpacity: 0.8
				}
			},
			"geometry": {
				"type": "MultiPolygon",
				"coordinates": [
					[
						[
							[-105.00432014465332, 39.74732195489861],
							[-105.00715255737305, 39.74620006835170],
							[-105.00921249389647, 39.74468219277038],
							[-105.01067161560059, 39.74362625960105],
							[-105.01195907592773, 39.74290029616054],
							[-105.00989913940431, 39.74078835902781],
							[-105.00758171081543, 39.74059036160317],
							[-105.00346183776855, 39.74059036160317],
							[-105.00097274780272, 39.74059036160317],
							[-105.00062942504881, 39.74072235994946],
							[-105.00020027160645, 39.74191033368865],
							[-105.00071525573731, 39.74276830198601],
							[-105.00097274780272, 39.74369225589818],
							[-105.00097274780272, 39.74461619742136],
							[-105.00123023986816, 39.74534214278395],
							[-105.00183105468751, 39.74613407445653],
							[-105.00432014465332, 39.74732195489861]
						],[
							[-105.00361204147337, 39.74354376414072],
							[-105.00301122665405, 39.74278480127163],
							[-105.00221729278564, 39.74316428375108],
							[-105.00283956527711, 39.74390674342741],
							[-105.00361204147337, 39.74354376414072]
						]
					],[
						[
							[-105.00942707061768, 39.73989736613708],
							[-105.00942707061768, 39.73910536278566],
							[-105.00685214996338, 39.73923736397631],
							[-105.00384807586671, 39.73910536278566],
							[-105.00174522399902, 39.73903936209552],
							[-105.00041484832764, 39.73910536278566],
							[-105.00041484832764, 39.73979836621592],
							[-105.00535011291504, 39.73986436617916],
							[-105.00942707061768, 39.73989736613708]
						]
					]
				]
			}
		};
		
		L.geoJSON(campus).addTo(myMap);
		*/		
		
		//This is if we were using mapbox for our baselayers, or other things.
		/*
		L.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
			maxoom: 18,
			id: 'mapbox.streets-basic',
			accessToken: apiToken
		}).addTo(myMap);
		*/
	}
}
