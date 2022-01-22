import { Pipe, PipeTransform } from '@angular/core';
import IValueName from '../../models/viewModels/IValueName.viewModel';

@Pipe({ name: 'enumToView' })
export default class EnumToViewPipe implements PipeTransform {
  transform(enumType: Object): IValueName[] {
    let enumTypeList: IValueName[] = [];
    for (let [type, value] of Object.entries(enumType)) {
      if (isNaN(parseInt(type))) {
        const newType: IValueName = {
          name: type,
          value: value as number,
        };
        enumTypeList.push(newType);
      }
    }
    return enumTypeList;
  }
}
