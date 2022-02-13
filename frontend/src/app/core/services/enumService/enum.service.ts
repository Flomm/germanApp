import { Injectable } from '@angular/core';
import { TopicTypeTranslation } from 'src/app/shared/models/enums/TopicTypeTranslation.enum';
import { UserRoleTranslation } from 'src/app/shared/models/enums/UserRoleTranslation.enum';

@Injectable({
  providedIn: 'root',
})
export class EnumService {
  translateTopicType(value: number | string): string {
    return TopicTypeTranslation[value] || 'N/A';
  }

  translateUserType(value: number | string): string {
    console.warn(value);
    return UserRoleTranslation[value] || 'N/A';
  }
}
