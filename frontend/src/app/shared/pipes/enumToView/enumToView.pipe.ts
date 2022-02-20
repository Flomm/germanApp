import { Pipe, PipeTransform } from '@angular/core';
import IValueName from '../../models/viewModels/IValueName.viewModel';

@Pipe({ name: 'enumToView' })
export default class EnumToViewPipe implements PipeTransform {
  transform(enumType: Record<string, unknown>): IValueName[] {
    const enumTypeList: IValueName[] = [];
    for (const [type, value] of Object.entries(enumType)) {
      if (isNaN(parseInt(type, 10))) {
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
