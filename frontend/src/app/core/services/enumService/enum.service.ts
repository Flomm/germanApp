import { Injectable } from '@angular/core';
import { TopicTypeTranslation } from 'src/app/shared/models/enums/TopicTypeTranslation.enum';

@Injectable({
  providedIn: 'root',
})
export class EnumService {
  translateTopicType(value: string): string {
    return TopicTypeTranslation[value] || 'N/A';
  }
}
