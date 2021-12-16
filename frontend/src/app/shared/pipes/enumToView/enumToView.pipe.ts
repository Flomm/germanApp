import { Pipe, PipeTransform } from '@angular/core';
import IValueName from '../../models/models/viewModels/IValueName.viewModel';

@Pipe({ name: 'enumToView' })
export default class EnumToViewPipe implements PipeTransform {
  transform(enumType: Object): IValueName[] {
    let enumTypeList: IValueName[] = [];
    for (let [type, value] of Object.entries(enumType)) {
      const newType: IValueName = {
        name: type,
        value: value,
      };
      enumTypeList.push(newType);
    }
    return enumTypeList;
  }
}
