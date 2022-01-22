import { Pipe, PipeTransform } from '@angular/core';
import { EnumService } from 'src/app/core/services/enumService/enum.service';

@Pipe({ name: 'translation' })
export default class TranslationPipe implements PipeTransform {
  constructor(private enumService: EnumService) {}

  transform(value: string, type: string): string {
    if (!this.enumService[`translate${type}`]) {
      return 'N/A';
    }
    return this.enumService[`translate${type}`](value);
  }
}
