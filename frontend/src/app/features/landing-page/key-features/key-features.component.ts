import { Component } from '@angular/core';
import IFeatureData from './IFeatureData.model';
import { featureDataList } from './featureDataList';

@Component({
  selector: 'app-key-features',
  templateUrl: './key-features.component.html',
  styleUrls: ['./key-features.component.scss'],
})
export class KeyFeaturesComponent {
  featureDataColumns: IFeatureData[] = featureDataList;
}
